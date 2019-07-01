//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import GridListTile from '@material-ui/core/GridListTile'
import Link from '@material-ui/core/Link'
import CancelOutlined from '@material-ui/icons/CancelOutlined'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import {Path} from '../interfaces'
import FileItem from './FileItem'
import SearchBox from './SearchBox'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import fs from 'fs'
import path from 'path'
import {Typography} from '@material-ui/core'
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
  const [directory, setDirectory] = useState('')
  const [filter, setFilter] = useState('')
  const [files, setFiles] = useState<Path[]>([])

  const isDirectory = (dir: string) => {
    const newDir = `${directory}/${dir}`
    if (!fs.existsSync(newDir)) return false
    else return fs.lstatSync(newDir).isDirectory()
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
        <Grid item container xs={8} alignItems="center">
          <Breadcrumbs separator="›" aria-label="Breadcrumb">
            {directory.split('/').map((dir, index) => (
              <Link
                color="inherit"
                key={index}
                onClick={() => {
                  setDirectory(
                    directory
                      .split('/')
                      .slice(0, index + 1)
                      .join('/'),
                  )
                  setFilter('')
                }}
              >
                {dir === '' ? '/' : dir}
              </Link>
            ))}
          </Breadcrumbs>
        </Grid>
        <Grid item xs={3}>
          <SearchBox files={files} setFilter={setFilter} />
        </Grid>
        <Grid item xs={1}>
          <SearchOutlined color="primary" />
        </Grid>
      </Grid>
      <ul className={classes.gridList}>
        {files
          .filter(file => {
            const keep = path
              .basename(file.path)
              .toLowerCase()
              .includes(filter)

            return keep
          })
          .map((file, index) => (
            <GridListTile key={index}>
              <FileItem
                filePath={file.path}
                isDirectory={file.isDirectory}
                setDirectory={setDirectory}
                setFilter={setFilter}
              />
            </GridListTile>
          ))}
      </ul>
    </div>
  )
}

Folder.displayName = 'Folder'

export default Folder
