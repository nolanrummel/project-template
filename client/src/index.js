import React from "react"
import { createRoot } from "react-dom/client"
import { UserProvider } from "./context/user"

//local imports
import App from "./components/App"
import "./index.css"

const container = document.getElementById("root")
const root = createRoot(container)

//provides App with access to useContext (user info)
root.render(<UserProvider><App /></UserProvider>)