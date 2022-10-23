import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'


const signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zip, setZip] = useState('')


    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password, firstName, lastName, address1, address2, city, state, zip
        },
        onSuccess: () => Router.push('/')
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        doRequest()

    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input name='email' value={email} onChange={(e) => { setEmail(e.target.value) }} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name='password' value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            <div className="form-group">
                <label>First Name</label>
                <input name='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>LastName</label>
                <input name='paslastNamesword' value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Address 1</label>
                <input name='address1' value={address1} onChange={(e) => setAddress1(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Address 2</label>
                <input name='address2' value={address2} onChange={(e) => setAddress2(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>City</label>
                <input name='city' value={city} onChange={(e) => setCity(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>State</label>
                <input name='state' value={state} onChange={(e) => setState(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Zip</label>
                <input name='zip' value={zip} onChange={(e) => setZip(e.target.value)} className="form-control" />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary" >Sign Up</button>

        </form>


    )
}

export default signup