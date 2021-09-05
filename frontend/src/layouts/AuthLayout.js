import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Typography, Button, Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// components
import Logo from '../components/Logo';
import SwapVertIcon  from '@material-ui/icons/SwapVert';
//
import { MHidden } from '../components/@material-extend';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node
};

const changeLayer = () => {
  if (window.localStorage["layer"] == "L1") {
    window.localStorage["layer"] = "L2"
  } else {
    window.localStorage["layer"] = "L1"
  }
}


export default function AuthLayout({ children }) {
  const classes = useStyles();

  return (
    <HeaderStyle>
      <RouterLink to="/">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Logo />
        <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<SwapVertIcon />}
            justifyContent="flex-end"
            align = "right"
            onClick={changeLayer}
          >Popuši mi kurac</Button>
        </Stack>
      </RouterLink>

      <MHidden width="smDown">
        <Typography
          variant="body2"
          sx={{
            mt: { md: -2 }
          }}
        >
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  );
}
