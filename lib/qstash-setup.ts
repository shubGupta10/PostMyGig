import { Client } from "@upstash/qstash";

const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
});

export async function setupDailyProjectExpiration() {
  try {
    const response = await qstash.publishJSON({
      url: "https://postgig.vercel.app/api/cron/expire-projects",
      cron: "0 0 * * *",
    });

    console.log("Daily cron scheduled successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to schedule daily cron:", error);
    throw error;
  }
}

// Optional: Function to cancel all schedules for this URL
export async function cancelProjectExpirationSchedules() {
  try {
    const schedules = await qstash.schedules.list();
    const targetSchedules = schedules.filter(schedule => 
      schedule.destination === "https://postgig.vercel.app/api/cron/expire-projects"
    );

    for (const schedule of targetSchedules) {
      await qstash.schedules.delete(schedule.scheduleId);
      console.log(`Cancelled schedule: ${schedule.scheduleId}`);
    }

    return { cancelled: targetSchedules.length };
  } catch (error) {
    console.error("Failed to cancel schedules:", error);
    throw error;
  }
}