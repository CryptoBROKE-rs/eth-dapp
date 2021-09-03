require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const infuraKey = process.env.INFURA_API_KEY;
const mnemonic = process.env.MNEMONIC;
module.exports = {
  contracts_directory: "./contractsL2",
  contracts_build_directory: "./build/OVMContracts",
  networks: {
    optimistic_kovan: {
      network_id: 69,
      gas: 23720000,
      gasPrice: 15000000,
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: 'https://optimism-kovan.infura.io/v3/' + infuraKey,
          addressIndex: 0,
          numberOfAddresses: 1,
          chainId: 69
        });
      }
    }
  },
  compilers: {
    solc: {
      version: 'node_modules/@eth-optimism/solc'
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
