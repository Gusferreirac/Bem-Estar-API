import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma'
import { z } from 'zod';

export async function logInHandler(app: FastifyInstance) {
    app.post('/login', async (request, reply) => {
        if (!request.body) return reply.status(400).send('Bad Request');
        
        try {
            const userSchema = z.object({
                email: z.string(),
                password: z.string(),
            });
    
            const userInfo = userSchema.parse(request.body);
            
            // Encontre o usuário pelo e-mail
            const user = await prisma.user.findUnique({
                where: {
                    email: userInfo.email,
                },
            });
    
            if (!user) {
                // Usuário não encontrado
                return reply.status(401).send('Unauthorized');
            }
    

            const bcrypt = require('bcrypt');

            // Compare a senha fornecida com a senha armazenada no banco de dados
            const isPasswordValid = await bcrypt.compare(userInfo.password, user.password);
    
            if (isPasswordValid) {
                // Senha válida
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
            } else {
                // Senha inválida
                return reply.status(401).send('Unauthorized');
            }
        } catch (error) {
            console.error(error);
            reply.status(500).send('Internal Server Error');
        }
    });    
}