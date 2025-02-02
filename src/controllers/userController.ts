import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UserController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const userExists = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if(userExists) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password
                }
            });
        
            res.status(201).json();
            return;
        } catch(error) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
} 