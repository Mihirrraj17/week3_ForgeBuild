//SPDX-License-Identifier:MIT
pragma solidity  ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract RentContract{
    error NotCorrectValue();
    error AlreadyFunded();
    error  OnlyOwnerCanWithdraw();

    uint private i_basefee;
    uint private immutable i_percentageIncrease;
    address private immutable i_pricefeed;
    mapping (uint => bool ) private i_funders;
    address public owner;
    

    constructor(uint _basefee, uint _percentageIncrease, address _pricefeed){
     i_basefee= _basefee;
     i_percentageIncrease= _percentageIncrease;
     i_pricefeed= _pricefeed;
     owner=msg.sender;
    }
    function fund(uint monthIndex) public payable {
        if(msg.value <totalEth(monthIndex)){
            revert NotCorrectValue();   
        }
        if(checkIfFunded(monthIndex)!=false){
            revert AlreadyFunded();
        }
        i_funders[monthIndex]=true;
        (bool success, ) = payable(msg.sender).call{value:(msg.value-totalEth(monthIndex))}("");
        require(success, "Transfer failed");
    }
    function checkIfFunded(uint monthIndex) public view returns(bool){
        return i_funders[monthIndex];
    }

    function getlatestprice() public view returns(uint){
        AggregatorV3Interface EthinUsd= AggregatorV3Interface(i_pricefeed);
        (,int price,,,)= EthinUsd.latestRoundData();
        return uint(price);
    }
    function getMonthRent(uint monthIndex) public view returns(uint){
        uint256 currentRent = i_basefee;
        if (monthIndex == 0) 
            return currentRent;
      
            for (uint256 i = 0; i < monthIndex; i++) {
                currentRent = (currentRent * (100 + i_percentageIncrease)) / 100;
            }
            return currentRent;
        
    
    }

    function totalEth(uint monthIndex) public view returns(uint){
        
        return (getMonthRent(monthIndex))*1e26/(getlatestprice())/100;
    }


    function withdraw() public onlyOwner{
    payable(owner).transfer(address(this).balance);
    }
      
    modifier onlyOwner(){
        if(msg.sender!=owner)
            revert OnlyOwnerCanWithdraw();
        _;
        
    }
}