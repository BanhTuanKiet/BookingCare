import React, { useEffect, useState } from 'react'
import axios from "../Util/AxiosConfig"
import { Button } from 'react-bootstrap'

function Login() {
    const [token, setToken] = useState()
    useEffect(() => {
        const fetchData = async () => {
            // const respone = await axios.get("/auth/login")
            // console.log(respone.data.token)
            // setToken(respone.data.token)
            console.log("login")
        }

        fetchData()
    }, [])

    const Auth = async () => {
        try {
            console.log("auth")
            const respone = await axios.post('/auth', null, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(respone)
        } catch (error) {
            
        }
    }

    return (
        <>
            <div>Login</div>
            <Button onClick={Auth}>Auth</Button>
        </>
    )
}

export default Login