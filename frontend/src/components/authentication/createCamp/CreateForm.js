import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Datepicker from '@material-ui/lab/DatePicker';
import TimePicker from '@material-ui/lab/TimePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import Home from '../../../OldHome';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { create } from 'ipfs-http-client';

const pinataSDK = require('@pinata/sdk');
var FormData = require('form-data');
const client = create('https://ipfs.infura.io:5001/api/v0');
require('dotenv').config();
const dec2hexString = (dec) => {
  return '0x' + (dec + 0x10000).toString(16).substr(-4);
};
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

export default function CreateForm() {
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

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const OldHome = new Home();
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      campName: '',
      campDesc: ''
    },
    // validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const options = {
        pinataMetadata: {
          name: values.campName,
          keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
          }
        },
        pinataOptions: {
          cidVersion: 0
        }
      };
      const added = await client.add(file);
      const url = `${added.path}`;
      if (layer == 'L1') {
        await switchETHChain(42);
        OldHome.addCampaign(
          values.campName,
          goal,
          values.campDesc,
          selectedDate,
          selectedTime,
          l1tokensDict[currency],
          url,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L1'
        );
      } else if (layer == 'L2') {
        await switchETHChain(69);
        console.log('lajer 2');
        OldHome.addCampaign(
          values.campName,
          goal,
          values.campDesc,
          selectedDate,
          selectedTime,
          l2tokensDict[currency],
          url,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L2'
        );
      } else {
        await switchETHChain(69);
        var L2add = await OldHome.addCampaign(
          values.campName,
          goal,
          values.campDesc,
          selectedDate,
          selectedTime,
          l2tokensDict[currency],
          url,
          '0x0000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000',
          'L2'
        );
        await switchETHChain(42);
        OldHome.addCampaign(
          values.campName,
          goal,
          values.campDesc,
          selectedDate,
          selectedTime,
          l1tokensDict[currency],
          url,
          l2tokensDict[currency],
          L2add,
          'L1'
        );
      }
      //navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [file, setFile] = useState('');
  const [goal, setGoal] = useState('');
  const [currency, setCurrency] = React.useState('ETH');
  const [buffer, setBuffer] = React.useState('');
  const [layer, setLayer] = React.useState('');
  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  var currencies = [];
  if (window.localStorage['layer'] == 'L1') {
    if (l1tokensDict) {
      for (var [label, value] of Object.entries(l1tokensDict)) {
        currencies.push({ value: value, label: label });
      }
    }
  } else {
    if (l2tokensDict) {
      for (var [label, value] of Object.entries(l2tokensDict)) {
        currencies.push({ value: value, label: label });
      }
    }
  }
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Campaign name"
            {...getFieldProps('campName')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            label="Campaign description"
            {...getFieldProps('campDesc')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Campaign goal"
              type="number"
              value={goal}
              variant="outlined"
              onChange={(e) => setGoal(e.target.value)}
            />
            <TextField
              id="standard-select-currency-native"
              select
              label="Native select"
              value={currency}
              onChange={handleChange}
              SelectProps={{
                native: true
              }}
              helperText="Please select your currency"
            >
              {currencies.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Datepicker
                disableToolbar
                variant="inline"
                inputFormat="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                renderInput={(props) => <TextField {...props} label="End date" />}
              />
              <TimePicker
                margin="normal"
                id="time-picker"
                value={selectedTime}
                onChange={(newValue) => {
                  setSelectedTime(newValue);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change time'
                }}
                renderInput={(props) => <TextField {...props} label="End time" />}
              />
            </Stack>
          </LocalizationProvider>
          <label htmlFor="btn-upload">
            Choose a picture for your campaign:
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: 'none' }}
              type="file"
              onChange={fileChangeHandler}
            />
            <Button className="btn-choose" variant="outlined" component="span">
              Choose File
            </Button>
            {file.name}
          </label>
          <FormControl component="fieldset">
            <FormLabel component="legend">Layer support</FormLabel>
            <RadioGroup
              aria-label="transaction-options"
              name="option1"
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
            >
              <FormControlLabel value="L1" control={<Radio />} label="Layer 1" />
              <FormControlLabel value="L2" control={<Radio />} label="Layer 2" />
              <FormControlLabel value="both" control={<Radio />} label="Both" />
            </RadioGroup>
          </FormControl>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create Campaign
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
