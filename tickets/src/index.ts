import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { randomBytes } from 'crypto';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY environment variable is not defined.')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined.')
    }

    try {
        await natsWrapper.connect('legit-admit', randomBytes(4).toString('hex'), 'http://nats-srv:4222')
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to Tickets mongodb')
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, () => {
        console.log('Tickets app listening on port 3000!')
    })
}



start();