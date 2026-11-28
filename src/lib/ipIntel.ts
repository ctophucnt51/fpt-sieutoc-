export type IpCategory = "mobile" | "broadband" | "hosting" | "proxy" | "unknown";

export interface IpIntelResult {
  ip: string;
  location: string;
  isp: string;
  org?: string;
  asn: string;
  asname?: string;
  isMobile: boolean;
  isProxy: boolean;
  isHosting: boolean;
  category: IpCategory;
  connectionHint: string;
  source: "ip-api" | "ipwho.is" | "private" | "fallback";
}

const ipIntelCache = new Map<string, { data: IpIntelResult; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function isPrivateIp(ip: string): boolean {
  return (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function extractAsnCode(asField?: string): string {
  if (!asField) return "";
  const match = asField.match(/AS\d+/i);
  return match ? match[0].toUpperCase() : "";
}

function classifyIspAndCategory(params: {
  isp: string;
  org?: string;
  asn: string;
  isMobile: boolean;
  isProxy: boolean;
  isHosting: boolean;
}): { category: IpCategory; connectionHint: string } {
  const combined = `${params.isp} ${params.org || ""} ${params.asn}`.toLowerCase();

  if (params.isHosting) {
    return { category: "hosting", connectionHint: "Datacenter / Bot" };
  }
  if (params.isProxy) {
    return { category: "proxy", connectionHint: "VPN / Proxy" };
  }

  // Mobile-only carriers in Vietnam
  const isMobileOnlyCarrier =
    /vietnamobile|wintel|reddi|itel|gmobile|beeline/i.test(combined);

  if (params.isMobile || isMobileOnlyCarrier) {
    return { category: "mobile", connectionHint: "4G/5G Di động" };
  }

  // Fixed-broadband-only ISPs in Vietnam
  const isFixedBroadbandOnly =
    /fpt telecom|fpt\b|cmc telecom|sctv|netnam|htvc|spt|saigon postel/i.test(combined);

  if (isFixedBroadbandOnly) {
    return { category: "broadband", connectionHint: "Wi-Fi / Cáp quang" };
  }

  // Dual-play Vietnamese telcos (both FTTH and 4G/5G share ASNs/pools like AS7552 Viettel, AS45899 VNPT)
  const isDualPlayTelco = /viettel|vnpt|vinaphone|mobifone|vms/i.test(combined);
  if (isDualPlayTelco) {
    return { category: "broadband", connectionHint: "Cáp quang hoặc 4G/5G" };
  }

  if (params.isp && params.isp !== "Không xác định") {
    return { category: "broadband", connectionHint: "Wi-Fi / Mạng cố định" };
  }

  return { category: "unknown", connectionHint: "Không rõ" };
}

/**
 * Resolve final human-readable connection label by combining client Network Information API
 * (available on Android Chrome/Edge) with server-side IP intelligence (works on iOS Safari too).
 */
export function resolveCombinedNetworkLabel(
  clientNetworkType: string | undefined,
  intel: IpIntelResult
): string {
  if (intel.category === "hosting") return "Datacenter / Bot";
  if (intel.category === "proxy") return "VPN / Proxy";

  const client = (clientNetworkType || "").trim();
  if (client === "Wi-Fi" || client === "Cáp mạng") {
    return client;
  }
  if (
    client === "4G/Di động" ||
    client === "3G/Di động" ||
    client === "2G/Di động" ||
    client === "5G/Di động"
  ) {
    return client;
  }

  if (intel.category === "mobile") {
    return "4G/5G Di động";
  }

  if (client && client !== "Không rõ") {
    // e.g. "Mạng nhanh (4G/Wi-Fi)" when conn.type is unavailable
    if (intel.connectionHint && intel.connectionHint !== "Không rõ") {
      return intel.connectionHint;
    }
    return client;
  }

  return intel.connectionHint || "Không rõ";
}

export async function lookupIpIntel(
  ip: string,
  cfHint?: { city?: string | null; country?: string | null }
): Promise<IpIntelResult> {
  const cleanIp = (ip || "").replace(/^::ffff:/, "").trim();
  const hintLocation = [
    cfHint?.city ? decodeURIComponent(cfHint.city) : "",
    cfHint?.country || "",
  ]
    .filter(Boolean)
    .join(", ");

  if (isPrivateIp(cleanIp)) {
    return {
      ip: cleanIp || "127.0.0.1",
      location: hintLocation || "Localhost / Nội bộ",
      isp: "Mạng nội bộ",
      asn: "",
      isMobile: false,
      isProxy: false,
      isHosting: false,
      category: "unknown",
      connectionHint: "Local / Nội bộ",
      source: "private",
    };
  }

  const cached = ipIntelCache.get(cleanIp);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 1. Primary: ip-api.com (includes isp, org, as, mobile, proxy, hosting)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(
        cleanIp
      )}?fields=status,country,regionName,city,isp,org,as,asname,mobile,proxy,hosting&lang=vi`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.status === "success") {
        const location =
          [data.city || data.regionName, data.country].filter(Boolean).join(", ") ||
          hintLocation ||
          "Không xác định";
        const isp = String(data.isp || data.org || "Không xác định").trim();
        const asn = extractAsnCode(data.as);
        const isMobile = Boolean(data.mobile);
        const isProxy = Boolean(data.proxy);
        const isHosting = Boolean(data.hosting);
        const { category, connectionHint } = classifyIspAndCategory({
          isp,
          org: data.org,
          asn,
          isMobile,
          isProxy,
          isHosting,
        });

        const result: IpIntelResult = {
          ip: cleanIp,
          location,
          isp,
          org: data.org || undefined,
          asn,
          asname: data.asname || undefined,
          isMobile,
          isProxy,
          isHosting,
          category,
          connectionHint,
          source: "ip-api",
        };
        ipIntelCache.set(cleanIp, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      }
    }
  } catch {
    // Fall through to secondary provider
  }

  // 2. Fallback: ipwho.is (HTTPS, no key needed)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(cleanIp)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        const location =
          [data.city || data.region, data.country].filter(Boolean).join(", ") ||
          hintLocation ||
          "Không xác định";
        const isp = String(
          data.connection?.isp || data.connection?.org || "Không xác định"
        ).trim();
        const asn = data.connection?.asn ? `AS${data.connection.asn}` : "";
        const { category, connectionHint } = classifyIspAndCategory({
          isp,
          org: data.connection?.org,
          asn,
          isMobile: false,
          isProxy: false,
          isHosting: false,
        });

        const result: IpIntelResult = {
          ip: cleanIp,
          location,
          isp,
          org: data.connection?.org || undefined,
          asn,
          isMobile: false,
          isProxy: false,
          isHosting: false,
          category,
          connectionHint,
          source: "ipwho.is",
        };
        ipIntelCache.set(cleanIp, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      }
    }
  } catch {
    // Ignore fallback timeout
  }

  return {
    ip: cleanIp,
    location: hintLocation || "Không xác định",
    isp: "Không xác định",
    asn: "",
    isMobile: false,
    isProxy: false,
    isHosting: false,
    category: "unknown",
    connectionHint: "Không rõ",
    source: "fallback",
  };
}
