import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  ButtonGroup,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import _ from 'lodash'
import React, { useState, useRef } from 'react'
import Button from '../shared/Button'

interface SplitButtonProps {
  buttonColor?: string
  loading?: boolean
  options: {
    label: React.ReactNode
    onClick: () => void
  }[]
}

export const SplitButton = ({
  options,
  buttonColor,
  loading = false,
}: SplitButtonProps) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleMenuItemClick = (index: number) => {
    if (loading) return
    options[index]?.onClick()
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleButtonClick = () => {
    if (loading) return
    options[selectedIndex]?.onClick()
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  if (_.isEmpty(options)) return null

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button
          style={{
            backgroundColor: buttonColor,
            borderColor: buttonColor,
            paddingLeft: '35px',
            paddingRight: '0px',
            display: 'flex',
            alignItems: 'center',
            gap: loading ? '8px' : '0',
          }}
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading && <CircularProgress size={16} sx={{ color: 'white' }} />}
          {options[selectedIndex].label}
        </Button>
        <Button
          style={{ backgroundColor: buttonColor }}
          onClick={handleToggle}
          disabled={loading}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                      disabled={loading}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}
