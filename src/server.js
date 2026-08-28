import "dotenv/config";
import cron from "node-cron";
import app from "./app.js";
import { sendDepartureReminders } from "./services/reminderService.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Dreamtrip server running on port ${PORT}`);
});

cron.schedule("* * * * *", () => {
  sendDepartureReminders();
});

console.log("Departure reminder job scheduled to run every minute.");
