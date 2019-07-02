import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'typeface-roboto'
const {remote} = require('electron')
const {Menu, MenuItem} = remote

ReactDOM.render(<App />, document.getElementById('root'))

const menu = new Menu()
menu.append(
  new MenuItem({
    label: '放大',
    click: () => {
      console.log('item 1 clicked')
    },
  }),
)
menu.append(new MenuItem({type: 'separator'}))

window.addEventListener('contextmenu', e => {
  e.preventDefault()
  menu.popup({window: remote.getCurrentWindow()})
})
