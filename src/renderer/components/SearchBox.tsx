//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Downshift from 'downshift'
import {
  RenderInputProps,
  RenderSuggestionProps,
  SearchBoxProps,
} from '../interfaces'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import path from 'path'
//
// ─── COMPONENTS ─────────────────────────────────────────────────────────────────
//
const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    display: 'flex',
    padding: 0,
    flexWrap: 'wrap',
    listStyle: 'none',
    overflowY: 'auto',
    justifyContent: 'flex-start',
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
}))

const SearchBox = ({files, setFilter}: SearchBoxProps) => {
  const classes = useStyles()

  const renderInput = (inputProps: RenderInputProps) => {
    const {InputProps, classes, ref, ...other} = inputProps

    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          ...InputProps,
        }}
        {...other}
      />
    )
  }

  const renderSuggestion = (suggestionProps: RenderSuggestionProps) => {
    const {
      file,
      index,
      itemProps,
      highlightedIndex,
      selectedItem,
    } = suggestionProps
    const isHighlighted = highlightedIndex === index
    const isSelected = (selectedItem || '').indexOf(file.path) > -1

    return (
      <MenuItem
        {...itemProps}
        key={file.path}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {path.basename(file.path)}
      </MenuItem>
    )
  }

  const getSuggestions = (value: string, {showEmpty = false} = {}) => {
    const inputValue = value.trim().toLowerCase()
    setFilter(inputValue)
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0 && !showEmpty
      ? []
      : files.filter(file => {
          const keep =
            count < 5 &&
            path
              .basename(file.path)
              .toLowerCase()
              .includes(inputValue)

          if (keep) {
            count += 1
          }

          return keep
        })
  }

  return (
    <Downshift
      id="downshift-simple"
      onChange={(selectedItem: string) => {
        setFilter(selectedItem.toLowerCase())
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => {
        const {onBlur, onFocus, ...inputProps} = getInputProps({
          placeholder: 'Search',
        })

        return (
          <div className={classes.container}>
            {renderInput({
              classes,
              fullWidth: true,
              InputLabelProps: getLabelProps({shrink: true} as any),
              InputProps: {onBlur, onFocus},
              inputProps,
            })}
            <div {...getMenuProps()}>
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {getSuggestions(inputValue!).map((file, index) =>
                    renderSuggestion({
                      file,
                      index,
                      itemProps: getItemProps({
                        item: path.basename(file.path),
                      }),
                      highlightedIndex,
                      selectedItem,
                    }),
                  )}
                </Paper>
              ) : null}
            </div>
          </div>
        )
      }}
    </Downshift>
  )
}

SearchBox.displayName = 'SearchBox'

export default SearchBox
