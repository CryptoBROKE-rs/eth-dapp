import React, { Component, useState } from 'react';
import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
import Campaign from './abis/Campaign.json';
import Organisation from './abis/Organisation.json';
import SwapExamples from './abis/SwapExamples.json';
import OVM_L1StandardBridge from './abisL2/OVM_L1StandardBridge.json';
import OVM_L2StandardBridge from './abisL2/OVM_L2StandardBridge.json';
import CampaignL2 from './abisL2/Campaign.json';
import OrganisationL2 from './abisL2/Organisation.json';
const FormData = require('form-data');
const axios = require('axios');
init('user_ZYwxMAlLHOgUNKO4wSLBm');
const ethers = require('ethers');
const color = '#d2d2d2';
const pinataSDK = require('@pinata/sdk');
const web3 = require('web3');
const { Watcher } = require('@eth-optimism/core-utils');
require('dotenv').config();

class Home extends Component {
  constructor(props) {
    super(props);
    require('dotenv').config();
    this.campAbi = Campaign.abi;
    this.orgAbi = Organisation.abi;
    this.swapAbi = SwapExamples.abi;
    this.genericERC20Abi = [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address'
          },
          {
            name: '_to',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address'
          }
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address'
          },
          {
            name: '_spender',
            type: 'address'
          }
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address'
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Approval',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address'
          },
          {
            indexed: true,
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256'
          }
        ],
        name: 'Transfer',
        type: 'event'
      }
    ];
    this.state = {
      campId: '',
      address: '',
      value: '',
      campName: '',
      campGoal: '',
      campUser: '',
      campDescription: '',
      ID: '',
      recepient: '',
      memberAddress: '',
      email: '',
      loading: true,
      open: false,
      setOpen: false,
      activeCamps: {},
      finishedCamps: {},
      inactiveCamps: {},
      token: '',
      success: false,
      campLoadingFinished: false,
      layer: 'l2'
    };

    //this.state = {value: ''};
    // this.handleLoadingChange = this.handleLoadingChange.bind(this);
    // this.loadBlockchainData = this.loadBlockchainData.bind(this);
    // this.handleCampId = this.handleCampId.bind(this);
    // this.handleAddress = this.handleAddress.bind(this);
    // this.handleValue = this.handleValue.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleName = this.handleName.bind(this);
    // this.handleGoal = this.handleGoal.bind(this);
    // this.handleUser = this.handleUser.bind(this);
    // this.handleDescription = this.handleDescription.bind(this);
    // this.handleRecepient = this.handleRecepient.bind(this);
    // this.handleID = this.handleID.bind(this);
    // this.handleEmail = this.handleEmail.bind(this);
    // this.handleMemberAddress = this.handleMemberAddress.bind(this);
    // this.handleToken = this.handleToken.bind(this);
    var provider = new ethers.providers.InfuraProvider('kovan', process.env.REACT_APP_INFURA_KEY);
    // var provider = ethers.getDefaultProvider('kovan');
    //'https://tokens.uniswap.org/', 'https://testnet.tokenlist.eth.link/',
    this.l1 = {
      provider: provider,
      tokensDict: {},
      tokenListURL: ['https://static.optimism.io/optimism.tokenlist.json'],
      orgAddress: process.env.REACT_APP_ORGANISATION_CONTRACT_ADDRESS_L1,
      chainID: 42,
      orgAbi: Organisation.abi,
      campAbi: Campaign.abi
    };
    provider = new ethers.providers.JsonRpcProvider('https://kovan.optimism.io');
    this.l2 = {
      provider: provider,
      tokensDict: {},
      tokenListURL: ['https://static.optimism.io/optimism.tokenlist.json'],
      orgAddress: process.env.REACT_APP_ORGANISATION_CONTRACT_ADDRESS_L2,
      chainID: 69,
      orgAbi: OrganisationL2.abi,
      campAbi: CampaignL2.abi
    };
    this.subscribed = new Set();
    this.tokenListJSON = [];
    this.contractOrg = new ethers.Contract(
      process.env.REACT_APP_ORGANISATION_CONTRACT_ADDRESS_L2,
      this.orgAbi,
      this.provider
    );
    this.swapperAddress = process.env.REACT_APP_SWAPPER_CONTRACT_ADDRESS;
    this.loadTokenList('L1');
    this.loadTokenList('L2');
    this.pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    this.pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_KEY;
    this.imgURI =
      'https://ipfs.io/ipfs/QmRQX6MEwTcumgo2xhVagQ5mj7AxENB4AK6axPMM28aLz1?filename=Lisa.jpeg';
    this.items = [
      {
        src: 'http://localhost:8000/1.png',
        altText: 'Slide 1',
        caption: 'Psychosocial support for children during COVID-19',
        header: '',
        key: '1'
      },
      {
        src: 'http://localhost:8000/2.png',
        altText: 'Slide 2',
        caption:
          'Helping children return to normalcy: psychosocial support for children in the Marawi crisis',
        header: '',
        key: '2'
      },
      {
        src: 'http://localhost:8000/3.png',
        altText: 'Slide 3',
        caption: 'Donate to Help Children in Sierra Leone',
        header: '',
        key: '3'
      }
    ];
  }
  async loadTokenList(layer) {
    require('dotenv').config();
    if (layer == 'L1') {
      var params = this.l1;
    } else {
      var params = this.l2;
    }
    var chainId = params.chainID;
    await params.tokenListURL.forEach((url) => {
      fetch(url)
        .then((response) => response.json())
        .then((jsonData) => {
          // jsonData is parsed json object received from url
          // this.tokenListJSON.push(jsonData);
          jsonData.tokens.forEach((element) => {
            if (element.chainId == chainId) {
              params.tokensDict[element.symbol] = element.address;
            }
          });
        })
        .catch((error) => {
          // handle your errors here
          console.error(error);
        });
    });
    if (layer == 'l1') {
      this.l1 = params;
    } else {
      this.l2 = params;
    }
  }
  uploadNftFile(amount, campName, stamp, currency) {
    const pinata = pinataSDK(this.pinataApiKey, this.pinataSecretApiKey);
    pinata
      .testAuthentication()
      .then((result) => {
        //handle successful authentication here
      })
      .catch((err) => {
        //handle error here
        console.log(err);
      });
    const body = {
      name: campName,
      amount: amount,
      currency: currency,
      timestamp: stamp,
      img_uri: this.imgURI
    };
    const options = {
      pinataMetadata: {
        name: 'ELF token',
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2'
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    };
    pinata
      .pinJSONToIPFS(body, options)
      .then((result) => {
        //handle results here
        return result;
      })
      .catch((err) => {
        //handle error here
        console.log(err);
        return 0;
      });
  }
  async loadBlockchainData(layer) {
    var activeCamps = {};
    var inactiveCamps = {};
    var finishedCamps = {};
    if (layer == 'L1') {
      var params = this.l1;
    } else {
      var params = this.l2;
    }
    var contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    var counter = await contractOrg.campaignCounter();
    for (let i = 1; i <= counter; i++) {
      var Campaign = {
        owner: '',
        name: '',
        id: '',
        currFund: '',
        goal: '',
        description: '',
        mails: [],
        endTimeStamp: 0,
        uri: '',
        currency: ''
      };
      var addr = await contractOrg.campaigns(i);
      var camp = new ethers.Contract(addr, params.campAbi, params.provider);
      var name = await camp.name();
      var owner = await camp.owner();
      var id = await camp.id();
      var currFund = await camp.currFund();
      var goal = await camp.goal();
      var description = await camp.description();
      var finished = await camp.finished();
      var block = await params.provider.getBlock('latest');
      var currStamp = block.timestamp;
      var endStamp = await camp.endTimeStamp();
      var uri = await camp.URI();
      var currToken = await camp.wantToken();
      for (var [key, label] of Object.entries(params.tokensDict)) {
        if (label == currToken) {
          var currency = key;
          break;
        } else {
          var currency = 'ETH';
        }
      }
      const date = Math.floor(new Date(endStamp * 1000));
      const date2 = new Date(endStamp * 1000);
      const currDate = Math.floor(new Date());
      var daysLeft = Math.ceil(new Date(date - currDate) / (24 * 60 * 60 * 1000));
      endStamp = date2.toLocaleDateString('en-GB');
      var mails = [];
      var counterMail = await camp.mailCount();
      for (var j = 0; j < counterMail; j++) {
        var mail = await camp.mails(j);
        mails.push(mail);
      }
      Campaign.owner = owner.toString();
      Campaign.name = name.toString();
      Campaign.id = id.toString();
      Campaign.currFund = ethers.utils.formatEther(currFund.toString());
      Campaign.goal = ethers.utils.formatEther(goal.toString());
      Campaign.description = description.toString();
      Campaign.mails = mails;
      Campaign.endTimeStamp = endStamp;
      Campaign.daysLeft = daysLeft;
      Campaign.uri = uri;
      Campaign.currency = currency;
      if (currStamp > endStamp) {
        inactiveCamps[Campaign.id] = Campaign;
      } else if (finished == true) {
        finishedCamps[Campaign.id] = Campaign;
      } else {
        activeCamps[Campaign.id] = Campaign;
        if (!this.subscribed.has(id._hex)) {
          camp.on('GoalReached', (totalFund, goal, campaignId, name, mails) =>
            this.sendMail(campaignId, totalFund, goal, name, mails)
          );
          camp.on('Donated', (amount, campaignId, name, mail) => {
            this.donatedMail(amount, campaignId, name, mail);
            this.setState({ loading: true, success: true });
            const timer = setTimeout(() => {
              console.log('This will run after 3 seconds!');
              this.setState({ success: false });
            }, 3000);
          });
          this.subscribed.add(id._hex);
        }
      }
    }
    console.log(activeCamps);
    console.log('loaded');
    // this.setState({
    //   activeCamps: activeCamps,
    //   finishedCamps: finishedCamps,
    //   inactiveCamps: inactiveCamps,
    //   loading: false
    // });
    return { activeCamps: activeCamps, finishedCamps: finishedCamps, inactiveCamps: inactiveCamps };
  }

  async swap(campaignId, amount, email, token, uri) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(provider, signer);
    var campAddress = await this.contractOrg.campaigns(parseInt(campaignId, 10));
    console.log(campAddress);
    var contract = new ethers.Contract(campAddress, this.campAbi, provider);
    contract = contract.connect(signer);
    console.log(amount);
    console.log(token, this.genericERC20Abi, provider);
    var tokenContract = new ethers.Contract(token, this.genericERC20Abi, provider);
    tokenContract = tokenContract.connect(signer);
    var decimals = await tokenContract.decimals();
    amount = ethers.utils.parseUnits(amount, decimals);
    console.log(this.swapperAddress);
    var gasPrice = await provider.getGasPrice();
    var gasEstimate = await tokenContract.estimateGas.approve(this.swapperAddress, amount);
    var parameters = {
      gasLimit: gasEstimate,
      gasPrice: gasPrice
    };
    var approval = await tokenContract.approve(this.swapperAddress, amount, parameters);
    console.log(approval);
    var swapContract = new ethers.Contract(this.swapperAddress, this.swapAbi, provider);
    swapContract = swapContract.connect(signer);
    gasPrice = await provider.getGasPrice();
    var block = await provider.getBlock('latest');
    console.log(block.gasLimit);
    gasEstimate = await swapContract.estimateGas.swapExactInputSingle(
      amount,
      token,
      campAddress,
      uri,
      email
    );
    parameters = {
      gasLimit: gasEstimate,
      gasPrice: gasPrice
    };
    console.log(parameters);
    var outAmount = await swapContract.swapExactInputSingle(
      amount,
      token,
      campAddress,
      uri,
      email,
      parameters
    );
    console.log(outAmount);
  }

  async donate(campaignId, amount, email, currency, layer) {
    if (layer == 'L1') {
      var params = this.l1;
    } else {
      var params = this.l2;
    }
    const pinata = pinataSDK(this.pinataApiKey, this.pinataSecretApiKey);
    pinata
      .testAuthentication()
      .then((result) => {
        //handle successful authentication here
        console.log(result);
      })
      .catch((err) => {
        //handle error here
        console.log(err);
      });
    console.log(params);
    console.log(layer);
    console.log(window.localStorage['layer']);
    var contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    var campAddress = await contractOrg.campaigns(parseInt(campaignId, 10));
    var camp = new ethers.Contract(campAddress, params.campAbi, params.provider);
    var name = await camp.name();
    var block = await params.provider.getBlock('latest');
    var stamp = block.timestamp;
    const body = {
      name: name,
      amount: amount,
      currency: currency,
      timestamp: stamp,
      img_uri: this.imgURI
    };
    const options = {
      pinataMetadata: {
        name: 'ELF token',
        keyvalues: {
          customKey: 'customValue',
          customKey2: 'customValue2'
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    };
    pinata
      .pinJSONToIPFS(body, options)
      .then(async (result) => {
        //handle results here
        console.log(result);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        var address = await signer.getAddress();
        console.log(address);
        var uri = result.IpfsHash;
        var campAddress = await contractOrg.campaigns(parseInt(campaignId, 10));
        var contract = new ethers.Contract(campAddress, params.campAbi, params.provider);
        contract = contract.connect(signer);
        const gasPrice = await provider.getGasPrice();
        if (currency == 'ETH' && layer == 'L1') {
          var parameters = {
            value: ethers.utils.parseEther(amount),
            gasLimit: block.gasLimit,
            gasPrice: gasPrice
          };
          var tx = await contract.donateETH(email, parameters);
        } else {
          if (currency == 'ETH') {
            currency = '0x4200000000000000000000000000000000000006';
          }
          console.log('help');
          var token = ethers.utils.getAddress(currency);
          var tokenContract = new ethers.Contract(token, this.genericERC20Abi, params.provider);
          tokenContract = tokenContract.connect(signer);
          var decimals = await tokenContract.decimals();
          amount = ethers.utils.parseUnits(amount, decimals);
          if (layer == 'L1') {
            var parameters = {
              gasLimit: block.gasLimit,
              gasPrice: gasPrice
            };
            var approval = await tokenContract.approve(campAddress, amount, parameters);
            console.log('help');
            var tx = await contract.donate(email, token, amount, parameters);
          } else {
            var gasEstimate = await tokenContract.estimateGas.approve(campAddress, amount);
            var parameters = {
              gasLimit: gasEstimate,
              gasPrice: gasPrice
            };
            var approval = await tokenContract.approve(campAddress, amount, parameters);
            console.log('help');
            gasEstimate = await contract.estimateGas.donate(email, token, amount);
            parameters.gasLimit = gasEstimate;
            var tx = await contract.donate(email, token, amount, parameters);
          }
        }
        this.setState({
          campId: '',
          address: '',
          value: '',
          email: ''
        });
        return { result: true, message: 'Donation successful', value: 0 };
      })
      .catch((err) => {
        //handle error here
        console.log(err);
        return 0;
      });
  }
  async depositL2(amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const l2RpcProvider = this.l2.provider;
    const l1MessengerAddress = '0x4361d0F75A0186C05f971c566dC6bEa5957483fD';
    // L2 messenger address is always the same.
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007';

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
    amount = ethers.utils.parseEther(amount.toString());
    const tx2 = await L1StandardBridge.depositETH(2000000, '0x', { value: amount });
    const recep = await tx2.wait();
    // Wait for the message to be relayed to L2.
    console.log('Waiting for deposit to be relayed to L2...');
    const [msgHash1] = await watcher.getMessageHashesFromL1Tx(tx2.hash);
    var address = await signer.getAddress();
    const receipt = await watcher.getL2TransactionReceipt(msgHash1, true);
    console.log('receipt', receipt);
    var L2_ERC20 = new ethers.Contract(
      '0x4200000000000000000000000000000000000006',
      this.genericERC20Abi,
      l2RpcProvider
    );
    // Log some balances to see that it worked!
    console.log(`Balance on L1: ${await provider.getBalance(address)}`); // 0
    console.log(`Balance on L2: ${await L2_ERC20.balanceOf(address)}`); // 1234

    //
  }
  async withdrawL2(amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const l2RpcProvider = this.l2.provider;
    const l1MessengerAddress = '0x4361d0F75A0186C05f971c566dC6bEa5957483fD';
    // L2 messenger address is always the same.
    const l2MessengerAddress = '0x4200000000000000000000000000000000000007';

    // Tool that helps watches and waits for messages to be relayed between L1 and L2.
    const watcher = new Watcher({
      l1: {
        provider: this.l1.provider,
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

    var L2_ERC20 = new ethers.Contract(
      '0x4200000000000000000000000000000000000006',
      this.genericERC20Abi,
      l2RpcProvider
    );
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
    await tx3.wait();

    // Wait for the message to be relayed to L1.
    console.log(`Waiting for withdrawal to be relayed to L1...`);
    const [msgHash2] = await watcher.getMessageHashesFromL2Tx(tx3.hash);
    await watcher.getL1TransactionReceipt(msgHash2);
    var address = await signer.getAddress();
    // Log balances again!
    console.log(`Balance on L1: ${await provider.getBalanceOf(address)}`); // 1234
    console.log(`Balance on L2: ${await L2_ERC20.balanceOf(address)}`); // 0
  }
  async sendMail(campaignId, curr_fund, goal, name, mails) {
    var sent = [];
    campaignId = campaignId.toString();
    console.log('proslo');
    for (var i = 0; i < mails.length; i++) {
      var params = {
        to_email: mails[i],
        campaign_name: name,
        goal: ethers.utils.formatEther(goal),
        curr_fund: ethers.utils.formatEther(curr_fund)
      };
      if (!sent.includes(mails[i])) {
        sent.push(mails[i]);
        emailjs.send('service_mr0tweq', 'template_p2vca7b', params).then(function (res) {
          console.log('mail sent!');
        });
      }
    }
    return 0;
  }

  async donatedMail(amount, campaignId, name, mail) {
    var sent = [];
    campaignId = campaignId.toString();
    console.log('proslo');
    var params = {
      to_email: mail,
      campaign_name: name,
      amount: ethers.utils.formatEther(amount)
    };
    emailjs.send('service_mr0tweq', 'template_cscp88f', params).then(function (res) {
      console.log('mail sent!');
    });
    return 0;
  }

  async changeDate(timestamp, campaignId, layer) {
    if (layer == 'L1') {
      var params = this.l1;
    } else {
      var params = this.l2;
    }
    var contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    var campAddress = await contractOrg.campaigns(parseInt(campaignId, 10));
    var camp = new ethers.Contract(campAddress, params.campAbi, params.provider);
    console.log(contractOrg);
    console.log(campAddress);
    console.log(timestamp);
    await camp.changeEndDate(timestamp);
    console.log(camp.endTimeStamp);
    return 0;
  }
  //   async addCampaign(name, goal, description, date, time) {
  //     var datetime = date + 'T' + time;
  //     var stamp = new Date(datetime);
  //     stamp = Math.floor(Date.parse(datetime) / 1000);
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     const orgContract = this.contractOrg.connect(signer);
  //     console.log(goal);
  //     goal = ethers.utils.parseEther('1.0');
  //     console.log(goal);
  //     var parameters = { gasLimit: 0x7a1200 };
  //     console.log(goal._hex[0]);
  //     var tx = await orgContract.addCampaign(name, tokens, description, stamp, address);
  //   }

  async addMember(layer) {
    var params = layer == 'L1' ? this.l1 : this.l2;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    var address = await signer.getAddress();


    const contractOrg = new ethers.Contract(
        params.orgAddress,
        params.orgAbi,
        params.provider
    );

    const orgContract = contractOrg.connect(signer);
    var member = await contractOrg.members(address);



    if (!member) {
      var gasLimit = layer == 'L1' ? 12_500_000 : await orgContract.estimateGas.addMember(address);
      var gasPrice = await provider.getGasPrice();
      var parameters = {
        gasPrice: gasPrice,
        gasLimit: gasLimit
      };

      var tx = await orgContract.addMember(address, parameters);
    }
  }

  async addCampaign(
    name,
    goal,
    description,
    date,
    time,
    wantToken,
    uri,
    wantTokenL2,
    L2Address,
    layer
  ) {
    console.log(date);
    console.log(time);
    var datetime = date.setHours(time.getHours(), time.getMinutes(), 0, 0);
    console.log(datetime);
    var stamp = Math.floor(datetime / 1000);
    if (layer === 'L1') {
      var params = this.l1;
    } else {
      var params = this.l2;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    var address = await signer.getAddress();
    const contractOrg = new ethers.Contract(params.orgAddress, params.orgAbi, params.provider);
    const orgContract = contractOrg.connect(signer);
    goal = ethers.utils.parseEther(goal)._hex;
    console.log(goal)
    const gasPrice = await provider.getGasPrice();
    console.log(stamp);

    console.log('kurac')
    console.log(name, goal, description, stamp, wantToken, uri)
    console.log(params)
    if (layer === 'L2') {
      const gasEstimate = await orgContract.estimateGas.addCampaign(
        name,
        goal,
        description,
        stamp,
        wantToken,
        uri
      );
      console.log('kita')
      console.log(gasPrice);
      console.log(gasEstimate, gasPrice);
      var parameters = {
        gasLimit: gasEstimate,
        gasPrice: gasPrice
      };

      var tx = await orgContract.addCampaign(
        name,
        goal,
        description,
        stamp,
        wantToken,
        uri,
        parameters
      );

      console.log('pimpek')

      var receipt = await tx.wait();
      var campaignId = await contractOrg.campaignCounter();
      var campAddress = await contractOrg.campaigns(campaignId);
      window.location.replace('http://localhost:3000');
      return campAddress;
    } else {
      const gasEstimate = await orgContract.estimateGas.addCampaign(
        name,
        goal,
        description,
        stamp,
        wantToken,
        uri,
        L2Address,
        wantTokenL2
      );
      console.log(gasPrice);
      console.log(gasEstimate, gasPrice);
      var parameters = {
        gasLimit: 12500000,
        gasPrice: gasPrice
      };
      var tx = await orgContract.addCampaign(
        name,
        goal,
        description,
        stamp,
        wantToken,
        uri,
        L2Address,
        wantTokenL2,
        parameters
      );

      var receipt = await tx.wait();
      var campaignId = await contractOrg.campaignCounter();
      var campAddress = await contractOrg.campaigns(campaignId);
      window.location.replace('http://localhost:3000');
      return campAddress;
    }
    // const gasEstimate = await orgContract.estimateGas.addCampaign(
    //   name,
    //   goal,
    //   description,
    //   stamp,
    //   address
    // );
    // console.log(gasPrice);
    // console.log(gasEstimate, gasPrice);
    // var parameters = {
    //   gasLimit: gasEstimate,
    //   gasPrice: gasPrice
    // };
    // var tx = await orgContract.addCampaign(name, goal, description, stamp, address, parameters);

    // var receipt = await tx.wait();
    // window.location.replace('http://localhost:3000');
  }
  handleLoadingChange(event) {
    this.setState({ loading: true });
    event.preventDefault();
  }
  handleCampId(event) {
    this.setState({ campId: event.target.value });
  }
  handleAddress(event) {
    this.setState({ address: event.target.value });
  }
  handleValue(event) {
    this.setState({ value: event.target.value });
  }
  handleName(event) {
    this.setState({ campName: event.target.value });
  }
  handleGoal(event) {
    this.setState({ campGoal: event.target.value });
  }
  handleUser(event) {
    this.setState({ campUser: event.target.value });
  }
  handleDescription(event) {
    this.setState({ campDescription: event.target.value });
  }
  handleID(event) {
    this.setState({ ID: event.target.value });
  }
  handleRecepient(event) {
    this.setState({ recepient: event.target.value });
  }
  handleEmail(event) {
    this.setState({ email: event.target.value });
  }
  handleToken(event) {
    this.setState({ token: event.target.value });
  }
  handleMemberAddress(event) {
    this.setState({ memberAddress: event.target.value });
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
}
export default Home;
