import { Listener, Subjects, TicketCreatedEvent } from '@legit-admit/common'
import { Message } from 'node-nats-streaming'


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data: ', data)



        msg.ack() // <= if we have Manual Ack Mode = True, we need to tell the server once we have done the needful with the message
        //console.log('Message received: ', msg)
    }
}