// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "erc4337-oracle/src/DataDependent.sol";


contract GoldCoin is ERC721, Ownable, DataDependent {
    uint256 private _nextTokenId;
    mapping(uint => uint) tokenPriceInUsd;


    address dataProvider; // polygon = 0x1101184E85D4CAf7DE2357c66e4F052bbc552497; //get this from the Feed page
    address oracle; // polygon = 0xd4f4baD1Fba15F8B136DBb9A44CE44caa3E92A5A;
    bytes32 constant public MARKET_XAU = keccak256("MORPHER:COMMODITY_XAU");
    bytes32 constant public MARKET_POL = keccak256("MORPHER:CRYPTO_POL");

    constructor(address _dataProvider, address _oracle)
        ERC721("Morpher GoldDemo", "FXAU")
        Ownable(msg.sender)
    {
        dataProvider = _dataProvider;
        oracle = _oracle;
    }

    function safeMint(address to) public payable {
        
        ResponseWithExpenses memory response_xau = _invokeOracle(oracle, dataProvider, MARKET_XAU);
        ResponseWithExpenses memory response_pol = _invokeOracle(oracle, dataProvider, MARKET_POL);
        require(msg.value >= ((response_pol.expenses + response_xau.expenses)) + (response_xau.value * 1e18) / response_pol.value, "Not enough value to pay for XAU plus Oracle Data!");

        uint remainder = uint(msg.value - (((response_pol.expenses + response_xau.expenses)) + (response_xau.value * 1e18) / response_pol.value));
        
        payable(msg.sender).transfer(remainder);

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        tokenPriceInUsd[tokenId] = response_xau.value;

        //for demonstration purposes, send whatever is in this contract back too
        payable(msg.sender).transfer(address(this).balance);
        
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
         return string.concat(
                "data:application/json;utf8,", 
                '{"name":"Morpher Oracle GoldToken", "description":"Demo to mind one Ounce of Gold at current Prices", "attributes":[{"trait_type": "Purchase Price","value": ',Strings.toString(tokenPriceInUsd[tokenId]),'}], "image":"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmNWQwIiAvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9ImdvbGQiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIxMCIgLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjYwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KSIgc3Ryb2tlLXdpZHRoPSI1IiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZDRhZjM3IiBmb250LXNpemU9IjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGR5PSIuMzVlbSI+QXU8L3RleHQ+Cjwvc3ZnPgo=", "external_url":"https://oracle.morpher.com"}'); 
    }

     function requirements(bytes4 _selector) external view override returns (DataRequirement[] memory) {
        //each function that needs data needs to be specified here. 
        if (_selector == bytes4(keccak256("safeMint(address)"))) {
            DataRequirement[] memory requirement = new DataRequirement[](2);
            requirement[0] = DataRequirement(dataProvider, address(this), MARKET_XAU);
            requirement[1] = DataRequirement(dataProvider, address(this), MARKET_POL);
            return requirement;
        }
        return new DataRequirement[](0);
    }


}

contract SilverCoin is ERC721, Ownable, DataDependent {
    uint256 private _nextTokenId;
    mapping(uint => uint) tokenPriceInUsd;


    address dataProvider; // polygon = 0x1101184E85D4CAf7DE2357c66e4F052bbc552497; //get this from the Feed page
    address oracle; // polygon = 0xd4f4baD1Fba15F8B136DBb9A44CE44caa3E92A5A;
    bytes32 constant public MARKET_XAG = keccak256("MORPHER:COMMODITY_XAG");
    bytes32 constant public MARKET_POL = keccak256("MORPHER:CRYPTO_POL");

    constructor(address _dataProvider, address _oracle)
        ERC721("Morpher SilverDemo", "FXAG")
        Ownable(msg.sender)
    {
        dataProvider = _dataProvider;
        oracle = _oracle;
    }

    function safeMint(address to) public payable {
        
        ResponseWithExpenses memory response_xag = _invokeOracle(oracle, dataProvider, MARKET_XAG);
        ResponseWithExpenses memory response_pol = _invokeOracle(oracle, dataProvider, MARKET_POL);
        require(msg.value >= ((response_pol.expenses + response_xag.expenses)) + (response_xag.value * 1e18) / response_pol.value, "Not enough value to pay for XAG plus Oracle Data!");

        uint remainder = uint(msg.value - (((response_pol.expenses + response_xag.expenses)) + (response_xag.value * 1e18) / response_pol.value));
        
        payable(msg.sender).transfer(remainder);

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        tokenPriceInUsd[tokenId] = response_xag.value;

        //for demonstration purposes, send whatever is in this contract back too
        payable(msg.sender).transfer(address(this).balance);
        
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
         return string.concat(
                "data:application/json;utf8,", 
                '{"name":"Morpher Oracle SilverToken", "description":"Demo to mind one Ounce of Silver at current Prices", "attributes":[{"trait_type": "Purchase Price","value": ',Strings.toString(tokenPriceInUsd[tokenId]),'}], "image":"data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIiAvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9InNpbHZlciIgc3Ryb2tlPSIjYjBiMGIwIiBzdHJva2Utd2lkdGg9IjEwIiAvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpIiBzdHJva2Utd2lkdGg9IjUiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiMGIwYjAiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZHk9Ii4zNWVtIj5BZzwvdGV4dD4KPC9zdmc+Cg==", "external_url":"https://oracle.morpher.com"}'); 
    }

     function requirements(bytes4 _selector) external view override returns (DataRequirement[] memory) {
        //each function that needs data needs to be specified here. 
        if (_selector == bytes4(keccak256("safeMint(address)"))) {
            DataRequirement[] memory requirement = new DataRequirement[](2);
            requirement[0] = DataRequirement(dataProvider, address(this), MARKET_XAG);
            requirement[1] = DataRequirement(dataProvider, address(this), MARKET_POL);
            return requirement;
        }
        return new DataRequirement[](0);
    }


}
