import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';

export async function registerUserHandler(app: FastifyInstance) {
    app.post('/register', async (request, reply) => {            
        if (!request.body) return reply.status(400).send('Bad Request');
        try {
            const userSchema = z.object({
                name: z.string(),
                email: z.string(),
                password: z.string(),
                bornDate: z.coerce.date().optional(),
            });
    
            const userInfo = userSchema.parse(request.body);
            
            const bcrypt = require('bcrypt');
    
            // Hash da senha usando o bcrypt
            const hashedPassword = await bcrypt.hash(userInfo.password, 10); // Use um valor de salt adequado (10 é um valor comum)
    
            let user = await prisma.user.create({
                data: {
                    name: userInfo.name,
                    email: userInfo.email,
                    password: hashedPassword, // Salve a senha encriptada no banco de dados
                    bornDate: userInfo.bornDate,
                },
            });
    
            const token = app.jwt.sign(
                {
                    name: user.name,
                },
                {
                    sub: user.id,
                    expiresIn: '3 days',
                }
            );
    
            return reply.status(200).send(token);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    });    

    app.put('/register', async (request, reply) => {            
        if(!request.body) return reply.status(400).send('Bad Request');
        try {
        const userSchema = z.object({
                bornDate: z.coerce.date(),
                userId: z.string(),
            });

            const userInfo = userSchema.parse(request.body)

            let user = await prisma.user.update({
                where: {
                    id: userInfo.userId,
                },
                data: {
                    bornDate: userInfo.bornDate ,
                },
            })

            const token = app.jwt.sign(
                {
                    name: user.name,
                },
                {
                    sub: user.id,
                    expiresIn: '3 days',
                }
            )

            return reply.status(200).send(token);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    })
}