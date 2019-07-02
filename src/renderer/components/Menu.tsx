import React, {useContext, useState} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined'
import {FBContext} from '../contexts'

const Menu = () => {
  const {state, dispatch} = useContext(FBContext)
  const goBack = () =>
    dispatch({
      type: 'back',
    })

  return (
    <Grid container>
      <Grid item xs={2}>
        <Button onClick={goBack} disabled={state.history.length <= 1}>
          <ArrowBackOutlined color={state.history.length <= 1 ? "disabled" : "primary"} />
        </Button>
      </Grid>
    </Grid>
  )
}

Menu.displayName = 'Menu'

export default Menu
