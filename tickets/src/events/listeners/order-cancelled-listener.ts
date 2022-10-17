import { OrderCancelledEvent, Listener, Subjects, NotFoundError } from "@legit-admit/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from './queue-group-name';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled

    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        //find the ticket which the orderis reserving
        const ticketToCancel = await Ticket.findById(data.ticket.id)

        //if no ticket, throw an error
        if (!ticketToCancel) {
            throw new NotFoundError()
        }

        //Mark the ticket as reserved by setting the OrderId prop
        ticketToCancel.set({
            orderId: undefined
        })

        await ticketToCancel.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketToCancel.id,
            price: ticketToCancel.price,
            title: ticketToCancel.title,
            userId: ticketToCancel.userId,
            orderId: ticketToCancel.orderId,
            version: ticketToCancel.version
        })

        //ack the message
        msg.ack()
    }
}