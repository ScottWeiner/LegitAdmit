import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'


const signin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        doRequest()

    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input name='email' value={email} onChange={(e) => { setEmail(e.target.value) }} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name='password' value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary" >Sign In</button>

        </form>


    )
}

export default signin