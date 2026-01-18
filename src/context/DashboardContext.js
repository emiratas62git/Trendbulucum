"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    // Default visible platforms
    const [visiblePlatforms, setVisiblePlatforms] = useState(['youtube', 'tiktok']);

    const togglePlatform = (platform) => {
        setVisiblePlatforms(prev => {
            if (prev.includes(platform)) {
                return prev.filter(p => p !== platform);
            } else {
                return [...prev, platform];
            }
        });
    };

    const isPlatformVisible = (platform) => {
        return visiblePlatforms.includes(platform);
    };

    const reorderPlatforms = (newOrder) => {
        setVisiblePlatforms(newOrder);
    };

    return (
        <DashboardContext.Provider value={{ visiblePlatforms, togglePlatform, isPlatformVisible, reorderPlatforms }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    return useContext(DashboardContext);
}
