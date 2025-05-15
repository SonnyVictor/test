// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {GoldCoin, SilverCoin} from "../src/PreciousMetals.sol";

//download & install Frame wallet
//export POLYGON_KEY= ... get this from polygonscan.com
//forge script ./scripts/FreeGold.s.sol --rpc-url http://localhost:1248 --broadcast --chain-id 137 --verify --etherscan-api-key=${POLYGON_KEY}
contract DeployCoins is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new GoldCoin(
            0x110016975ce40F7cB1Dae96a9da51ae1037db3c4,
            0xfc13Eca5251CDbC1ED703da32c8E3038Da227E24
        );
        new SilverCoin(
            0x110016975ce40F7cB1Dae96a9da51ae1037db3c4,
            0xfc13Eca5251CDbC1ED703da32c8E3038Da227E24
        );

        vm.stopBroadcast();
    }
}
