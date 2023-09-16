import React, { useContext, useState } from "react"
import { UserContext } from "../context/user"
import { useHistory } from "react-router-dom"

function Login() {
    //creates history object to change routes
    const history = useHistory()

    //sets logged in user info
    const { setUser } = useContext(UserContext)

    //input field states
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e) {
        e.preventDefault()

        //inputted user info
        const formObj = {
            'userName': userName,
            'password': password
        }

        //post request to login
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj)
        })
            .then(r => {
                if (r.ok) {
                    r.json()
                        .then(data => {
                            //sends user to '/' route and sets logged in user info
                            history.push('/')
                            setUser(data)
                        })
                }
                else {
                    r.json()
                        .then(data => {
                            window.confirm(`${String(data.error)}`)
                        })
                }
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h4>Username</h4>
            <input
                placeholder='Username...'
                type='text'
                id='userName'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <h4>Password</h4>
            <input
                placeholder='Password...'
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>Log In</button>
        </form>
    )
}

export default Login