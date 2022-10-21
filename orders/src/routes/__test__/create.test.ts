import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'



it('returns an derror if the ticket does not exist', async () => {

    const ticketId = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404)

})

it('returns an error if the ticket is already reserved', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        id: ticketId,
        title: 'Test Event',
        price: 20
    })

    await ticket.save()

    const order = Order.build({
        ticket: ticket,
        userId: 'asdfghghehedfj',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        version: 0
    })

    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400)
})

it('reserved a ticket when the rquested ticket is unreseved', async () => {

    const ticketId = new mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        id: ticketId,
        title: 'Test Event',
        price: 20
    })

    await ticket.save()


    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)
})

it('reserved a ticket when the rquested ticket is unreseved, even if there are previously cancelled orders', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test Event',
        price: 20
    })

    await ticket.save()

    const order1 = Order.build({
        ticket: ticket,
        userId: 'asdfghghehedfj',
        status: OrderStatus.Cancelled,
        expiresAt: new Date(),
        version: 0
    })

    const order2 = Order.build({
        ticket: ticket,
        userId: 'asdfghghehedfj',
        status: OrderStatus.Cancelled,
        expiresAt: new Date(),
        version: 0
    })

    await order1.save()

    await order2.save()


    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)
})

//it.todo('emits a order:created event')
it('emits an order:created event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test Event',
        price: 20
    })

    await ticket.save()


    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
