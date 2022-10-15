import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest } from '@legit-admit/common'
import { Ticket } from '../models/ticket'
import { NotFoundError } from '@legit-admit/common'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById({ _id: req.params.id })

    if (!ticket) {
        throw new NotFoundError()
    }

    res.send(ticket)
})


export { router as showTicketRouter }