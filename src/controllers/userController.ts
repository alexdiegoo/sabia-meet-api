import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../shared/persistence/orm/prisma";

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

            const passwordHash = await bcrypt.hash(password, 10) as string;

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash
                }
            });
        
            res.status(201).json();
            return;
        } catch(error) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if(!user) {
                res.status(400).json({ message: 'Invalid email or password' });
                return;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if(!isValidPassword) {
                res.status(400).json({ message: 'Invalid email or password' });
                return;
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET as string,
                { expiresIn: '3d' }
            )
            
            res.status(200).json({ data: { user: {
                id: user.id,
                name: user.name,
                email: user.email
            }, token }});
            return;

        } catch(error) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
} 