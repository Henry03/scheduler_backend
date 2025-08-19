import { NextFunction, Request, Response } from "express";
import { ulid } from "ulid";
import prisma from "../prisma/client";
import { response } from "../utils/response";
import { addInterval, getMsOffset } from "../utils/time";
import { ReminderInterface } from '../interfaces/schedule.interface'; 

export const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title,
            description,
            tagId,
            ai,
            instruction,
            startTime,
            endTime,
            repeat,
            repeatType,
            repeatInterval,
            repeatLimit,
            repeatUntil,
            reminders,
            skipTags,
            channels
        } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user!.id }
        });

        if (!user) {
            return response(res, false, 404, 'User not found');
        }

        const seriesId = ulid();
        const baseStartTime = new Date(startTime + "Z");
        const baseEndTime = new Date(endTime + "Z");

        const baseStart = new Date(startTime + "Z");

        const remindersWithTrigger = (reminders || []).map((r: ReminderInterface) => {
            const offsetMs = getMsOffset(r.type, r.value);
            const triggerAt = new Date(baseStart.getTime() - offsetMs);
            return { ...r, id: ulid(), triggerAt };
        });

        let scheduleInstances = [];

        scheduleInstances.push({
            id: seriesId,
            seriesId: seriesId,
            title,
            description,
            ai,
            instruction,
            startTime: baseStartTime,
            endTime: baseEndTime,
            reminders: {
                create: remindersWithTrigger || []
            },
            scheduleChannels: {
                create: (channels || []).map((channelId: string) => ({
                    channel: {
                        connect: { id: channelId }
                    }
                }))
            },
            tag: {
                connect: { id: tagId }
            },
            user: {
                connect: { id: user.id }
            }
        })

        if (repeat && repeatType && repeatInterval && (repeatLimit || repeatUntil)) {
            let nextStart = baseStartTime;
            let nextEnd = baseEndTime;
            let counter = 0;

            while (true) {
                nextStart = addInterval(nextStart, repeatType, repeatInterval);
                nextEnd = addInterval(nextEnd, repeatType, repeatInterval);
                counter++;

                console.log("Repeat Until : " + repeatUntil);
                console.log("NextStart : " + nextStart);
                console.log("Repeat Limit : " + repeatLimit);
                console.log("Counter : " + counter);

                if (repeatUntil && nextStart >= new Date(repeatUntil)) break;
                if (repeatLimit && counter >= repeatLimit) break;
                
                if (skipTags && skipTags.length > 0) {
                    const conflicting = await prisma.schedule.findFirst({
                        where: {
                            tagId: { in: skipTags },
                            // Check overlap with current repeat event
                            OR: [
                                {
                                    startTime: { lte: nextEnd },
                                    endTime: { gte: nextStart }
                                }
                            ]
                        }
                    });

                    if (conflicting) {
                        console.log(`Skipping event at ${nextStart} due to skipTag conflict`);
                        continue; // ⏭ skip creating this instance
                    }
                }

                const clonedRemindersWithTrigger = (reminders || []).map((r: ReminderInterface) => {
                    const offsetMs = getMsOffset(r.type, r.value);
                    const triggerAt = new Date(nextStart.getTime() - offsetMs);
                    return { ...r, id: ulid(), triggerAt };
                });

                scheduleInstances.push({
                    id: ulid(),
                    seriesId,
                    title,
                    description,
                    ai,
                    instruction,
                    startTime: nextStart,
                    endTime: nextEnd,
                    reminders: {
                        create: clonedRemindersWithTrigger
                    },
                    scheduleChannels: {
                        create: (channels || []).map((channelId: string) => ({
                            channel: {
                                connect: { id: channelId }
                            }
                        }))
                    },
                    tag: {
                        connect: { id: tagId }
                    },
                    user: {
                        connect: { id: user.id }
                    }
                });
            }
        }

        const result = await prisma.$transaction(
            scheduleInstances.map(schedule => {
                const { reminders, ...scheduleData } = schedule;
                return prisma.schedule.create({
                    data: {
                        ...scheduleData,
                        ...(reminders ? { reminders } : {})
                    }
                });
            })
        );

        return response(res, true, 201, 'Schedule created successfully', result);
    } catch (err) {
        next(err);
    }
}