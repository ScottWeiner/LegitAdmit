import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@legit-admit/common";
import { Ticket } from "../../../models/ticket";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";


const setup = async () => {
    //create instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)

    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Test event",
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    //create a fake message obj
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {
        listener,
        data,
        msg
    }
}


it('Create and saves a ticket', async () => {
    //call setup()
    const { listener, data, msg } = await setup()
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)

    //write asserstion to make sure the ticker was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)

})

it('acks the message', async () => {

    //call setup()
    const { listener, data, msg } = await setup()
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //write assertions to make sure ack() funciton is called
    expect(msg.ack).toHaveBeenCalled()
})