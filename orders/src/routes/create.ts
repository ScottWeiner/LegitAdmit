import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@legit-admit/common'
import { body } from 'express-validator'

import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const EXPIRATION_WINDOW_SECONDS = 15 * 60


const router = express.Router()

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId is required!')

], validateRequest, async (req: Request, res: Response) => {

    //Goal: We want to create a new Order, which references the ticket provided in the body of the request.
    //That order will expire (ie, Status = Cancelled) in 15 minutes if no payment provided wihtin time
    //And if the referenced ticket cannot be reserved, then we cancel the order

    //Step 1: Extract the ticket from the body of the request
    const ticket = await Ticket.findById(req.body.ticketId)

    if (!ticket) {

        throw new NotFoundError()
    }

    //Step 2: Ensure this ticket is not reserved already
    // Query the DB for orders that reference the ticketID provided & the status is NOT 'Cancelled' => if we find it, that means it is reserved & we cannot conitue the order
    const ticketIsReserved = await ticket.isReserved()


    if (ticketIsReserved) {
        throw new BadRequestError('Ticket is already reserved')
    }

    //Step 3: Calculate the expiration date
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    //Step 4: Build the order & save to the DB
    const newOrder = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expirationDate,
        ticket: ticket
    })

    await newOrder.save()

    //Step 5: Publish an event stating that the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: newOrder.id,
        userId: newOrder.userId,
        expiresAt: newOrder.expiresAt.toISOString(),
        status: newOrder.status,

        ticket: {
            id: newOrder.ticket.id,
            price: newOrder.ticket.price,

        }
    })

    res.status(201).send(newOrder)
    //TODO: Will need to create event types for this
})

export { router as createOrderRouter }