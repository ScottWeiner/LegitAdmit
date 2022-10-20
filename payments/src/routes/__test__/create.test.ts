import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { stripe } from '../../stripe'

jest.mock('../../stripe.ts')

it('returns a 404 when the order does not exist', async () => {



    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dsfasdfasfdsafdsa',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
    expect(404)
})

it('returns a 401 when the purchaser is not the same user as the orderer', async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await (order.save())

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dsfasdfasfdsafdsa',
            orderId: order.id
        })
        .expect(401)
})

it('returns 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const price = Math.floor((Math.random() * 100000))
    console.log(price)

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: price,
        status: OrderStatus.Created
    })
    await order.save()

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({

            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)

    //console.log(response)




    //console.log(charges)

    //const stripeCharge = charges.data.find(chg => chg.amount * 100 === price)

    //expect(stripeCharge).toBeDefined()

})