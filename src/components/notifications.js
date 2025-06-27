import React from "react";
import { Menu } from "@headlessui/react";
import { Link } from "react-router-dom";
import Icon from "./icon"; // Adjust path if necessary
import Image from "./image"; // Adjust path if necessary

// Example: Replace with your notifications source or state
const notifications = [
  {
    id: 1,
    type: "alert",
    content: "Withdrawal request approved!",
    time: "2m ago",
  },
  {
    id: 2,
    type: "update",
    content: "Your KYC has been verified.",
    time: "5m ago",
  },
  // Add more notifications as needed
];

export default function Notifications() {
  return (
    <Menu as="div" className="relative md:static">
      <Menu.Button className="relative group w-12 h-12 md:w-8 md:h-8">
        <Icon
          className="fill-theme-secondary transition-colors group-hover:fill-theme-primary"
          name="notification"
        />
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-2 border-theme-n-8 bg-theme-red rounded-full md:top-0 md:right-1"></div>
      </Menu.Button>
      <Menu.Items
        className="absolute top-full -right-18 w-[21.25rem] mt-2 rounded-2xl border border-theme-stroke bg-theme-surface-pure shadow-depth-1 md:w-auto md:max-h-[calc(100vh-6.4375rem)] md:left-4 md:right-4 md:mt-0 md:overflow-auto md:scrollbar-none md:scroll-smooth"
        style={{ zIndex: 1000 }}
      >
        <div>
          {notifications.map((notification) => (
            <div
              className="flex p-4 border-b border-theme-stroke last:border-0"
              key={notification.id}
            >
              <div
                className={`flex justify-center items-center shrink-0 w-12 h-12 rounded-full ${
                  notification.type === "alert"
                    ? "bg-theme-red-100"
                    : notification.type === "update"
                    ? "bg-theme-green-100"
                    : "bg-theme-brand-100"
                }`}
              >
                <Image
                  className="w-5 opacity-100"
                  src={
                    notification.type === "alert"
                      ? "/images/bell-red.svg"
                      : notification.type === "update"
                      ? "/images/number-one.svg"
                      : "/images/bell-blue.svg"
                  }
                  width={20}
                  height={20}
                  alt=""
                />
              </div>
              <div className="grow pl-4">
                <div className="notification text-caption-1 text-theme-secondary">
                  {notification.content}
                </div>
                <div className="mt-2 text-caption-2m text-theme-secondary">
                  {notification.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <Link className="btn-secondary w-full" to="/notification">
            View all notification
          </Link>
        </div>
      </Menu.Items>
    </Menu>
  );
}
