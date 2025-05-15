# Smart Contracts for Precious Metals Oracle Integration

This repository contains the smart contracts powering a decentralized precious metals pricing and NFT system, built with Foundry and integrated with the Morpher Oracle.

## Overview

The smart contracts implement:
- ERC721 tokens representing precious metals
- Oracle price feed integration
- Data-dependent transaction execution
- Account abstraction (ERC4337) compatibility

## Development Stack

### Foundry Toolkit

Foundry is our core development framework, chosen for its speed and reliability in Ethereum development:

- **Forge**: Lightning-fast testing framework
- **Cast**: Command-line interface for contract interaction
- **Anvil**: Local development network
- **Chisel**: Interactive Solidity REPL

### Key Technologies

- Solidity ^0.8.19
- ERC4337 Account Abstraction
- ERC721 Token Standard
- Morpher Oracle Integration

## Quick Start

```shell
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Build contracts
forge build

# Run tests
forge test

# Deploy
forge script script/DeployCoins.s.sol --rpc-url <your_rpc_url> --private-key <your_private_key>
```

## Contract Architecture

- `PreciousMetals.sol`: Main token contracts
- `OracleIntegration.sol`: Price feed implementation
- `DeployCoins.s.sol`: Deployment scripts

## Testing & Development

### Local Development
```shell
# Start local node
anvil

# Run tests with gas reporting
forge test --gas-report
```
## Resources & Documentation

- [Foundry Book](https://book.getfoundry.sh/)
- [ERC4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [Morpher Oracle Docs](https://oracle.morpher.com)

## Security

- All contracts are thoroughly tested
- Gas optimization implemented
- Oracle data verification
- Standard security patterns followed

## Contributing

Contributions welcome! Please check our contributing guidelines.

## License

MIT License - see LICENSE file for details
