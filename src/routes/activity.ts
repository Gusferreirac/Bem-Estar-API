import { FastifyInstance} from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';

export async function activityHandler(app: FastifyInstance) {
    app.post('/activity-register', async (request, reply) => {            
        if(!request.body) return reply.status(400).send('Bad Request');
        try {
            const activitySchema = z.object({
                    name: z.string(),
                    startTime: z.coerce.date(),
                    endTime: z.coerce.date(),
                    userId: z.string(),
            });

            const activityInfo = activitySchema.parse(request.body) 
            
            await prisma.activity.create({
                data: {
                    name: activityInfo.name,
                    startTime: activityInfo.startTime,
                    endTime: activityInfo.endTime,
                    userId: activityInfo.userId,
                },
            })

            return reply.status(200).send(true);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })

    app.get('/activity/:userId', async (request, reply) => {            
        if(!request.params) return reply.status(400).send('Bad Request');
        try {
            const activitySchema = z.object({
                    userId: z.string(),
            });

            const activityInfo = activitySchema.parse(request.params)

            const userActivity= await prisma.activity.findMany({
                where:{
                    userId: activityInfo.userId,
                }
            })

            return reply.status(200).send(userActivity);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })
}