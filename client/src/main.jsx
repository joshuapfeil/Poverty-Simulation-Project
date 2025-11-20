/*
  Client entrypoint. Mounts the React application into the DOM and
  initializes the React Router. This is the file Vite uses to start
  the client during development and to build the production bundle.
  There shouldn't be much to change here rn.
*/

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
