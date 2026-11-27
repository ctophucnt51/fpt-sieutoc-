import { getAllArticles } from "@/lib/articleStorage";
import { isAiConfigured } from "@/lib/seoAiEngine";
import { readMemoryFile, writeMemoryFile } from "@/lib/seoMemory";
import { dispatchTelegramSeoSummary, runSeoMasterCycleAsync } from "@/lib/seoOrchestrator";
import { getSeoConfig } from "@/lib/seoStorage";

interface SchedulerState {
  lastAttemptDate?: string;
  lastAttemptAt?: string;
  lastStatus?: "success" | "skipped" | "error";
  lastSummary?: string;
}

const STATE_FILE = "scheduler-state.json";
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // Check every 10 minutes
const BOOT_DELAY_MS = 20 * 1000; // Wait 20s after server boot
const TARGET_VN_HOUR = 8; // 08:00 AM UTC+7

function getVnNowInfo(): { dateKey: string; hour: number } {
  const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return {
    dateKey: vnTime.toISOString().slice(0, 10),
    hour: vnTime.getUTCHours(),
  };
}

function toVnDateKey(iso?: string): string {
  if (!iso) return "";
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  return new Date(ts + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function runDailyAutoPublishIfDue(): Promise<void> {
  const g = globalThis as typeof globalThis & { __fptSeoTickRunning?: boolean };
  if (g.__fptSeoTickRunning) return;

  const { dateKey, hour } = getVnNowInfo();
  if (hour < TARGET_VN_HOUR) return;

  const seo = getSeoConfig();
  const autoPilot = seo.autoPilotSettings;
  if (autoPilot && (!autoPilot.enabled || !autoPilot.autoApproveArticles)) {
    return;
  }

  if (!isAiConfigured()) return;

  const state = readMemoryFile<SchedulerState>(STATE_FILE, {});
  if (state.lastAttemptDate === dateKey) return;

  // Also check if an article was already published today (UTC+7)
  const articles = getAllArticles(false);
  const publishedToday = articles.some((a) => toVnDateKey(a.createdAt) === dateKey);
  if (publishedToday) {
    writeMemoryFile<SchedulerState>(STATE_FILE, {
      lastAttemptDate: dateKey,
      lastAttemptAt: new Date().toISOString(),
      lastStatus: "skipped",
      lastSummary: "Đã có bài viết xuất bản hôm nay.",
    });
    return;
  }

  g.__fptSeoTickRunning = true;
  writeMemoryFile<SchedulerState>(STATE_FILE, {
    lastAttemptDate: dateKey,
    lastAttemptAt: new Date().toISOString(),
    lastStatus: "skipped",
    lastSummary: "Đang chạy chu kỳ tự đăng bài SEO...",
  });

  try {
    const cycleResult = await runSeoMasterCycleAsync({ collectLive: true, runAi: true });
    if (
      cycleResult.newTasksAdded > 0 ||
      cycleResult.newApprovalsAdded > 0 ||
      cycleResult.autoApprovedCount > 0
    ) {
      await dispatchTelegramSeoSummary();
    }
    writeMemoryFile<SchedulerState>(STATE_FILE, {
      lastAttemptDate: dateKey,
      lastAttemptAt: new Date().toISOString(),
      lastStatus: "success",
      lastSummary: cycleResult.summary,
    });
  } catch (err) {
    writeMemoryFile<SchedulerState>(STATE_FILE, {
      lastAttemptDate: dateKey,
      lastAttemptAt: new Date().toISOString(),
      lastStatus: "error",
      lastSummary: err instanceof Error ? err.message : "Unknown scheduler error",
    });
  } finally {
    g.__fptSeoTickRunning = false;
  }
}

export function startSeoDailyScheduler(): void {
  const g = globalThis as typeof globalThis & { __fptSeoSchedulerStarted?: boolean };
  if (g.__fptSeoSchedulerStarted) return;
  g.__fptSeoSchedulerStarted = true;

  setTimeout(() => {
    void runDailyAutoPublishIfDue();
  }, BOOT_DELAY_MS);

  const timer = setInterval(() => {
    void runDailyAutoPublishIfDue();
  }, CHECK_INTERVAL_MS);

  if (typeof timer.unref === "function") {
    timer.unref();
  }
}
