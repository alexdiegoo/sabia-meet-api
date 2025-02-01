import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();

router.post("/accounts", async (req: Request, res: Response): Promise<any> => {
   try {
    const prisma = new PrismaClient();
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });

    if (!user) {
        return res.json({ message: 'error' }).status(400);
    }

    return res.json(user).status(201);
   } catch(error) {
    return res.json({ message: 'error' }).status(400);
   }
})

export default router;