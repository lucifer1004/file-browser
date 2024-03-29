import {Dispatch, SetStateAction} from 'react'
import {MenuItemProps} from '@material-ui/core/MenuItem'
import {TextFieldProps} from '@material-ui/core/TextField'

export interface Content {
  path: string
  isDirectory: boolean
}

export interface FBAction {
  type: string
  directory?: string
}

export interface FBState {
  directory: string
  contents: Content[]
  history: string[]
}

export interface FBReducer {
  state: FBState
  dispatch: Dispatch<FBAction>
}

export type RenderInputProps = TextFieldProps & {
  ref?: React.Ref<HTMLDivElement>
  classes?: any
}

export interface RenderSuggestionProps {
  highlightedIndex: number | null
  index: number
  itemProps: MenuItemProps<'div', {button?: never}>
  selectedItem: string
  file: Content
}

export interface SearchBoxProps {
  setFilter: Dispatch<SetStateAction<string>>
}
