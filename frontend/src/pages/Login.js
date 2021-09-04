import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Grid,
  SvgIcon,
  Collapse
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useFormik, Form, FormikProvider } from 'formik';
import { ethers } from 'ethers';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import AuthSocial from '../components/authentication/AuthSocial';
import Organisation from '../abis/Organisation.json';
import { useEffect, useState } from 'react';
import { RegisterForm } from '../components/authentication/register';

// ----------------------------------------------------------------------
const Web3 = require('web3');
require('dotenv').config();

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------
let REACT_APP_FRONTEND_URL = 'http://localhost:3000';
let REACT_APP_BACKEND_URL = 'http://localhost:8000/api';

export default function Login(props) {
  let web3;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLogin] = useState(false);
  const [signUpForm, setSignUpForm] = useState(false);
  const [formData, setFormData] = useState('');

  const [usersTemp, setUsersTemp] = useState();

  const onLoggedIn = async (auth) => {
    const orgAbi = Organisation.abi;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    var address = await signer.getAddress();
    const contractOrg = new ethers.Contract(
      process.env.REACT_APP_ORGANISATION_CONTRACT_ADDRESS_L1,
      orgAbi,
      provider
    );
    const orgContract = contractOrg.connect(signer);
    var member = await orgContract.members(address);
    if (member == false) {
      var gasPrice = await provider.getGasPrice();
      var gasLimit = await orgContract.estimateGas.addMember(address);
      var parameters = {
        gasPrice: gasPrice,
        gasLimit: gasLimit
      };
      var tx = await orgContract.addMember(address, parameters);
    }
    props.onLoggedIn(auth);

    return 0;
  };

  const handleClick = async (data) => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }

    if (true) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
        console.log(web3, 'true');
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert('Please activate MetaMask first.');
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    setLoading(true);

    if (!signUpForm) {
      fetch(`${REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`)
        .then((response) => response.json())
        .then((users) => {
          if (users.length) {
            handleSignMessage(users[0])
              .then(handleAuthenticate)
              .catch((err) => {
                window.alert(err);
                setLoading(false);
              });
          } else {
            setSignUpForm(true);
          }
        });
    } else {
      if (data) {
        const dataValues = data.values;
        fetch(`${REACT_APP_BACKEND_URL}/users`, {
          body: JSON.stringify({ publicAddress, dataValues }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })
          .then((response) => response.json())
          .then(handleSignMessage)
          .then(handleAuthenticate)
          .catch((err) => {
            window.alert(err);
            setLoading(false);
          });
      }
    }
  };

  const handleAuthenticate = (signAddress) => {
    var publicAddress = signAddress.address;
    var signature = signAddress.signature;

    fetch(`${REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then((response) => {
      response
        .json()
        .then(onLoggedIn)
        .catch((err) => window.alert(err));
    });
  };

  const handleSignMessage = async (publicAddress) => {
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${publicAddress.nonce}`,
        publicAddress.publicAddress,
        '' // MetaMask will ignore the password argument here
      );
      var address = publicAddress.publicAddress;
      //var sign = signature.signature;
      console.log(address);
      console.log(signature);
      return { address, signature };
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in.');
    }
  };

  const navigate = useNavigate();
  const formik = useFormik({});
  const { isSubmitting, handleSubmit } = formik;
  return (
    <RootStyle title="Login | Minimal-UI">
      <MHidden width="mdDown">
        <SectionStyle>
          <img src="/favicon/metamask.svg" alt="metamask login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack>
            <Typography variant="h4" gutterBottom align="center">
              Sign in to Support Children
            </Typography>
            <Collapse in={signUpForm}>
              <Typography variant="h6" gutterBottom align="center">
                Since you are signing in for the first time, please, provide us with some more info
              </Typography>
              <RegisterForm callback={(data) => setFormData(data)} handle={handleClick} />
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
                By registering, I agree to Support children&nbsp;
                <Link underline="always" sx={{ color: 'text.primary' }}>
                  Terms of Service
                </Link>
                &nbsp;and&nbsp;
                <Link underline="always" sx={{ color: 'text.primary' }}>
                  Privacy Policy
                </Link>
              </Typography>
              <MHidden width="smUp">
                <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
                  Already have an account?&nbsp;
                  <Link to="/login" component={RouterLink}>
                    Login
                  </Link>
                </Typography>
              </MHidden>
              <Container maxWidth="96px" justifyContent="center"></Container>
            </Collapse>
            <br />

            <Collapse in={!signUpForm}>
              <LoadingButton
                style={{
                  backgroundColor: '#ffa500'
                }}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={handleClick}
              >
                Login with MetaMask
              </LoadingButton>
            </Collapse>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
