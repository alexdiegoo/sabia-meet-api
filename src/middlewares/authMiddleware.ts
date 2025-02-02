import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const [, token] = req.headers.authorization?.split(' ') || ['', ''];

    if(!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    } 

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        const userIdFromToken = typeof payload !== "string" && payload.id;

        if(!userIdFromToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userIdFromToken
            }
        });

        if(!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        req.headers['user'] = JSON.stringify(user);

        return next();
    } catch(error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}