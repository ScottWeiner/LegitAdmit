import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '@legit-admit/common'

import { NotFoundError } from '@legit-admit/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/payments', async (req: Request, res: Response) => {
    const orders = await Order.find({})

    if (!orders) {
        throw new NotFoundError()
    }

    res.send(orders)
})


export { router as showOrdersRouter }