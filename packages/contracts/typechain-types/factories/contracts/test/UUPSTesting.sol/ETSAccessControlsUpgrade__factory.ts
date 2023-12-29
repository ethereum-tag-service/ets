/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  ETSAccessControlsUpgrade,
  ETSAccessControlsUpgradeInterface,
} from "../../../../contracts/test/UUPSTesting.sol/ETSAccessControlsUpgrade";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "prevAddress",
        type: "address",
      },
    ],
    name: "PlatformSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "relayer",
        type: "address",
      },
    ],
    name: "RelayerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "relayer",
        type: "address",
      },
    ],
    name: "RelayerLockToggled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "AUCTION_ORACLE_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RELAYER_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RELAYER_FACTORY_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RELAYER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SMART_CONTRACT_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_currentOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "changeRelayerOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformAddress",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "getRelayerAddressFromName",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getRelayerAddressFromOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "getRelayerNameFromAddress",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_platformAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isAuctionOracle",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerAndNotPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerByAddress",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "isRelayerByName",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerByOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerFactory",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isRelayerLocked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "isSmartContract",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_relayerOwner",
        type: "address",
      },
    ],
    name: "pauseRelayerByOwnerAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_relayer",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "registerRelayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "relayerContractToName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "relayerLocked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "relayerNameToContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "relayerOwnerToAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_platform",
        type: "address",
      },
    ],
    name: "setPlatform",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_role",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_adminRole",
        type: "bytes32",
      },
    ],
    name: "setRoleAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_relayer",
        type: "address",
      },
    ],
    name: "toggleRelayerLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "upgradeTest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a0604052306080523480156200001557600080fd5b506200002062000026565b620000e7565b600054610100900460ff1615620000935760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811614620000e5576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b6080516128d86200011f60003960008181610e7b01528181610f0001528181610ff70152818161107c01526111fc01526128d86000f3fe6080604052600436106102dc5760003560e01c80636945c5ea11610184578063a3f4df7e116100d6578063c4d66de81161008a578063dd37dc2211610064578063dd37dc2214610924578063df3b558014610958578063f968b8771461099157600080fd5b8063c4d66de8146108b0578063c8d8311d146108d0578063d547741f1461090457600080fd5b8063a8e2f235116100bb578063a8e2f2351461080d578063ac9f40a514610846578063bf2a22411461087c57600080fd5b8063a3f4df7e146107a4578063a710f73e146107ed57600080fd5b806391d1485411610138578063985dcdac11610112578063985dcdac1461074f578063a10138e81461076f578063a217fddf1461078f57600080fd5b806391d14854146106a5578063926d7d7f146106eb578063942da8f01461071f57600080fd5b8063857d260811610169578063857d2608146106165780638776887a1461064a5780638e0ed37c1461068557600080fd5b80636945c5ea146105d65780636ab04a93146105f657600080fd5b8063347308b21161023d5780633d20b15c116101f157806352d1902d116101cb57806352d1902d14610581578063541d55481461059657806358594dc4146105b657600080fd5b80633d20b15c1461052d5780634f1ef286146105415780635235075c1461055457600080fd5b806336568abe1161022257806336568abe146104cf5780633659cfe6146104ef5780633c0c45661461050f57600080fd5b8063347308b21461048f5780633498e6ab146104af57600080fd5b8063248a9ca311610294578063277c3f4011610279578063277c3f401461042f5780632b70420b1461044f5780632f2ff15d1461046f57600080fd5b8063248a9ca3146103d157806324d7806c1461040f57600080fd5b80631a943187116102c55780631a943187146103365780631e4e00911461038f57806321c82406146103b157600080fd5b806301b96189146102e157806301ffc9a714610316575b600080fd5b3480156102ed57600080fd5b506103016102fc3660046122fd565b6109b1565b60405190151581526020015b60405180910390f35b34801561032257600080fd5b5061030161033136600461231a565b610a52565b34801561034257600080fd5b506103776103513660046123e8565b805160208183018101805160fd825292820191909301209152546001600160a01b031681565b6040516001600160a01b03909116815260200161030d565b34801561039b57600080fd5b506103af6103aa366004612431565b610ae9565b005b3480156103bd57600080fd5b506103af6103cc3660046122fd565b610b03565b3480156103dd57600080fd5b506104016103ec366004612453565b60009081526065602052604090206001015490565b60405190815260200161030d565b34801561041b57600080fd5b5061030161042a3660046122fd565b610b8e565b34801561043b57600080fd5b5061030161044a3660046123e8565b610bce565b34801561045b57600080fd5b506103af61046a36600461246c565b610c0b565b34801561047b57600080fd5b506103af61048a366004612504565b610d3a565b34801561049b57600080fd5b506103016104aa3660046122fd565b610d5f565b3480156104bb57600080fd5b506103016104ca3660046122fd565b610d9f565b3480156104db57600080fd5b506103af6104ea366004612504565b610ddf565b3480156104fb57600080fd5b506103af61050a3660046122fd565b610e70565b34801561051b57600080fd5b5060fb546001600160a01b0316610377565b34801561053957600080fd5b506001610301565b6103af61054f366004612534565b610fec565b34801561056057600080fd5b5061057461056f3660046122fd565b611155565b60405161030d91906125c4565b34801561058d57600080fd5b506104016111ef565b3480156105a257600080fd5b506103016105b13660046122fd565b6112b4565b3480156105c257600080fd5b506103016105d13660046122fd565b6112fe565b3480156105e257600080fd5b506103af6105f13660046122fd565b61133e565b34801561060257600080fd5b506103016106113660046122fd565b6113bb565b34801561062257600080fd5b506104017f9d49f397ae9ef1a834b569acb967799a367061e305932181a44f5773da873bfd81565b34801561065657600080fd5b506103016106653660046122fd565b6001600160a01b03908116600090815260ff602052604090205416151590565b34801561069157600080fd5b506103af6106a03660046125f7565b611412565b3480156106b157600080fd5b506103016106c0366004612504565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b3480156106f757600080fd5b506104017fe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc481565b34801561072b57600080fd5b5061030161073a3660046122fd565b60fc6020526000908152604090205460ff1681565b34801561075b57600080fd5b5061057461076a3660046122fd565b6115fc565b34801561077b57600080fd5b506103af61078a3660046122fd565b6116a8565b34801561079b57600080fd5b50610401600081565b3480156107b057600080fd5b506105746040518060400160405280601381526020017f4554532061636365737320636f6e74726f6c730000000000000000000000000081525081565b3480156107f957600080fd5b506103776108083660046123e8565b6117cf565b34801561081957600080fd5b506103016108283660046122fd565b6001600160a01b0316600090815260fc602052604090205460ff1690565b34801561085257600080fd5b506103776108613660046122fd565b60ff602052600090815260409020546001600160a01b031681565b34801561088857600080fd5b506104017f619071fe1792701f31c1707f419d418b505e01c7642551568874b32ede501d7481565b3480156108bc57600080fd5b506103af6108cb3660046122fd565b611800565b3480156108dc57600080fd5b506104017f2cbe5b3d4b4f5f80bc7c9aec91d5a1a298a641fa1affcd6a45a69ca24162cd4a81565b34801561091057600080fd5b506103af61091f366004612504565b61192d565b34801561093057600080fd5b506104017fc08ea83d6e841581b661c1aa701959924c664fd108ef1527375a9e577ac521b081565b34801561096457600080fd5b506103776109733660046122fd565b6001600160a01b03908116600090815260ff60205260409020541690565b34801561099d57600080fd5b506103016109ac3660046122fd565b611952565b60006109bc826113bb565b80156109e157506001600160a01b038216600090815260fc602052604090205460ff16155b8015610a4c5750816001600160a01b031663b187bd266040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4a9190612625565b155b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b000000000000000000000000000000000000000000000000000000001480610a4c57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff00000000000000000000000000000000000000000000000000000000831614610a4c565b6000610af4816119d3565b610afe83836119dd565b505050565b7f619071fe1792701f31c1707f419d418b505e01c7642551568874b32ede501d74610b2d816119d3565b6001600160a01b038216600081815260fc6020908152604091829020805460ff81161560ff1990911617905590519182527fd7583b62f34b665d4b94bca179b3d822171f6c2de14f9c4d65841621d0ead59091015b60405180910390a15050565b6001600160a01b03811660009081527fffdfc1249c027f9191656349feb0761381bb32c9f557e01f419fd08754bf5a1b602052604081205460ff16610a4c565b6000806001600160a01b031660fd83604051610bea9190612647565b908152604051908190036020019020546001600160a01b0316141592915050565b7fc08ea83d6e841581b661c1aa701959924c664fd108ef1527375a9e577ac521b0610c35816119d3565b8460fd8585604051610c48929190612663565b908152604080516020928190038301902080546001600160a01b0319166001600160a01b03948516179055918716600090815260fe90915220610c8c90858561224f565b506001600160a01b03828116600090815260ff6020908152604080832080546001600160a01b031916948a16948517905592825260fc905220805460ff19169055610cf77fe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc486610d3a565b6040516001600160a01b03861681527f03580ee9f53a62b7cb409a2cb56f9be87747dd15017afc5cef6eef321e4fb2c59060200160405180910390a15050505050565b600082815260656020526040902060010154610d55816119d3565b610afe8383611a28565b6001600160a01b03811660009081527fa8a39816577859e51725a02b4f42e61c6db9d8a6707506489ff3a06ff39128ea602052604081205460ff16610a4c565b6001600160a01b03811660009081527f9b94ea8f6f9f9e6eb660315c7f1317a68dfb989750fa2840fcca4b2685162e24602052604081205460ff16610a4c565b6001600160a01b0381163314610e625760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c66000000000000000000000000000000000060648201526084015b60405180910390fd5b610e6c8282611aca565b5050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610efe5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b6064820152608401610e59565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610f597f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614610fc45760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b6064820152608401610e59565b610fcd81611b4d565b60408051600080825260208201909252610fe991839190611b58565b50565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561107a5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b6064820152608401610e59565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166110d57f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146111405760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b6064820152608401610e59565b61114982611b4d565b610e6c82826001611b58565b60fe602052600090815260409020805461116e90612673565b80601f016020809104026020016040519081016040528092919081815260200182805461119a90612673565b80156111e75780601f106111bc576101008083540402835291602001916111e7565b820191906000526020600020905b8154815290600101906020018083116111ca57829003601f168201915b505050505081565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461128f5760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610e59565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b6001600160a01b03811660009081527f9b94ea8f6f9f9e6eb660315c7f1317a68dfb989750fa2840fcca4b2685162e24602052604081205460ff1680610a4c5750610a4c826109b1565b6001600160a01b03811660009081527f7c35304d3265d21fc1bcb98392cbfb6b530bbdf20000aed21f3d19f9a32ed2ba602052604081205460ff16610a4c565b6000611349816119d3565b60fb80546001600160a01b038481166001600160a01b031983161790925516611373600084610d3a565b604080516001600160a01b038086168252831660208201527f0e8ce4b57fd24de168e9c8d76109cb59a7852e78b3575da1ba2077dd53d330ec910160405180910390a1505050565b6040805160008082526020808301808552835190206001600160a01b038616835260fe909152838220919390926113f39291016126ae565b6040516020818303038152906040528051906020012014159050919050565b7fe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc461143c816119d3565b611445336113bb565b6114915760405162461bcd60e51b815260206004820152601560248201527f43616c6c6572206973206e6f742072656c6179657200000000000000000000006044820152606401610e59565b6001600160a01b038316336001600160a01b031663893d20e86040518163ffffffff1660e01b8152600401602060405180830381865afa1580156114d9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114fd919061274a565b6001600160a01b0316146115535760405162461bcd60e51b815260206004820152601160248201527f4e6f742072656c61796572206f776e65720000000000000000000000000000006044820152606401610e59565b6001600160a01b03808316600090815260ff602052604090205416156115bb5760405162461bcd60e51b815260206004820181905260248201527f4e6577206f776e657220616c7265616479206f776e7320612072656c617965726044820152606401610e59565b506001600160a01b03918216600090815260ff602052604080822080546001600160a01b031990811690915592909316815291909120805490911633179055565b6001600160a01b038116600090815260fe6020526040902080546060919061162390612673565b80601f016020809104026020016040519081016040528092919081815260200182805461164f90612673565b801561169c5780601f106116715761010080835404028352916020019161169c565b820191906000526020600020905b81548152906001019060200180831161167f57829003601f168201915b50505050509050919050565b7f619071fe1792701f31c1707f419d418b505e01c7642551568874b32ede501d746116d2816119d3565b6001600160a01b03808316600090815260ff60205260409020541615610e6c576001600160a01b03808316600090815260ff60205260408120549091169050806001600160a01b031663b187bd266040518163ffffffff1660e01b8152600401602060405180830381865afa15801561174f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117739190612625565b610afe57806001600160a01b0316638456cb596040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156117b257600080fd5b505af11580156117c6573d6000803e3d6000fd5b50505050505050565b600060fd826040516117e19190612647565b908152604051908190036020019020546001600160a01b031692915050565b600054610100900460ff16158080156118205750600054600160ff909116105b8061183a5750303b15801561183a575060005460ff166001145b6118ac5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152608401610e59565b6000805460ff1916600117905580156118cf576000805461ff0019166101001790555b6118d7611cf8565b6118e2600033611a28565b6118eb8261133e565b8015610e6c576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602001610b82565b600082815260656020526040902060010154611948816119d3565b610afe8383611aca565b6001600160a01b03811660009081527f9b94ea8f6f9f9e6eb660315c7f1317a68dfb989750fa2840fcca4b2685162e24602052604081205460ff1680610a4c57506001600160a01b03821660009081527f9bc9734c87cad716c86f45e418af08967498fe7cc94a515dbe81525dee2c1f5f602052604090205460ff16610a4c565b610fe98133611d77565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff16610e6c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055611a863390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff1615610e6c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610e6c816119d3565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615611b8b57610afe83611dec565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015611be5575060408051601f3d908101601f19168201909252611be291810190612767565b60015b611c575760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201527f6f6e206973206e6f7420555550530000000000000000000000000000000000006064820152608401610e59565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc8114611cec5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f7860448201527f6961626c655555494400000000000000000000000000000000000000000000006064820152608401610e59565b50610afe838383611eaa565b600054610100900460ff16611d755760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152608401610e59565b565b60008281526065602090815260408083206001600160a01b038516845290915290205460ff16610e6c57611daa81611ed5565b611db5836020611ee7565b604051602001611dc6929190612780565b60408051601f198184030181529082905262461bcd60e51b8252610e59916004016125c4565b6001600160a01b0381163b611e695760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201527f6f74206120636f6e7472616374000000000000000000000000000000000000006064820152608401610e59565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b611eb3836120cf565b600082511180611ec05750805b15610afe57611ecf838361210f565b50505050565b6060610a4c6001600160a01b03831660145b60606000611ef6836002612817565b611f01906002612836565b67ffffffffffffffff811115611f1957611f1961235c565b6040519080825280601f01601f191660200182016040528015611f43576020820181803683370190505b5090507f300000000000000000000000000000000000000000000000000000000000000081600081518110611f7a57611f7a61284e565b60200101906001600160f81b031916908160001a9053507f780000000000000000000000000000000000000000000000000000000000000081600181518110611fc557611fc561284e565b60200101906001600160f81b031916908160001a9053506000611fe9846002612817565b611ff4906001612836565b90505b6001811115612079577f303132333435363738396162636465660000000000000000000000000000000085600f16601081106120355761203561284e565b1a60f81b82828151811061204b5761204b61284e565b60200101906001600160f81b031916908160001a90535060049490941c9361207281612864565b9050611ff7565b5083156120c85760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610e59565b9392505050565b6120d881611dec565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606120c8838360405180606001604052806027815260200161287c602791396060600080856001600160a01b03168560405161214c9190612647565b600060405180830381855af49150503d8060008114612187576040519150601f19603f3d011682016040523d82523d6000602084013e61218c565b606091505b509150915061219d868383876121a7565b9695505050505050565b6060831561221357825161220c576001600160a01b0385163b61220c5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610e59565b508161221d565b61221d8383612225565b949350505050565b8151156122355781518083602001fd5b8060405162461bcd60e51b8152600401610e5991906125c4565b82805461225b90612673565b90600052602060002090601f01602090048101928261227d57600085556122c3565b82601f106122965782800160ff198235161785556122c3565b828001600101855582156122c3579182015b828111156122c35782358255916020019190600101906122a8565b506122cf9291506122d3565b5090565b5b808211156122cf57600081556001016122d4565b6001600160a01b0381168114610fe957600080fd5b60006020828403121561230f57600080fd5b81356120c8816122e8565b60006020828403121561232c57600080fd5b81357fffffffff00000000000000000000000000000000000000000000000000000000811681146120c857600080fd5b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561238d5761238d61235c565b604051601f8501601f19908116603f011681019082821181831017156123b5576123b561235c565b816040528093508581528686860111156123ce57600080fd5b858560208301376000602087830101525050509392505050565b6000602082840312156123fa57600080fd5b813567ffffffffffffffff81111561241157600080fd5b8201601f8101841361242257600080fd5b61221d84823560208401612372565b6000806040838503121561244457600080fd5b50508035926020909101359150565b60006020828403121561246557600080fd5b5035919050565b6000806000806060858703121561248257600080fd5b843561248d816122e8565b9350602085013567ffffffffffffffff808211156124aa57600080fd5b818701915087601f8301126124be57600080fd5b8135818111156124cd57600080fd5b8860208285010111156124df57600080fd5b60208301955080945050505060408501356124f9816122e8565b939692955090935050565b6000806040838503121561251757600080fd5b823591506020830135612529816122e8565b809150509250929050565b6000806040838503121561254757600080fd5b8235612552816122e8565b9150602083013567ffffffffffffffff81111561256e57600080fd5b8301601f8101851361257f57600080fd5b61258e85823560208401612372565b9150509250929050565b60005b838110156125b357818101518382015260200161259b565b83811115611ecf5750506000910152565b60208152600082518060208401526125e3816040850160208701612598565b601f01601f19169190910160400192915050565b6000806040838503121561260a57600080fd5b8235612615816122e8565b91506020830135612529816122e8565b60006020828403121561263757600080fd5b815180151581146120c857600080fd5b60008251612659818460208701612598565b9190910192915050565b8183823760009101908152919050565b600181811c9082168061268757607f821691505b602082108114156126a857634e487b7160e01b600052602260045260246000fd5b50919050565b600080835481600182811c9150808316806126ca57607f831692505b60208084108214156126ea57634e487b7160e01b86526022600452602486fd5b8180156126fe576001811461270f5761273c565b60ff1986168952848901965061273c565b60008a81526020902060005b868110156127345781548b82015290850190830161271b565b505084890196505b509498975050505050505050565b60006020828403121561275c57600080fd5b81516120c8816122e8565b60006020828403121561277957600080fd5b5051919050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516127b8816017850160208801612598565b7f206973206d697373696e6720726f6c652000000000000000000000000000000060179184019182015283516127f5816028840160208801612598565b01602801949350505050565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561283157612831612801565b500290565b6000821982111561284957612849612801565b500190565b634e487b7160e01b600052603260045260246000fd5b60008161287357612873612801565b50600019019056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220fbaf0fab824d855b36b2aa87da63dc81cf74285c7e90d6dca1733420381db16b64736f6c634300080c0033";

type ETSAccessControlsUpgradeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ETSAccessControlsUpgradeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ETSAccessControlsUpgrade__factory extends ContractFactory {
  constructor(...args: ETSAccessControlsUpgradeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ETSAccessControlsUpgrade & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ETSAccessControlsUpgrade__factory {
    return super.connect(runner) as ETSAccessControlsUpgrade__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETSAccessControlsUpgradeInterface {
    return new Interface(_abi) as ETSAccessControlsUpgradeInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ETSAccessControlsUpgrade {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ETSAccessControlsUpgrade;
  }
}