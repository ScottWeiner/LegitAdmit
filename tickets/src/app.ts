import express from 'express'

import 'express-async-errors'
import { json } from 'body-parser'

import { errorHandler } from '@legit-admit/common'
import { NotFoundError } from '@legit-admit/common'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/create-ticket'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update-ticket'
import { currentUser } from '@legit-admit/common'

const app = express()



app.use(json())
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test'
    secure: false
}))
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)



app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export { app }  