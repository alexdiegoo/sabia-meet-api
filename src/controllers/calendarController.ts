import { Request, Response } from "express";

import { prisma } from "../shared/persistence/orm/prisma";

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
                    userId: user.id,
                    date: {
                        gte: new Date(start_date as string),
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
}