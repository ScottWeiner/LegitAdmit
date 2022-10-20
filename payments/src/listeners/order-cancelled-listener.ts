import { Listener, NotFoundError, OrderCancelledEvent, Subjects, OrderStatus } from "@legit-admit/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name'
import { Order } from "../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled


    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

        //Find the order in question:
        const orderToCancel = await Order.findOne({ _id: data.id, version: data.version - 1 })
        if (!orderToCancel) {
            throw new NotFoundError()
        }

        //update & Save the Order
        orderToCancel.set({
            status: OrderStatus.Cancelled
        })
        await orderToCancel.save()


        //ack the message
        msg.ack()

    }

}