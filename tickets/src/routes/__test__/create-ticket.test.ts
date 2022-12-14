import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'



it('has a route handler for listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be access when the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)


})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({

            price: 10
        })
        .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Test Concert Ever',
            price: -10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Test Concert Ever',
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Test Concert Ever',
            price: 'price'
        })
        .expect(400)
})

it('Returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({})

    expect(response.status).not.toEqual(401)

})


it('Creates a ticket with valid inputs', async () => {
    //Add check to make sure the ticket was saved to the DB
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'TEST EVENT',
            price: 20
        })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(20)
})

it('Publishes an event', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'TEST EVENT X',
            price: 20
        })
        .expect(201)

})