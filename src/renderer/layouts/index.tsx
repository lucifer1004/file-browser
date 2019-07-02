import React from 'react'
import Container from '@material-ui/core/Container'
import Menu from '../components/Menu'

const Layout = ({children}: {children: React.ReactNode}) => (
  <Container>
    <Menu />
    {children}
  </Container>
)

Layout.displayName = 'Layout'

export default Layout
