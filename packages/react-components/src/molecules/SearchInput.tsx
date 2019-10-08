import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, OutlinedInput } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

export function SearchInput({ placeholderText = 'Search', onSearchClick = () => {}, className = '' }) {
  const classes = useStyles()

  return (
    <div className={clsx(classes.search && className)}>
      <OutlinedInput className={classes.input} placeholder={placeholderText} labelWidth={100} />
      <IconButton onClick={() => onSearchClick()}>
        <SearchIcon />
      </IconButton>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  input: {
    flex: 1,
  },
  search: {
    flex: 'auto',
  },
}))
