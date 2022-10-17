import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from "@legit-admit/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name'
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        //find the ticket which the orderis reserving
        const ticketToReserve = await Ticket.findById(data.ticket.id)

        //if no ticket, throw an error
        if (!ticketToReserve) {
            throw new NotFoundError()
        }

        //Mark the ticket as reserved by setting the OrderId prop
        ticketToReserve.set({
            orderId: data.id
        })

        //Save the ticket
        await ticketToReserve.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketToReserve.id,
            price: ticketToReserve.price,
            title: ticketToReserve.title,
            userId: ticketToReserve.userId,
            orderId: ticketToReserve.orderId,
            version: ticketToReserve.version
        })


        //ack the message
        msg.ack()

    }

}