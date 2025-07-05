import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // <-- ADD THIS
import Image from "./image";

// Skeleton loader matching card style
function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] rounded-2xl shadow-xl p-7 flex flex-col gap-6 animate-pulse border border-[#e0e7ef]"
          style={{
            minHeight: "28rem",
          }}
        >
          <div className="h-6 w-1/2 bg-gradient-to-r from-gray-200 to-gray-100 rounded mb-2" />
          <div className="h-[14rem] w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl mb-2" />
          <div className="h-4 w-2/3 bg-gray-100 rounded mb-1" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsPage() {
  const { t } = useTranslation(); // <-- ADD THIS
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const rssUrl = "https://cointelegraph.com/rss";
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setNews(data.items || []);
      } catch (error) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 font-sans">
      <div className="w-full max-w-6xl mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <div className="text-3xl font-bold text-[#f5f6fa]">{t('latest_updates')}</div>
        </div>

        {loading ? (
          <NewsSkeleton />
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-lg text-[#9ca3af]">
            {t('no_news')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((article) => (
              <div
                className="
                  bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] 
                  rounded-2xl shadow-xl p-7 group flex flex-col 
                  border border-[#e0e7ef] transition-all duration-200
                  hover:shadow-2xl hover:scale-[1.01]
                "
                style={{ minHeight: "28rem" }}
                key={article.guid}
              >
                <div className="flex items-center gap-3 mb-4">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-[#232345] hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {article.title}
                  </a>
                  <span className="ml-auto px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium shadow">
                    CoinTelegraph
                  </span>
                </div>
                <div className="mb-4 w-full rounded-xl overflow-hidden relative aspect-video bg-[#e0e7ef]">
                  <Image
                    className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                    src={
                      article.thumbnail ||
                      (article.enclosure && article.enclosure.link) ||
                      "/news-fallback.jpg"
                    }
                    alt={article.title || ""}
                    style={{
                      background: "#f8fafc",
                      minHeight: "12rem",
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs text-[#7b809a]">
                  <span>{formatDate(article.pubDate)}</span>
                </div>
                <div className="text-base text-[#52525b] md:line-clamp-3">
                  {article.description &&
                    article.description.replace(/(<([^>]+)>)/gi, "").slice(0, 260)}
                  ...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
