import { Listener, OrderCreatedEvent, Subjects } from "@legit-admit/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Wait time to expire in miliseconds: ', delay)

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay: delay
        })

        msg.ack()
    }

}