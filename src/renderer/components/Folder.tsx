//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import FileItem from './FileItem'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import fs from 'fs'
import {remote} from 'electron'

const {app, dialog} = remote

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
}))

export default () => {
  const classes = useStyles()
  const [directory, setDirectory] = useState('/')
  const [files, setFiles] = useState<string[]>([])
  const changeDir = (dir: string) =>
    setDirectory(directory => {
      const newDir = directory + dir
      if (fs.lstatSync(newDir).isDirectory()) return newDir + '/'
      else return directory
    })

  useEffect(() => {
    setFiles(fs.readdirSync(directory))
  }, [directory])

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={5}>
        {files.map((file, index) => (
          <GridListTile key={index}>
            <FileItem file={file} setDirectory={changeDir} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
