import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth, validateRequest, OrderStatus, NotAuthorizedError, BadRequestError } from '@legit-admit/common'
import { body } from 'express-validator'

import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'


const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

    const orderToDelete = await Order.findById(req.params.orderId).populate('ticket')
    if (!orderToDelete) {
        throw new NotFoundError()
    }

    if (orderToDelete.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    if (orderToDelete.status === OrderStatus.Complete) {
        throw new BadRequestError('Too late, Bro! This order is already paid for!')
    }

    if (orderToDelete.status === OrderStatus.Cancelled) {
        throw new BadRequestError('This order has already been cancelled. Can\'t cancel it twice; that\'t illogical!')
    }

    orderToDelete.status = OrderStatus.Cancelled
    await orderToDelete.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: orderToDelete.id,
        ticket: {
            id: orderToDelete.ticket.id
        }
    })

    res.send(orderToDelete)
})

export { router as deleteOrderRouter }