import React, {useContext, useState} from "react"
import { UserContext } from "../context/user"

function EditUser({setEditUser}) {
    //logged in user info
    const { user, setUser } = useContext(UserContext)

    //input field states
    const [name, setName] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
      
        //new user info
        const formObj = {
            'name': name === '' ? user.name : name,
            'user_name': userName === '' ? user.user_name : userName,
            'password': password === '' ? user._password_hash : password
        }

        //closes editing interface
        setEditUser(false)

        //patch request to edit
        fetch(`/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObj),
        }).then(r => {
        if (r.ok) {
            r.json().then(data => {
                //sets logged in user info to new data
                setUser(data)
            })
        } else {
            r.json().then(data => {
                console.log(data)
            })
        }})

        //resets input field states
        setName('')
        setUserName('')
        setPassword('')
    }
    
    //delete request
    const deleteUser = (userId) => {
        fetch(`/users/${userId}`, { 
            method: 'DELETE' 
        })
        .then(() => {
            console.log(`User ID: ${user.id} | ${user.name}: Was Deleted`)
        })
        .catch(error => {
            console.error('Error:', error)
        })
    }
    
    //runs delete request and resets logged in user info
    const handleDelete = (e) => {
        deleteUser(user.id)
        setUser(null)
        setEditUser(false)
    }

    //closes editing interface
    const exitEdit = () => {
        setEditUser(false)
    }

    return (
        <div>
            <h1 onClick={exitEdit}>Exit X</h1>
            <form>
                <h4>Name</h4>
                <div>
                    <input
                        placeholder='Change Name...'
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </form>
            <form>
                <h4>Username</h4>
                <div>
                    <input
                        placeholder='Change Username...'
                        type='text'
                        id='userName'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
            </form>
            <button onClick={handleSubmit}>Confirm Changes</button>
            <button onClick={handleDelete}>Delete User</button>
        </div>  
    )
}

export default EditUser