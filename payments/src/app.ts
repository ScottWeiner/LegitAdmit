import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { errorHandler } from '@legit-admit/common'
import { NotFoundError } from '@legit-admit/common'
import cookieSession from 'cookie-session'
import { currentUser } from '@legit-admit/common'
import { createChargeRouter } from './routes/create'
import { showOrdersRouter } from './routes/show'

const app = express()



app.use(json())
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test'
    secure: false
}))
app.use(currentUser)

app.use(createChargeRouter)
app.use(showOrdersRouter)


app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export { app }  