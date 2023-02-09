const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 smart contract testing", function(){

    let token;
    let accounts;
    //parse 1 ether and convert it into wei format
    const ammount = ethers.utils.parseEther("1");

    before(async() => {
        //deployment using code
        const contract = await ethers.getContractFactory("ICO");
        token = await contract.deploy();
        accounts = await ethers.getSigners();

        //like see the output window in remix
        await token.deployed();
    });

    it("Assigns Initial Balance ",async function(){
        const totalSupply = await token.totalSupply();
        // accounts(0) inital owner person who deployed the contract
        expect(await token.balanceOf(accounts[0].address)).to.equal(totalSupply);
    });

    it("Do not have permission to mint tokens ", async function(){
        // connect to wallet of account
        const wallet = token.connect(accounts[2]);
        await expect(wallet.mint(accounts[2].address, ammount)).to.be.reverted;
    });
    
    it("Do not have permission to butn tokens ", async function(){
        // connect to wallet of account
        const wallet = token.connect(accounts[2]);
        await expect(wallet.burn(accounts[2].address, ammount)).to.be.reverted;
    });
    
    it("Buy Token with ether ", async function(){
        const wallet = token.connect(accounts[2]);
        const option = {value : ammount};
        const calculatedVal = (option.value).mul(1000);
        
        await wallet.buy(option);
        expect (await wallet.balanceOf(accounts[2].address)).to.equal(calculatedVal);
    });

})