# ERC721 Standard Tests

This ERC721 test suite is derived from the tests provided in the OpenZeppelin base
contracts repository. It's meant to test the core functionality of the ERC721
standard common to all ERC721 contracts.

Tests are not included in the imported contracts package, so these are manually copied and pasted here. In addition, the tests provided by OpenZeppelin have been adjusted slightly to work with the Hashtag
Protocol use case.

To run call `hardhat test test/ERC721/ERC721.test.js` from within the
`hashtag-contracts` directory.

The original tests can be found here:

<https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/tree/master/test/token/ERC721>
