import request from "supertest";
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'passwordTest123'
        })
        .expect(201)
})

it('returns a 400 for a failed sign in with invalid email ', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@testcom",
            password: 'passwordTest123'
        })
        .expect(400)
})

it('returns a 400 for a failed sign in with invalid password ', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'p'
        })
        .expect(400)
})

it('returns a 400 for a reuest with invalid email or password ', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'passwost123'
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "teestcom",
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('disallows dupliocate emails at signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'passwordTest123'
        })
        .expect(201)

    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'passwordTest123'
        })
        .expect(400)
})

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'passwordTest123'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})