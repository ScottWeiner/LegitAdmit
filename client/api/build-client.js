import axios from "axios";

const buildClient = ({ req }) => {

    //console.log("API_URL: ", process.env.API_URL)

    if (typeof window === 'undefined') {
        //We are on the server
        return axios.create({
            baseURL: process.env.API_URL,
            headers: req.headers
        })

    } else {
        //we are on the browser
        return axios.create({
            baseURL: '/'
        })

    }
}

export default buildClient