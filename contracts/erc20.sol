// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ICO is ERC20, Ownable{

    constructor() ERC20("Kunal","KNL"){
        _mint(msg.sender, 10000 * (10**uint256(decimals())));  // mint initialSupply tokens with decimals
    }

    // mint new tokens
    function mint(address account, uint256 ammount) public onlyOwner returns(bool){
        
        require(account != address(this) && ammount != uint256(0), "ERC20: function mint invalid argument");
        _mint(account, ammount);
        return true;
    
    }

    // burn tokens from account
    function burn(address account, uint256 ammount) public onlyOwner returns(bool){
        require(account != address(this) && ammount != uint256(0), "ERC20: function invalid argument");
        _burn(account, ammount);
        return true;
    }

    function buy() public payable returns (bool){
        require(msg.sender.balance >= msg.value && msg.value != 0 ether, "ICO: function buy invalid argument");
        uint ammount = msg.value * 1000;
        _transfer(owner(), _msgSender(), ammount);
        return true;
    }

    function withdraw(uint256 ammount)public onlyOwner returns(bool){
        require(ammount <= address(this).balance, "ICO: function Withdraw Invalid Input");
        payable(_msgSender()).transfer(ammount);
        return true;
    }
}

