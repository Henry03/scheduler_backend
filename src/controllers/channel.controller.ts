import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client'
import { response } from '../utils/response';

export const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, url } = req.body;
        console.log(req.user!.id)
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id }
        });

        if (!user) {
            return response(res, false, 404, 'User not found');
        }

        await prisma.channel.create({
            data: {
                userId: req.user!.id,
                type,
                webhookUrl: url
            }
        });

        return response(res, true, 201, 'Channel created successfully');
    } catch (err) {
        next(err);
    }
}
