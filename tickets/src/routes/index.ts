import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'
import { NotFoundError } from '@legit-admit/common';

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})

    if (!tickets) {
        throw new NotFoundError()
    }

    res.send(tickets)
})

export { router as indexTicketRouter }