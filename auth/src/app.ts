import express from 'express'

import 'express-async-errors'
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
import { errorHandler } from '@legit-admit/common'
import { NotFoundError } from '@legit-admit/common'
import cookieSession from 'cookie-session'

const app = express()

////////i like to write comments. DO you?

app.use(json())
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test'
    secure: false
}))

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export { app }