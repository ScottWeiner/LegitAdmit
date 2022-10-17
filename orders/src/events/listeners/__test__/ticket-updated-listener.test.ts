import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@legit-admit/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
    //create a listner
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //create & save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test event title",
        price: 50
    })
    await ticket.save()

    //Create fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: "Revised title",
        price: 75,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: ticket.version + 1
    }

    //crete fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return it all as an object
    return { listener, data, ticket, msg }
}

it('finds, updates & saves a ticket', async () => {
    //run the setup() and get what you need
    const { listener, data, ticket, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('Acks the msg', async () => {
    //call setup()
    const { listener, data, msg } = await setup()
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //write assertions to make sure ack() funciton is called
    expect(msg.ack).toHaveBeenCalled()
})

it('Does not call ack() if the event has a skipped version number', async () => {
    const { listener, data, ticket, msg } = await setup()

    data.version = 100

    await expect(listener.onMessage(data, msg)).rejects.toThrow()

    expect(msg.ack).not.toHaveBeenCalled()

})