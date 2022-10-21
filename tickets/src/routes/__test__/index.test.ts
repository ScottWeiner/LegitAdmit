import request from "supertest";
import { app } from '../../app'

export const createTicket = () => {
    const title = 'Awesome Test Concert'
    const price = 20

    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: title,
            price: price

        })
}

it('can fet a list of tickets', async () => {
    await createTicket()
    await createTicket() //Make 2 tickets that are otherwise the same for testing purposes.

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);


    expect(response.body.length).toEqual(2)

})
