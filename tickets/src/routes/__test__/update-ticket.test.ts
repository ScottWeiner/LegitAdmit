import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'




it('Returns a 404 of provided ID does not exist', async () => {

    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            price: 30,
            title: 'Test Ticket Title'
        })
        .expect(404)

})


it('Returns a 401 of provider is not authenticated', async () => {

    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            price: 30,
            title: 'Test Ticket Title'
        })
        .expect(401)

})


it('Returns a 401 if user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Some shit test',
            price: 69
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'a newer and stupier title',
            price: 1000
        })
        .expect(401)
})


it('Returns a 400 if invalid title or price provided', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Some shit test',
            price: 69
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'another test',
            price: -60
        })
        .expect(400)
})

it('Updates ticket provided valid inputs', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Some shit test',
            price: 69
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Successful Test',
            price: 666
        })
        .expect(200)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('Successful Test')
    expect(ticketResponse.body.price).toEqual(666)
})