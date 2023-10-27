import {fastify} from 'fastify'
import { registerUserHandler } from './routes/register'
import fastifyCors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { logInHandler } from './routes/logIn'
import { activityHandler } from './routes/activity'
import { config } from 'dotenv'
import { sleepHandler } from './routes/sleep'
import { foodHandler } from './routes/food'
import { humorHandler } from './routes/humor'
config({ path: '.env' })

const app = fastify()

app.register(fastifyCors, {
    origin: '*'
})

app.register(jwt, {
    secret: 'bem-estar'
})

app.register(registerUserHandler)
app.register(logInHandler)
app.register(activityHandler)
app.register(sleepHandler)
app.register(foodHandler)
app.register(humorHandler)


app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT):  3333
}).then(() => {
  console.log('HTTP Server Running!')
})