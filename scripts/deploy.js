const { ethers, artifacts } = require("hardhat");
const fs=require("fs");
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  [seller,acc1,acc2,acc3]= await ethers.getSigners();
  const NFT= await ethers.getContractFactory('NFT');
  const MARKETPLACE= await ethers.getContractFactory('Marketplace');
  const nft= await NFT.deploy();
  await nft.deployed()
  console.log(`the nft contract is deployed at address:${nft.address}`)
  const marketplace= await MARKETPLACE.deploy(nft.address,seller.address);
  await marketplace.deployed();
  console.log(`the nft contract is deployed at address:${marketplace.address}`)

  console.log('minting nft');
  for( let i=0;i<8;++i){
   
    let tx=await nft.connect(seller).mint(`https://ipfs.io/ipfs/QmRdQs1PYJVg2KTrUzNsLffXeKNUNBEyNLc5aHS4caYyoJ/${i+1}.json`)
    await tx.wait();
  }
  console.log('nftminted')
  console.log('setting approval for all');
  await nft.connect(seller).setApprovalForAll(marketplace.address,1);
  
  console.log('listing nft');
  for (let i=1;i<=8;++i){
    tx=await marketplace.connect(seller).makeItem(i,tokens(2));
    await tx.wait();
   
  }


  Makefrontenddata(marketplace,"Marketplace")
  Makefrontenddata(nft,"NFT")

  
  
}

const Makefrontenddata=(contract,contractName)=>{


  const contractDir=__dirname+"../../src/ContractData";
  if(!fs.existsSync(contractDir)){
    fs.mkdirSync(contractDir)
  }

  fs.writeFileSync(
    contractDir+`/${contractName}--address.json`,
    JSON.stringify({address:contract.address})
  )
  const contractArtifact=artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractDir+`/${contractName}.json`,
    JSON.stringify(contractArtifact)
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
