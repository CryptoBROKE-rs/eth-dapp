import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@material-ui/core';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';
import SwapVertIcon  from '@material-ui/icons/SwapVert';
import { makeStyles } from '@material-ui/styles';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 200;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  //backgroundColor: window.localStorage['layer'] === 'L1' ? theme.palette.grey[200] : '#333333'
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const classes = useStyles();
  const { pathname } = useLocation();
  const changeLayer = () => {
    const layer = window.localStorage['layer']
    window.localStorage['layer'] = layer === 'L1' ? 'L2' : 'L1'
    window.location.reload();
  }
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
            <Box component={RouterLink} to="/home" sx={{ display: 'inline-flex' }}>
            <Logo />
            </Box>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<SwapVertIcon />}
                onClick={changeLayer}
            >Switch layer</Button>


        </Stack>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {window.localStorage['firstName'] + ' ' + window.localStorage['lastName']}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
        <br/>
        <br/>
        <NavSection navConfig={sidebarConfig} />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>

      </Box>


    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}