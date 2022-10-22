import express from 'express'

import 'express-async-errors'
import { json } from 'body-parser'

import { errorHandler } from '@legit-admit/common'
import { NotFoundError } from '@legit-admit/common'
import cookieSession from 'cookie-session'
import { currentUser } from '@legit-admit/common'

import { indexOrderRouter } from './routes/index'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'
import { createOrderRouter } from './routes/create'

const app = express()



app.use(json())
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test'
    secure: false
}))
app.use(currentUser)

app.use(indexOrderRouter)
app.use(deleteOrderRouter)
app.use(createOrderRouter)
app.use(showOrderRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export { app }  