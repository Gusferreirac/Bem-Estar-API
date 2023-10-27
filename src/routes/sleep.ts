import { FastifyInstance} from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';

export async function sleepHandler(app: FastifyInstance) {
    app.post('/sleep-register', async (request, reply) => {            
        if(!request.body) return reply.status(400).send('Bad Request');
        try {
            const sleepSchema = z.object({
                    startTime: z.coerce.date(),
                    endTime: z.coerce.date(),
                    rating: z.number(),
                    feeling: z.string(),
                    userId: z.string(),
            });

            const sleepInfo = sleepSchema.parse(request.body)
            
            await prisma.sleep.create({
                data: {
                    startTime: sleepInfo.startTime,
                    endTime: sleepInfo.endTime,
                    stars: sleepInfo.rating,
                    feeling: sleepInfo.feeling,
                    userId: sleepInfo.userId,
                },
            })

            return reply.status(200).send(true);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })

    app.get('/sleep/:userId', async (request, reply) => {            
        if(!request.params) return reply.status(400).send('Bad Request');
        try {
            const sleepSchema = z.object({
                    userId: z.string(),
            });

            const sleepInfo = sleepSchema.parse(request.params)

            const userSleep= await prisma.sleep.findMany({
                where:{
                    userId: sleepInfo.userId,
                }
            })

            return reply.status(200).send(userSleep);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })
}