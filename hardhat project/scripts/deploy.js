// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const Organisation = await hre.ethers.getContractFactory('Organisation');
  const organisation = await Organisation.deploy();
  await organisation.deployed();
  console.log('Organisation deployed to:', organisation.address);

  // const Campaign = await hre.ethers.getContractFactory('Campaign');
  // const camp = await Campaign.deploy(
  //   0,
  //   'testL2',
  //   50000000000000,
  //   'test',
  //   1630857307,
  //   '0x4200000000000000000000000000000000000006',
  //   'QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq',
  //   '0xd438644837866493bFF771480aAD4B71F2B8aC97'
  // );
  // await camp.deployed();
  // console.log('Campaign deployed to:', camp.address);

  // const YieldFarm = await hre.ethers.getContractFactory('LiquidityExamplesTest');
  // const yieldfarm = await YieldFarm.deploy('0xC36442b4a4522E871399CD717aBDD847Ab11FE88');
  // await yieldfarm.deployed();
  // console.log('Yield Farm deployed to:', yieldfarm.address);

  // console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
