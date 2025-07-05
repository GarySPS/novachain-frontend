import { useState, useEffect } from "react";
import Tabs from "./tabs";
import Select from "./select";
import Image from "./image";

const tabs = [
  { id: "0", title: "All" },
  { id: "1", title: "Announcements" },
  { id: "2", title: "Crypto" },
  { id: "3", title: "AI features" },
  { id: "4", title: "Change logs" },
];

// --- Premium shimmer skeleton, matches card style ---
function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="bg-white bg-opacity-5 rounded-3xl shadow-lg p-8 animate-pulse flex flex-col gap-6"
          style={{
            minHeight: "28rem",
            border: "1.5px solid #efefef22",
          }}
        >
          <div className="h-6 w-1/2 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
          <div className="h-[14rem] w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
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
  const [type, setType] = useState(tabs[0]);
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
    <div className="w-full flex flex-col items-center px-2 sm:px-4">
      <div className="w-full max-w-6xl mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <div className="text-h2 font-bold">Latest Updates</div>
          <div className="flex-1 flex md:justify-end gap-4">
            <Tabs
              className="hidden md:flex"
              items={tabs}
              value={type}
              setValue={setType}
            />
            <Select
              className="md:hidden w-full"
              value={type}
              onChange={setType}
              items={tabs}
            />
          </div>
        </div>

        {loading ? (
          <NewsSkeleton />
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-lg text-theme-secondary">
            No news found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((article) => (
              <div
                className="bg-white bg-opacity-5 rounded-3xl shadow-lg p-8 group flex flex-col transition-all hover:shadow-2xl border border-theme-stroke hover:border-theme-brand"
                style={{
                  minHeight: "28rem",
                }}
                key={article.guid}
              >
                <div className="flex items-center gap-3 mb-4">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-h5 font-semibold hover:text-theme-brand transition-colors"
                  >
                    {article.title}
                  </a>
                  <span className="ml-auto px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold tracking-wide shadow-sm">
                    CoinTelegraph
                  </span>
                </div>
                <div className="mb-4 w-full rounded-2xl overflow-hidden relative aspect-video bg-gray-100">
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
                <div className="flex items-center gap-2 mb-3 text-theme-secondary text-xs">
                  <span>{formatDate(article.pubDate)}</span>
                  {/* Optionally add a clock icon or time */}
                </div>
                <div className="text-base-1s text-theme-secondary md:line-clamp-3">
                  {article.description &&
                    article.description
                      .replace(/(<([^>]+)>)/gi, "")
                      .slice(0, 260)}
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
