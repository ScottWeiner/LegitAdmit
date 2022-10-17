import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCancelledEvent, OrderCreatedEvent, Subjects } from "@legit-admit/common"
import { OrderStatus } from "@legit-admit/common"
import mongoose from "mongoose"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
    //create instance of the listner
    const listener = new OrderCancelledListener(natsWrapper.client)

    //create and save a ticket (which we will try to reserve)

    const ticket = Ticket.build({
        title: 'Test Title',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString(),

    })
    const orderId = new mongoose.Types.ObjectId().toHexString()
    ticket.set({ orderId })
    await ticket.save()

    //create Fake data event
    const data: OrderCancelledEvent['data'] = {

        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }

    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId }
}


it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})