import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCreatedEvent, Subjects } from "@legit-admit/common"
import { OrderStatus } from "@legit-admit/common"
import mongoose from "mongoose"


const setup = async () => {
    //create instance of the listner
    const listener = new OrderCreatedListener(natsWrapper.client)

    //create and save a ticket (which we will try to reserve)

    const ticket = Ticket.build({
        title: 'Test Title',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    //create Fake data event
    const data: OrderCreatedEvent['data'] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString() + 900,
        status: OrderStatus.Created,
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }

    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}



it('Sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)

})

it('Acks the message', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()

})

it('publishes a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})