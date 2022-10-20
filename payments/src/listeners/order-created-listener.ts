import { Listener, NotFoundError, OrderCreatedEvent, Subjects, OrderStatus } from "@legit-admit/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name'
import { Order } from "../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated


    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        //create the order record within the payments service out of the Event data
        const order = Order.build({
            id: data.id,
            version: data.version,
            userId: data.userId,
            price: data.ticket.price,
            status: data.status
        })

        //Save the Order
        await order.save()

        console.log('I saved the order I think')
        //ack the message
        msg.ack()

    }

}