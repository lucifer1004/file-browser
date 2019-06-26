import React from 'react'

interface FileItemProps {
  file: string
  setDirectory: Function
}

export default ({file, setDirectory}: FileItemProps) => {
  return (
    <div>
      <img src="https://placehold.it/50x50" />
      <p onDoubleClick={() => setDirectory(file)}>{file}</p>
    </div>
  )
}
