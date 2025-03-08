import { Request, Response } from "express";
import { prisma } from "../shared/persistence/orm/prisma";

export class IntegrationController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = JSON.parse(req.headers.user as string);

            if(!user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { provider, accessToken, refreshToken, expiresAt } = req.body;

            const userId = Number(user.id);

            const integrationExists = await prisma.integration.findFirst({
                where: {
                    userId,
                    provider
                }
            });

            if(integrationExists) {
                res.status(400).json({ message: 'Integration already exists' });
                return;
            }

            const integration = await prisma.integration.create({
                data: {
                    provider,
                    accessToken,
                    refreshToken,
                    expiresAt,
                    userId
                }
            });

            res.status(201).json(integration);
        } catch(error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }

    async delete(req: Request, res: Response) {
        const user = JSON.parse(req.headers.user as string);

        if(!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const integration = await prisma.integration.findFirst({
            where: {
                id: Number(id),
                userId: Number(user.id)
            }
        });

        if(!integration) {
            res.status(404).json({ message: 'Integration not found' });
            return;
        }

        await prisma.integration.delete({
            where: {
                id: Number(id)
            }
        });

        res.status(204).json();
    }

    async list(req: Request, res: Response) {
        const user = JSON.parse(req.headers.user as string);
        if(!user) {
            res.status(401).json({ message: 'Unauthorized' });   return;
        }
        const integrations = await prisma.integration.findMany({
            where: {
                userId: Number(user.id)
            },
            select: {
                id: true,
                provider: true
            }
        });
        res.status(200).json(integrations);
    }
}
