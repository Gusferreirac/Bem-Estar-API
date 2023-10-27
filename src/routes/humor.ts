import { FastifyInstance} from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';

export async function humorHandler(app: FastifyInstance) {
    app.post('/humor-register', async (request, reply) => {            
        if(!request.body) return reply.status(400).send('Bad Request');
        try {
            const humorSchema = z.object({
                    date: z.coerce.date(),
                    feeling: z.string(),
                    userId: z.string(),
            });

            const humorInfo = humorSchema.parse(request.body)
            
            await prisma.humor.create({
                data: {
                    date: humorInfo.date,
                    feeling: humorInfo.feeling,
                    userId: humorInfo.userId,
                },
            })

            return reply.status(200).send(true);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })

    app.get('/humor/:userId', async (request, reply) => {            
        if(!request.params) return reply.status(400).send('Bad Request');
        try {
            const humorSchema = z.object({
                    userId: z.string(),
            });

            const humorInfo = humorSchema.parse(request.params)

            const userHumor= await prisma.humor.findMany({
                where:{
                    userId: humorInfo.userId,
                }
            })

            return reply.status(200).send(userHumor);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })
}