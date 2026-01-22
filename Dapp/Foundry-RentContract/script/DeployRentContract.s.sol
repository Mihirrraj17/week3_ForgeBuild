//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {RentContract} from "../src/RentContract.sol";

contract DeployRentContract is Script{
    function run() public returns(RentContract){
    uint _basefee=1000;
    uint _percentageIncrease=10;
    address _pricefeed=0x694AA1769357215DE4FAC081bf1f309aDC325306;
    vm.startBroadcast();
    RentContract deploy= new RentContract(_basefee,_percentageIncrease,_pricefeed);
    vm.stopBroadcast();

    return deploy;
    }
}