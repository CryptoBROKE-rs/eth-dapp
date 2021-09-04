import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { makeStyles, withStyles } from '@material-ui/styles';
import { LoadingButton } from '@material-ui/lab';
import LinearProgress from '@material-ui/core/LinearProgress';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';
import FormDialog from '../../donate/DonationForm';
import FormDialog2 from '../../_dashboard/NewDateForm.js'
import { clamp } from 'lodash-es';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired
};

export default function ShopProductCard({ camp, currencies, owner }) {
  console.log("!!");
  const isOwner = owner;
  console.log(isOwner);
  const { name, id, currFund, goal, description, endStamp, daysLeft, color, uri, currency } = camp;
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    setProgress(parseFloat(100 * (currFund / goal)).toFixed(2));
  }, [currFund]);
  //
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle
          alt={name}
          src= {"https://ipfs.infura.io/ipfs/" + uri}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <div className={classes.root}>
          <LinearProgressWithLabel value={progress} />
        </div>
        <Typography variant="h6" align="center" noWrap>
          goal:
          {goal} {currency}
        </Typography>
        { !owner ? <FormDialog id={id} currencies={currencies} /> : <FormDialog2 id={id} />}
        <Typography variant="subtitle2" align="center" noWrap>
          End date: {endStamp}
        </Typography>
      </Stack>
    </Card>
  );
}
