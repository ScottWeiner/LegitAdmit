import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test Event',
        price: 20
    })
    await ticket.save()
    return ticket
}

it('Fetches & returns orders when orders exist for the user', async () => {

    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = global.signin()
    const user2 = global.signin()

    const { body: body1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201)


    const { body: body2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket2.id })
        .expect(201)

    await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user1)
        .expect(200)


    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(body1.id)
    expect(response.body[1].id).toEqual(body2.id)


})