//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {RentContract} from "../src/RentContract.sol";
import {DeployRentContract} from "../script/DeployRentContract.s.sol";
import {console} from "forge-std/console.sol";

contract RentContractTest is Test{

    RentContract rentContract;
    uint constant STARTING_VALUE= 1 ether;
    uint256 constant SEND_VALUE = 0.1 ether;
  address USER = address(0x1);

    function setUp() public {
        DeployRentContract deploy = new DeployRentContract();
        rentContract = deploy.run();
        vm.deal(USER,STARTING_VALUE);

    }

  function testGetPrice() public {
        uint256 price = rentContract.getlatestprice();
        assert(price > 0);
    }
    function testFundUpdatesState() public {
        vm.prank(USER); 
        rentContract.fund{value: SEND_VALUE}(1); 

        bool isFunded = rentContract.checkIfFunded(1);
        assertEq(isFunded, true);
    }

   function testCannotFundSameMonthTwice() public {
        vm.startPrank(USER);
        rentContract.fund{value: SEND_VALUE}(1);
        
        vm.expectRevert(RentContract.AlreadyFunded.selector);
        rentContract.fund{value: SEND_VALUE}(1);
        vm.stopPrank();
    } 

    function testReturnsExtraMoneyToUser() public{
        uint256 startingUserBalance = address(USER).balance;  
        vm.prank(USER);
        rentContract.fund{value:SEND_VALUE}(1);
          
        uint256 endingUserBalance = address(USER).balance;
        uint rentAmount= rentContract.totalEth(1);
      uint256 actualSpent = startingUserBalance - endingUserBalance;
        
      console.log("Actual ETH Spent:   ", actualSpent);
  
    

        assertEq(
        endingUserBalance, 
        startingUserBalance - rentAmount
    );
    }
    
function testWithdrawSuccessAsOwner() public {
    vm.prank(USER);
    rentContract.fund{value: SEND_VALUE}(1); 

    uint256 startingOwnerBalance = address(rentContract.owner()).balance;
    uint256 contractBalanceBefore = address(rentContract).balance;

    vm.prank(rentContract.owner());
    rentContract.withdraw();
    uint256 endingOwnerBalance = address(rentContract.owner()).balance;
    uint256 contractBalanceAfter = address(rentContract).balance;

    assertEq(
        endingOwnerBalance, 
        startingOwnerBalance + contractBalanceBefore
    );
}
function testTotalEthChangesByMonth() public view {
    uint256 ethMonth0 = rentContract.totalEth(0);
    uint256 ethMonth1 = rentContract.totalEth(1);
    uint256 ethMonth2 = rentContract.totalEth(2);

    console.log("Month 0 ETH:", ethMonth0);
    console.log("Month 1 ETH:", ethMonth1);
    console.log("Month 2 ETH:", ethMonth2);

    assert(ethMonth1 > ethMonth0);
    assert(ethMonth2 > ethMonth1);

    uint256 percentage = 10; 
    uint256 expectedMonth1 = (ethMonth0 * (100 + percentage)) / 100;
    
    assertEq(ethMonth1, expectedMonth1);
}
}