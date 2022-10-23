import request from "supertest";
import { app } from "../../app";



it('return 400 when an nonexisten user attempts sign in', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'testfail@test.com',
            password: 'passwordTest123'
        })
        .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
    await global.signin()

    return request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "passwor"
        })
        .expect(400)
})

it('resonds with a cookie when given valid creds', async () => {
    await global.signin()

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "passwordTest123"
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})