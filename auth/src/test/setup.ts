import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'


let mongo: any

declare global {
    var signin: () => Promise<string[]>;
}

const userSignupObject = {

    email: 'test@test.com',
    password: 'passwordTest123',
    firstName: 'Hugh',
    lastName: 'Jass',
    address1: '42 Evergreen Terrace',
    address2: '',
    city: 'Springfield',
    state: 'IL',
    zip: '55555'

}

global.signin = async () => {


    const response = await request(app)
        .post('/api/users/signup')
        .send(userSignupObject)
        .expect(201)

    const cookie = response.get('Set-Cookie')

    return cookie
}

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf'

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})