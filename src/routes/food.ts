import { FastifyInstance} from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function foodHandler(app: FastifyInstance) {
    app.post('/food-register', async (request, reply) => {            
        if(!request.body) return reply.status(400).send('Bad Request');
        try {
            const foodSchema = z.object({
                    date: z.coerce.date(),
                    description: z.string(),
                    userId: z.string(),
                    photo: z.string(),
            });

            const foodInfo = foodSchema.parse(request.body)

            const folder = '/bem-estar'
            
            const imageConfig = {
                folder,
                quality: 80,
            }

            const uploadRes = await cloudinary.uploader.upload(foodInfo.photo, imageConfig) 

            await prisma.food.create({
                data: {
                    date: foodInfo.date,
                    description: foodInfo.description,
                    userId: foodInfo.userId,
                    photoPath: uploadRes.secure_url,
                },
            })

            return reply.status(200).send(true);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })

    app.get('/food/:userId', async (request, reply) => {            
        if(!request.params) return reply.status(400).send('Bad Request');
        try {
            const foodSchema = z.object({
                    userId: z.string(),
            });

            const foodInfo = foodSchema.parse(request.params)

            const userFood = await prisma.food.findMany({
                where:{
                    userId: foodInfo.userId,
                }
            })

            return reply.status(200).send(userFood);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })
}