import { Link as RouterLink, Outlet } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Button, Stack } from '@material-ui/core';
// components
import Logo from '../components/Logo';
import SwapVertIcon  from '@material-ui/icons/SwapVert';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout(props) {
  const classes = useStyles();
  const changeLayer = () => {
    if (window.localStorage["layer"] == "L1") {
      window.localStorage["layer"] = "L2"
    } else {
      window.localStorage["layer"] = "L1"
    }
    console.log(window.localStorage["layer"]);
  }
  return (
      <HeaderStyle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<SwapVertIcon />}
            onClick={changeLayer}
          >Switch layer</Button>{window.localStorage['username'] === undefined ?
            !window.localStorage['login'] && <Button variant="contained" component={RouterLink} to="/login" >
              Login
            </Button> :
            !window.localStorage['login'] && <Button variant="contained" onClick={props.onLoggedOut} component={RouterLink} to="/home">
              Logout
            </Button>}
        </Stack>
      </HeaderStyle>
  );
}
