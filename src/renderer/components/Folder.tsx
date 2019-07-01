//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useState, useEffect, ChangeEvent} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Grid from '@material-ui/core/Grid'
import GridListTile from '@material-ui/core/GridListTile'
import Link from '@material-ui/core/Link'
import MenuItem, {MenuItemProps} from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'
import Downshift from 'downshift'
import FileItem from './FileItem'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import fs from 'fs'
import path from 'path'
//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//
interface Path {
  path: string
  isDirectory: boolean
}

type RenderInputProps = TextFieldProps & {
  classes: ReturnType<typeof useStyles>
  ref?: React.Ref<HTMLDivElement>
}

interface RenderSuggestionProps {
  highlightedIndex: number | null
  index: number
  itemProps: MenuItemProps<'div', {button?: never}>
  selectedItem: string
  file: Path
}
//
// ─── STYLES ─────────────────────────────────────────────────────────────────────
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
//
// ─── COMPONENTS ─────────────────────────────────────────────────────────────────
//
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

const Folder = () => {
  const classes = useStyles()
  const [directory, setDirectory] = useState('')
  const [files, setFiles] = useState<Path[]>([])

  const isDirectory = (dir: string) => {
    const newDir = `${directory}/${dir}`
    if (!fs.existsSync(newDir)) return false
    else return fs.lstatSync(newDir).isDirectory()
  }

  function getSuggestions(value: string, {showEmpty = false} = {}) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    let count = 0

    return inputLength === 0 && !showEmpty
      ? []
      : files.filter(file => {
          const keep =
            count < 5 &&
            path
              .basename(file.path)
              .slice(0, inputLength)
              .toLowerCase() === inputValue

          if (keep) {
            count += 1
          }

          return keep
        })
  }

  useEffect(() => {
    setFiles(
      fs
        .readdirSync(path.join('/', directory))
        .filter(path => !/(^|\/)\.[^\/\.]/g.test(path))
        .map(file => ({
          path: path.join('/', directory, file),
          isDirectory: isDirectory(file),
        })),
    )
  }, [directory])

  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <Grid item container xs={10} alignItems="center">
          <Breadcrumbs separator="›" aria-label="Breadcrumb">
            {directory.split('/').map((dir, index) => (
              <Link
                color="inherit"
                key={index}
                onClick={() =>
                  setDirectory(
                    directory
                      .split('/')
                      .slice(0, index + 1)
                      .join('/'),
                  )
                }
              >
                {dir === '' ? '/' : dir}
              </Link>
            ))}
          </Breadcrumbs>
        </Grid>
        <Grid item xs={2}>
          <Downshift id="downshift-simple">
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
                    fullWidth: true,
                    classes,
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
        </Grid>
      </Grid>
      <ul className={classes.gridList}>
        {files.map((file, index) => (
          <GridListTile key={index}>
            <FileItem
              filePath={file.path}
              isDirectory={file.isDirectory}
              setDirectory={setDirectory}
            />
          </GridListTile>
        ))}
      </ul>
    </div>
  )
}

Folder.displayName = 'Folder'

export default Folder
