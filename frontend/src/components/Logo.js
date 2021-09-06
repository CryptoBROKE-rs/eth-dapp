import PropTypes from 'prop-types';
// material
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src={window.localStorage['layer'] === 'L1' ? "/static/home_light.svg" : "/static/home_dark.svg"} sx={{ width: 40, height: 40, ...sx }} />;
}
