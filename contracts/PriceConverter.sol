// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getConversionRate(
        uint256 amount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // get eth price rate (in USD)
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        uint256 ethPrice = uint256(answer * 1e10);

        // convert amount
        uint256 ethAmountInUsd = (amount * ethPrice) / 1e18; // amount is in wei
        return ethAmountInUsd;
    }
}
