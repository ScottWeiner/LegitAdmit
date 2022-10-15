import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener'

console.clear()

const listenerClient = nats.connect('legit-admit', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

listenerClient.on('connect', () => {
    console.log('connected to the listener client')

    listenerClient.on('close', () => {
        console.log('NATS Connection Closed!')
        process.exit()
    })

    new TicketCreatedListener(listenerClient).listen()


})

process.on('SIGINT', () => listenerClient.close())
process.on('SIGTERM', () => listenerClient.close())




