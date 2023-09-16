import React, { useContext, useState } from "react"
import { UserContext } from "../context/user"

//local imports
import Login from "./Login"
import Signup from "./Signup"
import EditUser from "./EditUser"

function Home() {
    //logged in user info
    const { user, setUser } = useContext(UserContext)

    const [signUpState, setSignUpState] = useState(false)
    const [editUser, setEditUser] = useState(false)

    //switches between login and signup
    const handleSignUpState = (e) => {
        setSignUpState(!signUpState)
    }

    //delete request to log out
    const handleLogOut = (e) => {   
        fetch('/logout', {
            method: 'DELETE'
        })
        setUser(null)
    }
    
    //opens user editing interface
    const handleEdit = (e) => {
        setEditUser(true)
    }

    return (
        <div>
            {user ? 
                <div>
                    <div>
                        <h4>User ID: {user.id} | User Name: {user.user_name}</h4>
                        <h2>Welcome Back, {user.name}</h2>
                    </div>
                    <div>
                        {editUser ?
                            <div>
                                <EditUser setEditUser={setEditUser}/>
                            </div>
                            :
                            <div>
                                <button onClick={handleEdit}>Edit User</button>
                            </div>
                        }
                        <button onClick={handleLogOut}>Sign Out</button>
                    </div>
                </div>
                : 
                <div>
                    {signUpState ?
                        <div>
                            <h2>Sign Up</h2>
                            <Signup setUser={setUser} />
                            <p onClick={handleSignUpState}>Already Have an Account? <span>Login</span></p>
                        </div>
                        :
                        <div>
                            <h2>Log In</h2>
                            <Login setUser={setUser} />
                            <p onClick={handleSignUpState}>Don't Have an Account? <span>Signup</span></p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Home