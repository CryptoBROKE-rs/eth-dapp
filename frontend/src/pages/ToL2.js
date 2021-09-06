import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Card, Link, Container, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { Icon } from '@iconify/react';
import Tab from '@material-ui/core/Tab';
import { Stack, TextField, Button, Grid } from '@material-ui/core';
import ArrowDownwardIcon from '@iconify/icons-eva/arrow-downward-fill';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// components
import Page from '../components/Page';
import Home from '../OldHome';
import { useTheme } from '@material-ui/core/styles';



// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 700,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: 'auto'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 700,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`full-width-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

function LinkTab(props) {
  return (
      <Tab
          color="secondary"
          component="a"
          onClick={(event) => {
            event.preventDefault();
          }}
          {...props}
      />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: 700
  }
}));

export default function ToLayer2() {
  const [currencyL, setCurrencyL] = React.useState('ETH');
  const [currency, setCurrency] = React.useState('ETH');
  const [amount, setAmount] = React.useState('');
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const l1tokensDict = {
    ETH: '0x0000000000000000000000000000000000000000',
    DAI: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
    EURT: '0x50EB44e3a68f1963278b4c74c6c343508d31704C',
    LINK: '0xa36085F69e2889c224210F603D836748e7dC0088',
    RAI: '0x76b06a2f6dF6f0514e7BEC52a9AfB3f603b477CD',
    SNX: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    USDC: '0x50dC5200082d37d5dd34B4b0691f36e3632fE1A8',
    USDT: '0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B',
    WBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095'
  };

  const l2tokensDict = {
    ETH: '0x4200000000000000000000000000000000000006',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    EURT: '0x65e44970ebFe42f98F83c4B67062DE94B9f3Da7D',
    LINK: '0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B',
    RAI: '0x743224e4822710a3e40d754244f3e0f1db2e5d8f',
    SNX: '0x0064A673267696049938AA47595dD0B3C2e705A1',
    UNI: '0x5e31B81eaFba4b9371e77F34d6f3DA8091C3F2a0',
    USDC: '0x4e62882864fB8CE54AFfcAf8D899A286762B011B',
    USDT: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    WBTC: '0x2382a8f65b9120E554d1836a504808aC864E169d',
    sUSD: '0xaA5068dC2B3AADE533d3e52C6eeaadC6a8154c57'
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleCurrencyL = (event) => {
    setCurrencyL(event.target.value);
  };
  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };
  const oldHome = new Home();
  const [withdraw, setWithdraw] = React.useState('optimistic');
  const onSubmit = () => {
    console.log(amount);
    oldHome.depositL2(amount, currencyL);
  };
  const handleWithdraw = () => {
    console.log(amount);
    oldHome.withdrawL2(amount, currency);
  };
  var currenciesL1 = [];
  var currenciesL2 = [];
  for (var [label, val] of Object.entries(l1tokensDict)) {
    currenciesL1.push({ label: label, value: val });
  }
  for (var [label, val] of Object.entries(l2tokensDict)) {
    currenciesL2.push({ label: label, value: val });
  }
  console.log(currenciesL1);
  console.log(currenciesL2);
  var currs = window.localStorage['layer'] == 'L1' ? currenciesL1 : currenciesL2;



  return (
      <RootStyle title="Register | Minimal-UI">
        <Container>
          <SectionStyle>
            <div className={classes.root}>
              <AppBar position="static" color="default">
                <Tabs
                    color="secondary"
                    variant="fullWidth"
                    value={val}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    style={{backgroundColor: theme.palette.secondary.main}}
                >
                  <LinkTab color="secondary" label="Deposit" {...a11yProps(0)}
                  />
                  <LinkTab color="secondary" label="Withdraw" {...a11yProps(1)} />
                </Tabs>
              </AppBar>

              <TabPanel value={value} index={0}>
                <Typography> from: KOVAN</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                      fullWidth
                      label="Amount"
                      type="text"
                      value={amount}
                      variant="outlined"
                      inputProps={{
                        maxLength: 13,
                        step: '0.1'
                      }}
                      onChange={(e) => setAmount(e.target.value.toString())}
                  />
                  <TextField
                      id="standard-select-currency-native"
                      select
                      label="Native select"
                      value={currencyL}
                      onChange={handleCurrencyL}
                      SelectProps={{
                        native: true
                      }}
                      helperText="Please select your currency"
                  >
                    {currenciesL1.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                    ))}
                  </TextField>
                </Stack>

                <Grid container direction="row" alignItems="center" xs={15}>
                  <Grid item>
                    <Icon icon={ArrowDownwardIcon} width={30} height={32} display="block" />
                  </Grid>
                </Grid>

                <Typography> to: OPTIMISTIC KOVAN</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                      fullWidth
                      label="Amount"
                      type="text"
                      value={amount}
                      variant="outlined"
                      inputProps={{
                        maxLength: 13,
                        step: '0.1'
                      }}
                      onChange={(e) => setAmount(e.target.value.toString())}
                  />
                  <TextField
                      id="standard-select-currency-native"
                      select
                      label="Native select"
                      value={currencyL}
                      onChange={handleCurrencyL}
                      SelectProps={{
                        native: true
                      }}
                      helperText="Please select your currency"
                  >
                    {currenciesL2.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                    ))}
                  </TextField>
                </Stack>
                <Button fullWidth size="large" type="submit" variant="contained" onClick={onSubmit}>
                  Approve
                </Button>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                      fullWidth
                      label="Amount"
                      type="text"
                      value={amount}
                      variant="outlined"
                      inputProps={{
                        maxLength: 13,
                        step: '0.1'
                      }}
                      onChange={(e) => setAmount(e.target.value.toString())}
                  />
                  <TextField
                      id="standard-select-currency-native"
                      select
                      label="Native select"
                      value={currency}
                      onChange={handleCurrency}
                      SelectProps={{
                        native: true
                      }}
                      helperText="Please select your currency"
                  >
                    {currs.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                    ))}
                  </TextField>
                </Stack>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Transation options</FormLabel>
                  <RadioGroup
                      aria-label="transaction-options"
                      name="option1"
                      value={val}
                      onChange={(e) => setWithdraw(e.target.value)}
                  >
                    <FormControlLabel value="optimistic" control={<Radio />} label="Optimistic" />
                    <FormControlLabel value="fast" control={<Radio />} label="Fast" />
                  </RadioGroup>
                </FormControl>
                <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              </TabPanel>
            </div>
          </SectionStyle>
        </Container>
      </RootStyle>
  );
}