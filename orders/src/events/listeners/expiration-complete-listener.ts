import { Message } from "node-nats-streaming";
import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError } from "@legit-admit/common";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { Order } from "../../models/order";
import { queueGroupName } from './queue-group-name'
import { OrderStatus } from "@legit-admit/common";
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete

    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        //Find the order wit that Id
        const orderToCancel = await Order.findById(data.orderId).populate('ticket')
        if (!orderToCancel) {
            return new NotFoundError()
        }

        if (orderToCancel.status === OrderStatus.Complete) {
            return msg.ack()
        }

        //Cancel that order
        orderToCancel.set({
            status: OrderStatus.Cancelled
        })
        await orderToCancel.save()


        //emit the order:cancelled event so the ticket service can act

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: data.orderId,
            version: orderToCancel.version,
            ticket: {
                id: orderToCancel.ticket.id
            }
        })

        msg.ack()
    }
}