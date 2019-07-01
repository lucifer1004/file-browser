import {MenuItemProps} from '@material-ui/core/MenuItem'
import {TextFieldProps} from '@material-ui/core/TextField'

export interface Path {
  path: string
  isDirectory: boolean
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
  file: Path
}
