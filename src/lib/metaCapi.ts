import crypto from "crypto";

interface CapiLeadParams {
  eventId: string;
  phone: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  sourceUrl: string;
  packageName?: string;
}

// SHA-256 helper for hashing PII per Meta specifications (normalized, trimmed, lowercase)
function hashSha256(val: string): string {
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

export async function sendMetaConversionsApiEvent(params: CapiLeadParams): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN;

  // Only execute if both Pixel ID and Server Access Token are present
  if (!pixelId || !accessToken) {
    return false;
  }

  try {
    // Format VN phone with country code (84xxx) for Meta
    let formattedPhone = params.phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "84" + formattedPhone.slice(1);
    }
    const hashedPhone = hashSha256(formattedPhone);

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId,
          event_source_url: params.sourceUrl,
          action_source: "website",
          user_data: {
            ph: [hashedPhone],
            client_ip_address: params.clientIp,
            client_user_agent: params.userAgent,
            fbc: params.fbc || undefined,
            fbp: params.fbp || undefined,
          },
          custom_data: {
            content_name: params.packageName || "Internet FPT Consultation",
            currency: "VND",
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn("Meta CAPI responded with error:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Error sending Meta CAPI event:", error);
    return false;
  }
}
