import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import {ipcRenderer} from 'electron'
const updateOnlineStatus = () => {
  ipcRenderer.send(
    'online-status-changed',
    navigator.onLine ? 'online' : 'offline',
  )
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()

ReactDOM.render(<App />, document.getElementById('root'))
