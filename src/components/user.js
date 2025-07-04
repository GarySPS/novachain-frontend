import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import Icon from "./icon";
import Image from "./image";
import Switch from "./switch";
import NavLink from "./navlink";
import { useNavigate } from "react-router-dom";

export default function User({ className = "" }) {
    const [isLightMode, setIsLightMode] = useState(false);
    const toggleColorMode = () => setIsLightMode((v) => !v);
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("token");
        // Optional: clear other session items if used
        // localStorage.clear(); 
        navigate("/login");
        window.location.reload(); // Force logout everywhere
    };

    return (
        <Menu as="div" className={`relative ${className}`}>
            <Menu.Button className="group w-12 h-12">
                <Image
                    className="w-12 h-12 object-cover rounded-full opacity-100"
                    src="/images/avatar.jpg"
                    width={48}
                    height={48}
                    alt=""
                />
            </Menu.Button>
            <Menu.Items
                className="absolute top-full -right-4 w-[19.75rem] mt-2 p-3 rounded-2xl border border-theme-stroke bg-theme-surface-pure shadow-depth-1 lg:right-0 z-50"
                style={{ zIndex: 50 }}
            >
                <div className="flex items-center mb-2 p-3 rounded-xl bg-theme-n-8">
                    <Image
                        className="w-16 h-16 rounded-full opacity-100"
                        src="/images/avatar.jpg"
                        width={64}
                        height={64}
                        alt=""
                    />
                    <div className="grow pl-4.5">
                        <div className="text-title-1s">Display Name</div>
                        <div className="text-body-1m text-theme-secondary">
                            @username
                        </div>
                    </div>
                </div>
                <div className="mb-2 space-y-1">
                    <NavLink title="Settings" icon="settings" url="/settings" />
                    <NavLink title="Contact support" icon="support" url="/support" />
                    <div className="group flex items-center h-12 px-4 rounded-xl transition-colors hover:bg-theme-on-surface-2 cursor-pointer">
                        <Icon
                            className="shrink-0 mr-4 fill-theme-secondary transition-colors group-hover:fill-theme-primary"
                            name={isLightMode ? "moon" : "sun"}
                        />
                        <div className="mr-auto text-base-1s text-theme-secondary transition-colors group-hover:text-theme-primary">
                            {isLightMode ? "Dark" : "Light"}
                        </div>
                        <Switch
                            value={isLightMode}
                            setValue={toggleColorMode}
                            small
                            theme
                        />
                    </div>
                    <NavLink title="News" icon="news" url="/news" />
                </div>
                {/* Updated logout: this button removes token and reloads */}
                <button
                    onClick={handleLogout}
                    className="group flex items-center w-full h-12 px-4 rounded-xl transition-colors hover:bg-theme-on-surface-2 cursor-pointer"
                >
                    <Icon
                        className="shrink-0 mr-4 fill-theme-secondary transition-colors group-hover:fill-theme-primary"
                        name="logout"
                    />
                    <div className="mr-auto text-base-1s text-theme-secondary transition-colors group-hover:text-theme-primary">
                        Log out
                    </div>
                </button>
            </Menu.Items>
        </Menu>
    );
}
