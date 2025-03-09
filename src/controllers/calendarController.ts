import { Request, Response } from "express";

import { prisma } from "../shared/persistence/orm/prisma";

import { GoogleCalendarService } from "../shared/services/GoogleCalendarService/implementations/GoogleCalendarService";
const googleCalendarService = new GoogleCalendarService();

export class CalendarController {
    async list(req: Request, res: Response): Promise<void> {
        try {
            const user = JSON.parse(req.headers.user as string);
            const { start_date, end_date } = req.query;

            if(!user) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }

            const calendars = await prisma.calendar.findMany({
                where: {
                    userId: Number(user.id),
                    startDate: {
                        gte: new Date(start_date as string)
                    },
                    endDate: {
                        lte: new Date(end_date as string)
                    }
                }
            });

            res.status(200).json(calendars);

        } catch(error) {
            res.status(500).json({
                message: 'Internal server error'
            });

            return;
        }
    }

    async sync(req: Request, res: Response) {
        try {
            const user = JSON.parse(req.headers.user as string);
            const { provider, start_date, end_date } = req.body;

            if(!user) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
                return;
            }

            const integration = await prisma.integration.findFirst({
                where: {
                    userId: user.id,
                    provider: provider
                }
            });

            if(!integration) {
                res.status(404).json({
                    message: 'Integration not found'
                });
                return;
            }

            const events = await googleCalendarService.listEventsByDateRange({
                start_date: new Date(start_date as string).toISOString(),
                end_date: new Date(end_date as string).toISOString(),
                refresh_token: integration?.refreshToken as string,
            });

            if(!events) {
                res.status(404).json({
                    message: 'Events not found'
                });
                return;
            }

            const createEvents = await prisma.calendar.createMany({
                data: events.map(event => ({
                    userId: user.id,
                    integrationId: integration?.id,
                    provider: provider,
                    eventId: event.id,
                    summary: event.summary,
                    startDate: event.start.dateTime,
                    endDate: event.end.dateTime,
                    link: event.conferenceData.entryPoints.filter(point => point.entryPointType === 'video')[0].uri,
                }))
            })
            
            res.status(200).json(createEvents);

        } catch(error) {
            res.status(500).json({
                message: 'Internal server error'
            });
            return; 
        }
    }
}