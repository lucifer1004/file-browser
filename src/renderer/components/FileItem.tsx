//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useContext, useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import InsertDriveFileOutlined from '@material-ui/icons/InsertDriveFileOutlined'
import FolderOutlined from '@material-ui/icons/FolderOutlined'
import {FBContext} from '../contexts'
import {Content} from '../interfaces'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import path from 'path'
//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//
interface FileItemProps {
  file: Content
  setFilter: Function
}
//
// ─── STYLE ──────────────────────────────────────────────────────────────────────
//
const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '6rem',
    height: '6rem',
  },
  button: {
    width: '100%',
  },
  icon: {
    margin: 0,
    height: '4rem',
  },
  title: {
    width: '4rem',
    fontSize: 14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'none',
  },
}))
//
// ─── COMPONENT ──────────────────────────────────────────────────────────────────
//
const FileItem = ({file, setFilter}: FileItemProps) => {
  const classes = useStyles()
  const [baseName, setBaseName] = useState('')
  const [extName, setExtName] = useState('')
  const {dispatch} = useContext(FBContext)
  const handleDoubleClick = () => {
    if (file.isDirectory) {
      dispatch({
        type: 'enter',
        directory: file.path,
      })
      setFilter('')
    }
  }
  useEffect(() => {
    setBaseName(path.basename(file.path))
    setExtName(path.extname(file.path))
  }, [file])

  return (
    <Tooltip title={baseName}>
      <Button className={classes.button} onDoubleClick={handleDoubleClick}>
        <div className={classes.card}>
          {file.isDirectory ? (
            <FolderOutlined className={classes.icon} color="primary" />
          ) : extName === '.jpg' || extName === '.png' ? (
            <img className={classes.icon} src={`file://${file.path}`}></img>
          ) : (
            <InsertDriveFileOutlined
              className={classes.icon}
              color="secondary"
            />
          )}
          <Typography className={classes.title}>{baseName}</Typography>
        </div>
      </Button>
    </Tooltip>
  )
}

FileItem.displayName = 'FileItem'
export default FileItem
