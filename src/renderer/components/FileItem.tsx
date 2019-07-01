//
// ─── UI IMPORTS ─────────────────────────────────────────────────────────────────
//
import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import InsertDriveFileOutlined from '@material-ui/icons/InsertDriveFileOutlined'
import FolderOutlined from '@material-ui/icons/FolderOutlined'
//
// ─── NODE IMPORTS ───────────────────────────────────────────────────────────────
//
import path from 'path'
//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//
interface FileItemProps {
  filePath: string
  isDirectory: boolean
  setDirectory: Function
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
const FileItem = ({filePath, isDirectory, setDirectory}: FileItemProps) => {
  const classes = useStyles()
  const [baseName, setBaseName] = useState('')
  const [extName, setExtName] = useState('')
  const handleDoubleClick = () => {
    if (isDirectory) setDirectory(filePath)
  }
  useEffect(() => {
    setBaseName(path.basename(filePath))
    setExtName(path.extname(filePath))
  }, [filePath])

  return (
    <Tooltip title={baseName}>
      <Button className={classes.button} onDoubleClick={handleDoubleClick}>
        <div className={classes.card}>
          {isDirectory ? (
            <FolderOutlined className={classes.icon} color="primary" />
          ) : extName === '.jpg' || extName === '.png' ? (
            <img className={classes.icon} src={`file://${filePath}`}></img>
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
