export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startSeoDailyScheduler } = await import("@/lib/seoScheduler");
    startSeoDailyScheduler();
  }
}
