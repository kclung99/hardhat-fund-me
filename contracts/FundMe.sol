// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// error
error FundMe_NotOwner();
error FundMe_NotEnough();
error FundMe_WithdrawFail();

/**
 * @title simple funding contract
 * @author KC
 * @notice this contract receives funding and allowing contract owner to withdraw funds
 * @dev this contract implements price feed from the chainlink library
 */
contract FundMe {
    // type declaration
    using PriceConverter for uint256;

    // state variable
    address public immutable i_owner;
    AggregatorV3Interface public s_priceFeed;
    uint256 public constant MIN_USD = 50 * 1e18; // additional 18 digits to handle decimals
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;

    // modifier
    modifier owner() {
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    // special function
    constructor(address priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    // main function
    function fund() public payable {
        // check min price
        // if (msg.value.getConversionRate(s_priceFeed) < MIN_USD)
        //     revert FundMe_NotEnough();

        // push to funder array and add to mappings
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public owner {
        address[] memory funders = s_funders; // gas optimization by assigning local variable

        // clear amount funded
        for (uint256 i = 0; i < funders.length; i++) {
            s_addressToAmountFunded[funders[i]] = 0;
        }

        // clear funders
        s_funders = new address[](0);

        // withdraw fund to contract owner
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        if (!success) revert FundMe_WithdrawFail();
    }

    // getter function
    function getAddressToAmountFunded(
        address fundingAddress
    ) public view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
