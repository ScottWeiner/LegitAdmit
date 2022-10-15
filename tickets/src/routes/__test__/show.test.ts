import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'

it('Returns a 404 if ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .get(`api/tickets/${id}`)
        //.set'Cookie', global.signin())
        .send()
        .expect(404)
})

it('Returns the ticket when the ticket is found', async () => {
    const title = 'Awesome Test Concert'
    const price = 20

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: price

        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        //.set('Cookie', global.signin())
        .send()
        .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})

