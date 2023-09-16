import React, { useContext, useEffect } from "react"
import { UserContext } from "../context/user"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

//local imports
import Home from "./Home"
import Navbar from "./Navbar"
import NotFound from "./NotFound"

function App() {
  //sets logged in user info
  const { setUser } = useContext(UserContext)

  //checks if user is logged in
  useEffect(() => {
    fetch('/check_session')
    .then(r => {
      if (r.ok) {
        r.json().then(userObj => setUser(userObj))
      }
    })
  }, [setUser])

  return (
    <Router>
        <div>
          <Navbar />
        </div>
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
    </Router>
  )
}

export default App