import cron from "node-cron";
import prisma from "../prisma/client";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateGeminiText(
    title: string,
    description: string,
    instruction: string,
    eventTime: Date,
    reminderTime: Date
) {
    const isSameTime =
        eventTime.getFullYear() === reminderTime.getFullYear() &&
        eventTime.getMonth() === reminderTime.getMonth() &&
        eventTime.getDate() === reminderTime.getDate() &&
        eventTime.getHours() === reminderTime.getHours() &&
        eventTime.getMinutes() === reminderTime.getMinutes();

    const eventDateFormatted = eventTime.toLocaleDateString("id-ID", { dateStyle: "full" });
    const eventTimeFormatted = eventTime.toLocaleTimeString("id-ID", { timeStyle: "short" });

    const prompt = `
        Anda adalah asisten pribadi yang bersahabat.
        Berikut informasi sebuah acara:

        Judul: ${title}
        Deskripsi: ${description}
        Waktu Acara: ${eventDateFormatted}${isSameTime ? "" : ` jam ${eventTimeFormatted}`}

        Tulis pesan singkat (maksimal 50 kata) dalam bahasa Indonesia.

        Penting : ${instruction}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
}

export function reminderCron() {
    cron.schedule("* * * * * *", async () => {
        const now = new Date();
        console.log(now)
    
        const twoSecondsAgo = new Date(now.getTime() - 1000);
    
        const dueReminders = await prisma.reminder.findMany({
            where: {
                triggerAt: { gte: twoSecondsAgo, lte: now },
                OR: [
                    { reminderLogs: { none: {} } },
                    { reminderLogs: { some: { status: "FAILED" } } }
                ]
            },
            include: {
                schedule: {
                    include: {
                        scheduleChannels: {
                            include: {
                                channel: true
                            }
                        }
                    }
                }
            }
        });
        
        for (const reminder of dueReminders) {
            console.log(`Triggering reminder: ${reminder.id}`);
            console.log(reminder)

            let message = reminder.schedule.description;

            if (reminder.schedule.ai) {
                try {
                    message = await generateGeminiText(
                        reminder.schedule.title,
                        reminder.schedule.description,
                        reminder.schedule.instruction ?? "",
                        reminder.schedule.startTime,
                        now
                    );
                } catch (aiError) {
                    console.error("❌ AI generation failed, fallback to description:", aiError);
                    continue;
                }
            }

            for (const sc of reminder.schedule.scheduleChannels) {
                try {
                    if (sc.channel.type === "TEAMS") {
                        await axios.post(sc.channel.webhookUrl, {
                            text: message
                        });
                    }

                    await prisma.reminderLog.create({
                        data: {
                        reminderId: reminder.id,
                        channelId: sc.channelId,
                        status: "SUCCESS",
                        response: "Sent successfully"
                        }
                    });

                    console.log(`✅ Sent reminder for schedule ${reminder.scheduleId} to channel ${sc.channelId}`);
                } catch (error) {
                    await prisma.reminderLog.create({
                        data: {
                        reminderId: reminder.id,
                        channelId: sc.channelId,
                        status: "FAILED",
                        response: String(error)
                        }
                    });

                    console.error(`❌ Failed to send reminder for ${reminder.scheduleId} to channel ${sc.channelId}`, error);
                }
            }
        }
    });
}