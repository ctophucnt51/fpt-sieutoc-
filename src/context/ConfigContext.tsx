"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteConfig as defaultSiteConfig } from "@/config/siteConfig";

export type SiteConfigType = typeof defaultSiteConfig;

interface ConfigContextValue {
  config: SiteConfigType;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue>({
  config: defaultSiteConfig,
  refreshConfig: async () => {},
});

export function ConfigProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: SiteConfigType;
}) {
  const [config, setConfig] = useState<SiteConfigType>(initialConfig || defaultSiteConfig);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch(`/api/site-config?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch {
      // keep existing config
    }
  }, []);

  // Tự động kéo cấu hình mới nhất ngay khi tải trang và khi người dùng quay lại tab
  useEffect(() => {
    refreshConfig();

    const handleFocus = () => {
      refreshConfig();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshConfig]);

  return (
    <ConfigContext.Provider value={{ config, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigType {
  const context = useContext(ConfigContext);
  return context?.config || defaultSiteConfig;
}
