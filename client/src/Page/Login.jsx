import React, { useEffect } from 'react'
import axios from "../Util/AxiosConfig"

function Login() {
    
    useEffect(() => {
        const fetchData = async () => {
            const respone = await axios.get("/auth/login", {
                headers: {
                    "Authorization": "sdvsgwefwe"
                }
            })
            console.log(respone)
        }

        fetchData()
    }, [])

    return (
        <div>Login</div>
    )
}

export default Login