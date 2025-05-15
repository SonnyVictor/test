// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {GoldCoin} from "../src/PreciousMetals.sol";
import {OracleEntrypoint} from "erc4337-oracle/src/OracleEntrypoint.sol";
import {DataDependent} from "erc4337-oracle/src/DataDependent.sol";

contract CounterTest is Test {
    OracleEntrypoint oracle;
    GoldCoin goldNft;
    Account provider;

    function setUp() public {
        oracle = new OracleEntrypoint();
        provider = makeAccount("provider");
        // emit log_address(provider.addr);
        goldNft = new GoldCoin(provider.addr, address(oracle));

        // set price for bid data
        bytes memory prefix = "\x19Oracle Signed Price Change:\n148";
        bytes32 prefixedHashMessage = keccak256(
            abi.encodePacked(
                prefix,
                abi.encodePacked(
                    block.chainid,
                    provider.addr,
                    oracle.nonces(provider.addr),
                    goldNft.MARKET_XAU(),
                    uint256(0.001 ether)
                )
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            provider.key,
            prefixedHashMessage
        );

        vm.prank(provider.addr);
        oracle.setPrice(
            provider.addr,
            0,
            goldNft.MARKET_XAU(),
            0.001 ether,
            r,
            s,
            v
        ); //fetching the gold price costs something... We'll skip the POL Price
    }

    function test_mintNft() public {
        vm.warp(100000000);
        // first, we get the data requirements for the mint call
        DataDependent.DataRequirement[] memory dataSources = goldNft
            .requirements(bytes4(keccak256("safeMint(address)"))); // mint selector

        uint[2] memory prices = [uint(2500 * 10 ** 18), 4 * 10 ** 17]; //$2500 XAU/USD, $0,4 POL/USD

        // now, for each requirement the bundler will push the data in
        for (uint256 i = 0; i < dataSources.length; i++) {
            assertEq(dataSources[i].provider, provider.addr); // provider should be the bundler :)
            uint256 value = block.timestamp * 1000 * 2 ** (8 * 26); // timestamp
            value += 18 * 2 ** (8 * 25); // decimals
            value += prices[i]; // price for xau and POL USD

            bytes memory prefix = "\x19Oracle Signed Data Op:\n168";
            bytes32 prefixedHashMessage = keccak256(
                abi.encodePacked(
                    prefix,
                    abi.encodePacked(
                        block.chainid,
                        provider.addr,
                        oracle.nonces(provider.addr),
                        dataSources[i].requester,
                        dataSources[i].dataKey,
                        bytes32(value)
                    )
                )
            );

            (uint8 v, bytes32 r, bytes32 s) = vm.sign(
                provider.key,
                prefixedHashMessage
            );

            vm.prank(provider.addr);
            oracle.storeData(
                provider.addr,
                dataSources[i].requester,
                oracle.nonces(provider.addr),
                dataSources[i].dataKey,
                bytes32(value),
                r,
                s,
                v
            );
        }

        address alice = makeAddr("alice");
        // emit log_address(alice);
        vm.deal(alice, 10000 ether);
        vm.startPrank(alice);
        goldNft.safeMint{value: (6250 ether + 0.001 ether)}(alice); //$2500 XAU / $0,4 POL + 0.001 data price
        assertEq(goldNft.balanceOf(alice), 1);
    }
}
