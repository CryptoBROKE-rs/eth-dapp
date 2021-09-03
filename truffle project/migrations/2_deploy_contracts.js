const Campaign = artifacts.require('Campaign');
const Organisation = artifacts.require('Organisation');
//const NFT = artifacts.require('SimpleNFT');
//const Swapper = artifacts.require('SwapExamples');
require('dotenv').config();

module.exports = async function (deployer, network, accounts) {
  // Deploy Campaign
  //await deployer.deploy(Campaign, 1, "bla", 500)
  //const campaign = await Campaign.deployed()

  //Deploy NFT
  // await deployer.deploy(NFT)
  //const NFTs = await NFT.deployed();
  // Deploy Organisation
  //console.log(NFTs.address)
  await deployer.deploy(Organisation);
  const organisation = await Organisation.deployed();
  //Deploy Swapper
  // await deployer.deploy(Swapper, process.env.UNISWAP_ROUTER_ADDRESS)
  // const swapper = await Swapper.deployed()
};
