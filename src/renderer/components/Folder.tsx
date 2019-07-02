//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useContext, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Grid from '@material-ui/core/Grid'
import GridListTile from '@material-ui/core/GridListTile'
import Link from '@material-ui/core/Link'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import {FBContext} from '../contexts'
import FileItem from './FileItem'
import SearchBox from './SearchBox'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import path from 'path'
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
const Folder = () => {
  const classes = useStyles()
  const {state, dispatch} = useContext(FBContext)
  const [filter, setFilter] = useState('')

  const enterDirectory = (dir: string) =>
    dispatch({
      type: 'enter',
      directory: dir,
    })

  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <Grid item container xs={8} alignItems="center">
          <Breadcrumbs separator="›" aria-label="Breadcrumb">
            <Link
              color="inherit"
              key="root"
              onClick={() => {
                enterDirectory('/')
                setFilter('')
              }}
            >
              /
            </Link>
            {state.directory
              .substr(1)
              .split('/')
              .map((dir, index) => (
                <Link
                  color="inherit"
                  key={index}
                  onClick={() => {
                    enterDirectory(
                      state.directory
                        .split('/')
                        .slice(0, index + 2)
                        .join('/'),
                    )
                    setFilter('')
                  }}
                >
                  {dir}
                </Link>
              ))}
          </Breadcrumbs>
        </Grid>
        <Grid item xs={3}>
          <SearchBox files={state.contents} setFilter={setFilter} />
        </Grid>
        <Grid item xs={1}>
          <SearchOutlined color="primary" />
        </Grid>
      </Grid>
      <ul className={classes.gridList}>
        {state.contents
          .filter(file => {
            const keep = path
              .basename(file.path)
              .toLowerCase()
              .includes(filter)

            return keep
          })
          .map((file, index) => (
            <GridListTile key={index}>
              <FileItem file={file} setFilter={setFilter} />
            </GridListTile>
          ))}
      </ul>
    </div>
  )
}

Folder.displayName = 'Folder'

export default Folder
