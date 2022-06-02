import { useContext } from 'react'

import { alpha, AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { DarkMode, LightMode, Autorenew } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

import Logo from '../assets/logo.png'

import { ThemeContext } from '../features/ThemeContext'

export default function Header(props) {
  const theme = useContext(ThemeContext)
  const darkMode = theme.state.darkMode

  const onClick = () => {
    if (darkMode) {
      theme.dispatch({ type: 'LIGHTMODE' })
    } else {
      theme.dispatch({ type: 'DARKMODE' })
    }
  }

  const muiTheme = useTheme()

  return (
    <AppBar color="transparent" position="sticky" sx={{ backgroundColor: alpha(muiTheme.palette.background.paper, 0.7), backdropFilter: 'blur(20px)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{
              height: 64,
            }}
            alt="Logo"
            src={Logo}
          />
          <Typography variant="h6" noWrap component="h1" sx={{ flexGrow: 1, mx: 2 }}>
            Country Quiz
          </Typography>
          <IconButton onClick={onClick} color="inherit">
            {darkMode ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
