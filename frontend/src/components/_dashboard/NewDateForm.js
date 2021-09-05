import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Datepicker from '@material-ui/lab/DatePicker';
import TimePicker from '@material-ui/lab/TimePicker';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Stack, TextField, Button, CircularProgress } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Home from '../../OldHome';
const ethers = require('ethers');

export default function FormDialog2({ id }) {
  const [open, setOpen] = React.useState(false);
  const [timestamp, setTimestamp] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [isSubmitting, setSubmit] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  var layer = window.localStorage['layer'];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();


  var OldHome = new Home();
  const handleClose = () => {
    setOpen(false);
  };
  const handleDateChange = async () => {
    setSubmit(true);
    console.log(timestamp);
    await OldHome.changeDate(timestamp, id, window.localStorage["layer"]).then(() => {
      setOpen(false);
      setSubmit(false);
    });
  };

  var params = layer === 'L1' ? OldHome.l1 : OldHome.l2;


  const handleStake = async () => {
    const contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    const campAddress = await contractOrg.campaigns(parseInt(id, 10));
    console.log(campAddress)
    const camp = new ethers.Contract(campAddress, params.campAbi, params.provider).connect(signer);
    const gasPrice = await provider.getGasPrice();
    const gasEstimate = camp.estimateGas.synthetixIssue();

    console.log(gasEstimate);
    console.log(gasPrice);


    const parameters = {
      gasLimit: gasEstimate,
      gasPrice: gasPrice
    };

    var tx = camp.synthetixIssue(parameters);

  }
  const handleUnstake = async () => {
    const contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    const campAddress = await contractOrg.campaigns(parseInt(id, 10));
    console.log(campAddress)
    const camp = new ethers.Contract(campAddress, params.campAbi, params.provider).connect(signer);
    const gasPrice = await provider.getGasPrice();
    const gasEstimate = camp.estimateGas.synthetixBurn();

    console.log(gasEstimate);
    console.log(gasPrice);

    const parameters = {
      gasLimit: gasEstimate,
      gasPrice: gasPrice
    };

    var tx = camp.synthetixBurn(parameters);

  }


  return (
    <div>
      <Button fullWidth size="large" type="submit" variant="contained" onClick={handleClickOpen}>
        Update
      </Button>
      {window.localStorage['layer'] === 'L2' && <div><br/><br/><Button fullWidth size="large" type="submit" variant="contained" color="secondary" onClick={handleStake}>
        Stake
      </Button></div>}
      {window.localStorage['layer'] === 'L2' && <div><br/><Button fullWidth size="large" type="submit" variant="contained" color="secondary" onClick={handleUnstake}>
        Unstake
      </Button></div>}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change End Date</DialogTitle>
        <DialogContent>
          <br />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateChange} color="primary" disabled={isSubmitting}>
            Update
          </Button>

          {isSubmitting && <CircularProgress />}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
