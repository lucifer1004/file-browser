//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import GridListTile from '@material-ui/core/GridListTile'
import Link from '@material-ui/core/Link'
import {Typography} from '@material-ui/core'
import FileItem from './FileItem'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import fs from 'fs'
import path from 'path'
import {remote} from 'electron'
//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//
interface Path {
  path: string
  isDirectory: boolean
}

const {app, dialog} = remote

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
}))

const Folder = () => {
  const classes = useStyles()
  const [directory, setDirectory] = useState('')
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
