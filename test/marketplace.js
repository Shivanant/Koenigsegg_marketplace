const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const toWei=(num)=>ethers.utils.parseEther(num.toString());
const fromWei=(num)=>ethers.utils.formatEther(num);

describe("nftMarketplace",async ()=>{
    let acc1,acc2,acc3,nft,seller,marketplace;
    let uri="test uri";

    beforeEach(async()=>{
        [seller,acc1,acc2,acc3]= await ethers.getSigners();
        
        const Marketplace= await ethers.getContractFactory("Marketplace");
        const NFT = await ethers.getContractFactory("NFT");
        nft= await NFT.connect(seller).deploy();
        
        marketplace= await Marketplace.connect(seller).deploy(nft.address,seller.address);

        
    })
    describe("Deployment",async()=>{
        it("returns seller address",async()=>{
            expect(await marketplace.seller()).to.be.equal(seller.address);
        })
        it("returns nft contract details",async()=>{
            expect(await nft.symbol()).to.be.equal("NFT");
            expect(await nft.name()).to.be.equal("NFT");
        })
    })

    describe("Minting",async()=>{
        it("mints and return token count",async()=>{
            await nft.connect(seller).mint(uri);
            expect(await nft.tokenCount()).to.be.equal(1);
            //token cnt increase;
            await nft.connect(acc2).mint(uri);
            expect(await nft.tokenCount()).to.be.equal(2);
            expect(await nft.tokenURI(1)).to.be.equal(uri);
            
           
        })
       
    })
    describe("Making of marketplace item",async()=>{
        beforeEach(async()=>{
            await nft.connect(seller).mint(uri);
            await nft.connect(seller).setApprovalForAll(marketplace.address,true);
            await marketplace.connect(seller).makeItem(1,tokens(2));
            

        })
        it("transfer nft from seller to market",async()=>{
            const item= await marketplace.items(1);
            expect(item.owner).to.be.equal(marketplace.address);
            
           
           })
           
        it("markes it for sail ",async()=>{
            const item= await marketplace.items(1);
            expect(item.sold).to.be.equal(false);
        }  )
       
    }
    );


    describe("Purchase",async()=>{
        let price =2;
        let sellerbal;

        beforeEach(async()=>{
            await nft.connect(seller).mint(uri);
            await nft.connect(seller).mint(uri);
            await nft.connect(seller).mint(uri);
            await nft.connect(seller).setApprovalForAll(marketplace.address,true);
            await marketplace.connect(seller).makeItem(1,tokens(2));
            await marketplace.connect(acc1).purchaseItem(1,{value : tokens(2)});
            sellerbal= await seller.getBalance();
            
        })
        it('change ownership',async()=>{
            const item= await marketplace.items(1);
            expect(item.owner).to.be.equal(acc1.address);
            
        })
        it('updates seller balance',async()=>{
            let sellercurbal= await seller.getBalance();
            expect( +fromWei(sellerbal) + +fromWei(2) ).to.be.equal( +fromWei(sellercurbal))
        })
    })
    // describe("Purchasing of marketplace item",async()=>{
    //     let price=2;
    //     let totalPriceSend;
    //     let fee = (feePercent/100)*price
    //     let sellerBalBefore;
    //     let sellerBalAfter;
    //     let recieverBalBefore;
    //     let recieverBalAfter;
    //     let feeAccBefore;
    //     let feeAccAfter;
        
    //     beforeEach(async()=>{
    //         await nft.connect(acc1).mint(uri);
    //         await nft.connect(acc1).setApprovalForAll(marketplace.address,true);
    //         await marketplace.connect(acc1).makeItem(nft.address,toWei(price),1);
    //         sellerBalBefore=await acc1.getBalance();
    //         // sellerBalBefore=sellerBalBefore.parseInt()
    //         recieverBalBefore=await acc2.getBalance();
    //         // recieverBalBefore=recieverBalBefore.parseInt();
    //         feeAccBefore= await seller.getBalance();



    //     })
    //     it("emit Bought event,change the owner of nft,sends money to seller,sets item to sold",async()=>{
    //         totalPriceSend= await marketplace.getTotalPrice(1);

    //         expect(await marketplace.connect(acc2).purchaseItem(1,{value:totalPriceSend})).to.emit(marketplace,'Bought')
    //         .withArgs(
    //             1,
    //             nft.address,
    //             1,
    //             toWei(price),
    //             acc1.address,
    //             acc2.address
    //         );
    //         //transferof ownership 
    //         expect(await nft.ownerOf(1)).to.be.equal(acc2.address);
    //         sellerBalAfter=await acc1.getBalance();
    //         // sellerBalAfter=sellerBalAfter.parseInt();
    //         recieverBalAfter= await acc2.getBalance();
    //         // recieverBalAfter=recieverBalAfter.parseInt();

    //         // console.log(fromWei(sellerBalBefore)+" ");
    //         // console.log(fromWei(totalPriceSend)+" ");
    //         // console.log(fee+"  ");
    //         // console.log(fromWei(sellerBalAfter))     
    //         //sellers account       
    //         expect(+fromWei(sellerBalAfter)).to.be.equal( +fromWei(totalPriceSend) + +fromWei(sellerBalBefore) - fee);
    //         // //reciever account        important * the gas is also getting cut from reciecer to nft 
    //         // expect(+fromWei(recieverBalAfter)).to.be.equal(+fromWei(recieverBalBefore) - +fromWei(totalPriceSend))
    //         expect((await marketplace.Items(1)).sold).to.be.equal(true);   

    //         feeAccAfter= await seller.getBalance();
    //         expect(+fromWei(feeAccAfter)).to.be.equal(+fromWei(feeAccBefore) + +fee);

    //     });
    // })
})