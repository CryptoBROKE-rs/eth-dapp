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
import { withStyles } from '@material-ui/styles';
import { Stack, TextField, Button, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ArrowDownwardIcon from '@iconify/icons-eva/arrow-downward-fill';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import OVM_L1StandardBridge from '../abisL2/OVM_L1StandardBridge.json';
import OVM_L2StandardBridge from '../abisL2/OVM_L2StandardBridge.json';
import OVM_L1CrossDomainMessenger from '../abis/OVM_L1CrossDomainMessenger.json';
import { getMessagesAndProofsForL2Transaction } from '@eth-optimism/message-relayer';
import { sleep } from '@eth-optimism/core-utils';
// components
import Page from '../components/Page';
import Home from '../OldHome';
import { useTheme } from '@emotion/react';
const ethers = require('ethers');
const { Watcher } = require('@eth-optimism/core-utils');

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
const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff'
  }
}))(LinearProgress);
const switchETHChain = async (chainID) => {
  if (chainID == 42) {
    chainID = '0x2A';
  } else {
    chainID = '0x45';
  }
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainID }]
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      try {
        if (chainID == 69) {
          var url = 'https://kovan.optimism.io';
        } else {
          var url = 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        }
        console.log();
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: chainID == 69 ? 'Optimistic Kovan' : 'Kovan',
              chainId: chainID,
              rpcUrls: [url]
            }
          ]
        });
      } catch (addError) {
        console.log(addError);
      }
    }
    // handle other "switch" errors
  }
};

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

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

export default function ToLayer2() {
  const [currencyL, setCurrencyL] = React.useState('ETH');
  const [currency, setCurrency] = React.useState('ETH');
  const [amount, setAmount] = React.useState('');
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isAlert, setAlert] = React.useState(false);
  const [alertMessage, setMessage] = React.useState([]);
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
  const [messagePairs, setMessagePairs] = React.useState('');
  const [finalize, setFinalize] = React.useState(false);

  const depositL2 = async (amount, token) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const l2RpcProvider = oldHome.l2.provider;
    const l1MessengerAddress = '0x4361d0F75A0186C05f971c566dC6bEa5957483fD';
    // L2 messenger address is always the same.
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007';
    const tokenL1 = oldHome.l1.tokensDict[token];
    const tokenL2 = oldHome.l2.tokensDict[token];

    // Tool that helps watches and waits for messages to be relayed between L1 and L2.
    const watcher = new Watcher({
      l1: {
        provider: provider,
        messengerAddress: l1MessengerAddress
      },
      l2: {
        provider: l2RpcProvider,
        messengerAddress: l2MessengerAddress
      }
    });
    var L1StandardBridge = new ethers.Contract(
      '0x22F24361D548e5FaAfb36d1437839f080363982B',
      OVM_L1StandardBridge.abi,
      provider
    );
    L1StandardBridge = L1StandardBridge.connect(signer);
    console.log('Depositing tokens into L2 ...');
    var tx2 = '';
    if (token == 'ETH') {
      amount = ethers.utils.parseEther(amount.toString());
      tx2 = await L1StandardBridge.depositETH(2000000, '0x', { value: amount });
    } else {
      var tokenContract = new ethers.Contract(
        tokenL1,
        oldHome.genericERC20Abi,
        oldHome.l1.provider
      );
      var decimals = await tokenContract.decimals();
      tokenContract = tokenContract.connect(signer);
      amount = ethers.utils.parseUnits(amount, decimals);
      var gasPrice = oldHome.l1.provider.getGasPrice();
      var parameters = {
        gasLimit: 125000,
        gasPrice: gasPrice
      };
      var approval = await tokenContract.approve(
        '0xb415e822C4983ecD6B1c1596e8a5f976cf6CD9e3',
        amount,
        parameters
      );
      await approval.wait();
      console.log('yes');
      tx2 = await L1StandardBridge.depositERC20(
        tokenL1.toLowerCase(),
        tokenL2.toLowerCase(),
        amount,
        2000000,
        '0x'
      );
    }
    setAlert(true);
    setMessage('Depositing tokens into L2 ...');
    setProgress(33);
    const recep = await tx2.wait();
    // Wait for the message to be relayed to L2.
    console.log('Waiting for deposit to be relayed to L2...');
    setMessage('Waiting for deposit to be relayed to L2...');
    setProgress(67);
    const [msgHash1] = await watcher.getMessageHashesFromL1Tx(tx2.hash);
    var address = await signer.getAddress();
    const receipt = await watcher.getL2TransactionReceipt(msgHash1, true);
    console.log('receipt', receipt);
    if (token == 'ETH') {
      var L2_ERC20 = new ethers.Contract(
        '0x4200000000000000000000000000000000000006',
        oldHome.genericERC20Abi,
        l2RpcProvider
      );
    } else {
      var L2_ERC20 = new ethers.Contract(tokenL2, oldHome.genericERC20Abi, l2RpcProvider);
    }
    // Log some balances to see that it worked!
    console.log(`Balance on L1: ${await provider.getBalance(address)}`); // 0
    console.log(`Balance on L2: ${await L2_ERC20.balanceOf(address)}`); // 1234
    setMessage('Deposit Succesful!');
    setProgress(100);
    setTimeout(() => {
      setAlert(false);
      setProgress(0);
    }, 5000);
  };
  const withdrawL2 = async (amount, token) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const l2RpcProvider = oldHome.l2.provider;
    const l1MessengerAddress = '0x4361d0F75A0186C05f971c566dC6bEa5957483fD';
    // L2 messenger address is always the same.
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007';
    const tokenL1 = oldHome.l1.tokensDict[token];
    const tokenL2 = oldHome.l2.tokensDict[token];

    // Tool that helps watches and waits for messages to be relayed between L1 and L2.
    const watcher = new Watcher({
      l1: {
        provider: oldHome.l1.provider,
        messengerAddress: l1MessengerAddress
      },
      l2: {
        provider: l2RpcProvider,
        messengerAddress: l2MessengerAddress
      }
    });
    var L2StandardBridge = new ethers.Contract(
      '0x4200000000000000000000000000000000000010',
      OVM_L2StandardBridge.abi,
      l2RpcProvider
    );
    L2StandardBridge = L2StandardBridge.connect(signer);

    if (token == 'ETH') {
      var L2_ERC20 = new ethers.Contract(
        '0x4200000000000000000000000000000000000006',
        oldHome.genericERC20Abi,
        l2RpcProvider
      );
    } else {
      var L2_ERC20 = new ethers.Contract(tokenL2, oldHome.genericERC20Abi, l2RpcProvider);
    }
    console.log(`Withdrawing tokens back to L1 ...`);
    amount = ethers.utils.parseEther(amount);
    console.log(amount);
    var gasPrice = l2RpcProvider.getGasPrice();
    var gasLimit = await L2StandardBridge.estimateGas.withdraw(
      L2_ERC20.address,
      amount,
      2000000,
      '0x'
    );
    var parameters = {
      gasPrice: gasPrice,
      gasLimit: gasLimit
    };

    const tx3 = await L2StandardBridge.withdraw(
      L2_ERC20.address,
      amount,
      2000000,
      '0x',
      parameters
    );
    setAlert(true);
    setMessage('Withdrawing tokens back to L1 ...');
    setProgress(33);
    await tx3.wait();
    await switchETHChain(42);
    // Wait for the message to be relayed to L1.
    console.log(`Waiting for withdrawal to be relayed to L1...`);
    setMessage('Waiting for withdrawal to be relayed to L1...');
    setProgress(67);
    const l1RpcProviderUrl = 'https://kovan.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY;
    const l2RpcProviderUrl = 'https://kovan.optimism.io';
    const l1StateCommitmentChainAddress = '0xa2487713665AC596b0b3E4881417f276834473d2';
    const l2CrossDomainMessengerAddress = '0x4200000000000000000000000000000000000007';
    const l2TransactionHash = tx3.hash;
    while (true) {
      try {
        var messagePairs = await getMessagesAndProofsForL2Transaction(
          l1RpcProviderUrl,
          l2RpcProviderUrl,
          l1StateCommitmentChainAddress,
          l2CrossDomainMessengerAddress,
          l2TransactionHash
        );
        break;
      } catch (err) {
        if (err.message.includes('unable to find state root batch for tx')) {
          console.log(`no state root batch for tx yet, trying again in 5s...`);
          await sleep(5000);
        } else {
          throw err;
        }
      }
    }

    console.log(messagePairs);
    setMessagePairs(messagePairs);
    setFinalize(true);
    setMessage('You can now finish your withdrawal.');
    return messagePairs;
  };
  const finalizeWithdrawal = async (messagePairs) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const l2RpcProvider = oldHome.l2.provider;
    const l1RpcProviderUrl = 'https://kovan.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY;
    const l2RpcProviderUrl = 'https://kovan.optimism.io';
    const l1StateCommitmentChainAddress = '0xa2487713665AC596b0b3E4881417f276834473d2';
    const l2CrossDomainMessengerAddress = '0x4200000000000000000000000000000000000007';
    const l1MessengerAddress = '0x4361d0F75A0186C05f971c566dC6bEa5957483fD';
    // L2 messenger address is always the same.
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007';
    const l1provider = new ethers.providers.JsonRpcProvider(l1RpcProviderUrl);
    var l1CrossDomainMessenger = new ethers.Contract(
      l1MessengerAddress,
      OVM_L1CrossDomainMessenger.abi,
      l1provider
    );
    l1CrossDomainMessenger = l1CrossDomainMessenger.connect(signer);
    console.log(`found ${messagePairs.length} messages`);
    for (let i = 0; i < messagePairs.length; i++) {
      console.log(`relaying message ${i + 1}/${messagePairs.length}`);
      const { message, proof } = messagePairs[i];
      while (true) {
        try {
          const result = await l1CrossDomainMessenger.relayMessage(
            message.target,
            message.sender,
            message.message,
            message.messageNonce,
            proof
          );
          await result.wait();
          console.log(
            `relayed message ${i + 1}/${messagePairs.length}! L1 tx hash: ${result.hash}`
          );
          break;
        } catch (err) {
          if (err.message.includes('execution failed due to an exception')) {
            console.log(`fraud proof may not be elapsed, trying again in 5s...`);
            await sleep(5000);
          } else if (err.message.includes('message has already been received')) {
            console.log(`message ${i + 1}/${messagePairs.length} was relayed by someone else`);
            break;
          } else {
            throw err;
          }
        }
      }
    }
    setMessage('Withdrawal complete!');
    setFinalize(false);
    setProgress(100);
    // console.log(tx3.hash);
    // const [msgHash2] = await watcher.getMessageHashesFromL2Tx(tx3.hash);
    // await watcher.getL1TransactionReceipt(msgHash2);
    // var address = await signer.getAddress();
    // Log balances again!
    // console.log(`Balance on L1: ${await provider.getBalanceOf(address)}`); // 1234
    // console.log(`Balance on L2: ${await L2_ERC20.balanceOf(address)}`); // 0
    setTimeout(() => {
      setAlert(false);
      setProgress(0);
    }, 5000);
  };

  const onSubmit = async () => {
    await switchETHChain(42);
    console.log(amount);
    depositL2(amount, currencyL);
  };
  const handleWithdraw = async () => {
    await switchETHChain(69);
    console.log(amount);
    var messagePairs = await withdrawL2(amount, currency);
    setMessagePairs(messagePairs);
  };
  const handleFinalize = async () => {
    await finalizeWithdrawal(messagePairs);
    setMessagePairs('');
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
  const theme = useTheme();
  return (
    <RootStyle title="Support Children">
      <Container>
        <Stack>{isAlert && <Alert severity="info">{alertMessage}</Alert>}</Stack>
        <br />
        <SectionStyle>
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                color="secondary"
                variant="fullWidth"
                value={val}
                onChange={handleChange}
                aria-label="nav tabs example"
                style={{ backgroundColor: theme.palette.secondary.main, color: '#ffffff' }}
              >
                <LinkTab
                  label="Deposit"
                  href="/drafts"
                  {...a11yProps(0)}
                  style={{ color: '#ffffff' }}
                />
                <LinkTab
                  label="Withdraw"
                  href="/trash"
                  {...a11yProps(1)}
                  style={{ color: '#ffffff' }}
                />
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
              <br />
              <Stack>
                {isAlert && (
                  <BorderLinearProgress
                    variant="determinate"
                    value={progress}
                  ></BorderLinearProgress>
                )}
              </Stack>
              <br />
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
              <br />
              <Stack>
                {isAlert && (
                  <BorderLinearProgress
                    variant="determinate"
                    value={progress}
                  ></BorderLinearProgress>
                )}
              </Stack>
              <br />
              {!finalize && (
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              )}
              {finalize && (
                <Button
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={handleFinalize}
                >
                  Finalize withdrawal
                </Button>
              )}
            </TabPanel>
          </div>
        </SectionStyle>
      </Container>
    </RootStyle>
  );
}
