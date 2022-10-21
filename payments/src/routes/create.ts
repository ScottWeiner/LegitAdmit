import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError } from '@legit-admit/common';
import { Order } from '../models/order';
import { OrderStatus } from '@legit-admit/common';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper'


const router = express.Router()

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage('Token not provided!'),
    body('orderId').not().isEmpty().withMessage('orderId not provided!'),
    validateRequest,
], async (req: Request, res: Response) => {

    const { token, orderId } = req.body


    //Find the order in question from the MongoDB collection
    const order = await Order.findById(orderId)


    //validate no issues with the order, throw errors if so
    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('This order has been cancelled due to timeout')
    }


    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = Payment.build({
        orderId: orderId,
        stripeId: charge.id
    })

    await payment.save()

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })


    res.status(201).send({ id: payment.id })



})

export { router as createChargeRouter }