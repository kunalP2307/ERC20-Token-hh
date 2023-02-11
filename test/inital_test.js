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

    it("You don't have permission to withdraw ether from contract", async function(){
        const wallet = token.connect(accounts[2]);
        await expect(wallet.withdraw(ammount)).to.be.reverted;
    }); 

    it("transfer ammount to destination account", async function(){
        await token.transfer(accounts[1].address, ammount);
        expect(await token.balanceOf(accounts[1].address)).to.equal(ammount); 
    });

    it("Cannot Transfer above the ammount", async function(){
        const wallet = token.connect(accounts[3]);
        await expect(wallet.transfer(accounts[1].address,ammount)).to.be.reverted;
    });

    it("Cannot Transfer from an empty ammount", async function(){
        const wallet = token.connect(accounts[3]);
        await expect(wallet.transfer(accounts[1].address,ammount)).to.be.reverted;
    });

    it("Test minting token", async function(){
        const before_mint_bal = await token.balanceOf(accounts[0].address);
        await token.mint(accounts[0].address, ammount);
        const after_mint_bal = await token.balanceOf(accounts[0].address);
        expect (after_mint_bal).to.equal((before_mint_bal.add(ammount)));
    });

    it("test to burn tokens", async function(){
        const before_burn_bal = await token.balanceOf(accounts[0].address);
        await token.burn(accounts[0].address, ammount);
        const after_burn_bal = await token.balanceOf(accounts[0].address);
        expect (after_burn_bal).to.equal((before_burn_bal.sub(ammount)));
    });

    it("test withdraw ether from smart contract",async function(){
        const before_withdraw_bal = await accounts[0].getBalance();
        await token.withdraw(ammount);
        const after_withdraw_bal = await accounts[0].getBalance();
        expect (before_withdraw_bal.lt(after_withdraw_bal)).to.be.equal(true);
    });

    it("do not have enough ether to buy token", async function(){
        const wallet = token.connect(accounts[3]);
        const big_ammount = ethers.utils.parseEther("999");
        const option = {value: big_ammount};
        let error;

        try{
            await wallet.buy(option);
        }catch(err){
            error = "sender does not have enough funds";
        }
        
        expect(error).to.equal("sender does not have enough funds");

    });
})