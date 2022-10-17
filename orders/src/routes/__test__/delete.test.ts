import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('Cancels an order that the user owns which is not already cancelled', async () => {
    const ticket = Ticket.build({
        title: 'Test Event',
        price: 50
    })
    await ticket.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)



    const { body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()

    console.log('order: ', order)
    console.log('cancelledOrder', cancelledOrder)

    expect(order.id).toEqual(cancelledOrder.id)
    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled)
})

////////////////////////////////////////////////////

it('emits a ordered:cancelled event', async () => {
    const ticket = Ticket.build({
        title: 'Test Event',
        price: 50
    })
    await ticket.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)



    const { body: cancelledOrder } = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})