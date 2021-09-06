import { useFormik } from 'formik';
import { useState } from 'react';
import { Link as RouterLink, Outlet} from 'react-router-dom';
// material
import { Container, Stack, Typography, Button, Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import Logo from "../components/Logo";
import Item from "../components/Item";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  top: 20,
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

export default function Home(props) {
  const classes = useStyles();
  const [openFilter, setOpenFilter] = useState(false);
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  const changeLayer = () => {
    const layer = window.localStorage['layer']
    window.localStorage['layer'] = layer === 'L1' ? 'L2' : 'L1'
    window.location.reload();
  }

  return (
    <RootStyle title="Home page | Support children" paddingTop>
      <Outlet/>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <RouterLink to="/">
          <Logo/>
        </RouterLink>

        <Stack direction="row" alignItems="right">
        <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<SwapVertIcon />}
            onClick={changeLayer}
        >Switch layer</Button>{window.localStorage['username'] === undefined ?
          !window.localStorage['login'] && <Button variant="contained" className={classes.button} component={RouterLink} to="/login" >
            Login
          </Button> :
          !window.localStorage['login'] && <Button variant="contained" className={classes.button} onClick={props.onLoggedOut} component={RouterLink} to="/home">
            Logout
          </Button>}
        </Stack>
      </Stack>
      <Container sx={0} >
        <Box display="flex" justifyContent="flex-end" alignItems="right">
        </Box>
        <Stack direction="row" alignItems="left" justifyContent="center">
          <Typography variant="h2" align="center">
            Support children
          </Typography>
        </Stack>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>
        <ProductList onlyOwner={false} />
      </Container>
    </RootStyle>
  );
}
