"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteConfig as defaultSiteConfig, PackageItem, AreaOption } from "@/config/siteConfig";

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

  const refreshConfig = async () => {
    try {
      const res = await fetch("/api/site-config");
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch {
      // keep existing config
    }
  };

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
