import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@legit-admit/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from './queue-group-name'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;

    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {


        const ticketToUpdate = await Ticket.findByEvent(data)

        if (!ticketToUpdate) {
            //cant find the ticket, what do we do????
            throw new Error('Ticket not found!')
        }

        ticketToUpdate.set({
            id: data.id,
            title: data.title,
            price: data.price,
            userId: data.userId
        })

        await ticketToUpdate.save()

        msg.ack()
    }
}