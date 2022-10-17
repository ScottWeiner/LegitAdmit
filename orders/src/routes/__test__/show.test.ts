import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('Finds the order that belongs to this user', async () => {

    const ticket = Ticket.build({
        title: 'Test Event',
        price: 50
    })
    await ticket.save()

    const user = global.signin()

    const order = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)




    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)



    expect(fetchedOrder.order.id).toEqual(order.body.id)


})