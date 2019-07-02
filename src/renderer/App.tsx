import React from 'react'
import {FBProvider} from './contexts'
import Folder from './components/Folder'
import Layout from './layouts'

export default () => {
  return (
    <FBProvider>
      <Layout>
        <Folder />
      </Layout>
    </FBProvider>
  )
}
