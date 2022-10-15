import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

jest.mock('../__mocks__/nats-wrapper.ts') //Instead of importing the real natsWrapper, we will import the mock one with the fake implementation

let mongo: any

declare global {
    var signin: () => string[]; //Don't need to return a promise because we aren't actually going to call the sign up/in services
}

global.signin = () => {
    // Build JSON Web Token payload {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    //Build session object {jwt: MY_JWT}
    const session = { jwt: token }

    // Turn that session in to JSON
    const sessionJSON = JSON.stringify(session)

    // Take JSON & encode as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    //Return a string with the encoded data //"session=${base64}"
    return [`session=${base64}`]
}

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})