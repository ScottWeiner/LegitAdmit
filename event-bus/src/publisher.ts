import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()

const publisherClient = nats.connect('legit-admit', 'abc', {
    url: 'http://localhost:4222'
})

publisherClient.on('connect', async () => {
    console.log('Publisther connected to NATS')

    const publisher = new TicketCreatedPublisher(publisherClient)

    try {
        await publisher.publish({
            id: 'abc123',
            title: 'Rage Against the Machine 2023 World Tour',
            price: 150,
            userId: 'xyz987'
        })

    } catch (error) {
        console.log(error)
    }


})
