import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
    console.log('Starting up! YAHOO!!!')

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY environment variable is not defined.')
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log('connected to Auth mongodb')
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, () => {
        console.log('Auth app listening on port 3000!')
    })
}



start();