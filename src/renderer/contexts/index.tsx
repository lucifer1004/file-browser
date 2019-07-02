import React, {useReducer} from 'react'
import {remote} from 'electron'
import fs from 'fs-extra'
import path from 'path'
import {FBAction, FBReducer, FBState, Content} from '../interfaces'

const {app} = remote
const home = app.getPath('home')

const isDirectory = (dir: string): boolean => {
  if (!fs.existsSync(dir)) return false
  else return fs.lstatSync(dir).isDirectory()
}

const lsContents = (dir: string): Content[] =>
  fs
    .readdirSync(dir)
    .filter(content => !/(^|\/)\.[^\/\.]/g.test(content))
    .map(content => {
      const contentPath = path.join(dir, content)
      return {
        path: contentPath,
        isDirectory: isDirectory(contentPath),
      }
    })

const initialState = (): FBState => ({
  directory: home,
  contents: lsContents(home),
  history: [home],
})

const reducer = (state: FBState, action: FBAction): FBState => {
  switch (action.type) {
    case 'reset':
      return initialState()

    case 'enter':
      if (action.directory) {
        const history = state.history.slice()
        history.push(action.directory)
        return {
          directory: action.directory,
          contents: lsContents(action.directory),
          history,
        }
      }
      return state

    case 'back':
      const curr = state.history.length
      if (curr > 1) {
        const lastDirectory = state.history[curr - 2]
        return {
          directory: lastDirectory,
          contents: lsContents(lastDirectory),
          history: state.history.slice(0, curr - 1),
        }
      }
      return state

    default:
      return state
  }
}

export const FBContext = React.createContext<FBReducer>({
  state: (undefined as unknown) as FBState,
  dispatch: (undefined as unknown) as React.Dispatch<FBAction>,
})

export const FBProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState())
  const value: FBReducer = {state, dispatch}
  return <FBContext.Provider value={value}>{children}</FBContext.Provider>
}

export const FBConsumer = FBContext.Consumer
