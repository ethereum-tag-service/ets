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
import type { NonPayableOverrides } from "../../../common";
import type {
  ETSRelayerV2test,
  ETSRelayerV2testInterface,
} from "../../../contracts/test/ETSRelayerV2test";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "relayerAddress",
        type: "address",
      },
    ],
    name: "RelayerOwnerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "relayerAddress",
        type: "address",
      },
    ],
    name: "RelayerPauseToggledByOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "IID_IETSRELAYER",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
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
    name: "VERSION",
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
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tagStrings",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
        ],
        internalType: "struct IETS.TaggingRecordRawInput[]",
        name: "_rawInput",
        type: "tuple[]",
      },
    ],
    name: "applyTags",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tagStrings",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
        ],
        internalType: "struct IETS.TaggingRecordRawInput",
        name: "_rawInput",
        type: "tuple",
      },
      {
        internalType: "enum IETS.TaggingAction",
        name: "_action",
        type: "uint8",
      },
    ],
    name: "computeTaggingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tagCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "creator",
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
    inputs: [],
    name: "ets",
    outputs: [
      {
        internalType: "contract IETS",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "etsTarget",
    outputs: [
      {
        internalType: "contract IETSTarget",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "etsToken",
    outputs: [
      {
        internalType: "contract IETSToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCreator",
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
        internalType: "string[]",
        name: "_tags",
        type: "string[]",
      },
    ],
    name: "getOrCreateTagIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "_tagIds",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
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
    inputs: [],
    name: "getRelayerName",
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
        internalType: "string",
        name: "_relayerName",
        type: "string",
      },
      {
        internalType: "contract IETS",
        name: "_ets",
        type: "address",
      },
      {
        internalType: "contract IETSToken",
        name: "_etsToken",
        type: "address",
      },
      {
        internalType: "contract IETSTarget",
        name: "_etsTarget",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "_owner",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isPaused",
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
    inputs: [],
    name: "newFunction",
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
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    inputs: [],
    name: "relayerName",
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
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tagStrings",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
        ],
        internalType: "struct IETS.TaggingRecordRawInput[]",
        name: "_rawInput",
        type: "tuple[]",
      },
    ],
    name: "removeTags",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "tagStrings",
            type: "string[]",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
        ],
        internalType: "struct IETS.TaggingRecordRawInput[]",
        name: "_rawInput",
        type: "tuple[]",
      },
    ],
    name: "replaceTags",
    outputs: [],
    stateMutability: "payable",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001961001e565b6100dd565b600054610100900460ff161561008a5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100db576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b611c19806100ec6000396000f3fe6080604052600436106101b75760003560e01c8063613facdd116100ec578063a3f4df7e1161008a578063e12bcd6811610064578063e12bcd68146104c1578063f2fde38b146104d6578063f8c8ef09146104f6578063ffa1ad741461052b57600080fd5b8063a3f4df7e14610443578063a6f9dae11461048c578063b187bd26146104ac57600080fd5b80638182e707116100c65780638182e707146103db5780638456cb59146103fb578063893d20e8146104105780638da5cb5b1461042557600080fd5b8063613facdd1461037d578063715018a614610392578063743b7b1f146103a757600080fd5b80633f4ba83a1161015957806354fd4d501161013357806354fd4d50146102eb57806356c63489146103255780635c975abb146103455780635edab3ed1461035d57600080fd5b80633f4ba83a146102a357806342a7bfa5146102b857806346ca0f4d146102cb57600080fd5b80630f9becab116101955780630f9becab146102475780631002bc831461025c57806315ccda221461026f5780631b28d63e1461028f57600080fd5b806301ffc9a7146101bc57806302d05d3f146101f15780630ee2cb1014610229575b600080fd5b3480156101c857600080fd5b506101dc6101d73660046115a9565b61055f565b60405190151581526020015b60405180910390f35b3480156101fd57600080fd5b5060fe54610211906001600160a01b031681565b6040516001600160a01b0390911681526020016101e8565b34801561023557600080fd5b5060fe546001600160a01b0316610211565b61025a61025536600461161f565b6105af565b005b61025a61026a36600461161f565b610676565b34801561027b57600080fd5b5060fb54610211906001600160a01b031681565b34801561029b57600080fd5b5060016101dc565b3480156102af57600080fd5b5061025a6106cb565b61025a6102c636600461161f565b610711565b3480156102d757600080fd5b5060fc54610211906001600160a01b031681565b3480156102f757600080fd5b50604080518082019091526008815267302e322d4265746160c01b60208201525b6040516101e89190611661565b34801561033157600080fd5b5060fd54610211906001600160a01b031681565b34801561035157600080fd5b5060975460ff166101dc565b61037061036b36600461161f565b6107d2565b6040516101e891906116b6565b34801561038957600080fd5b506103186108fa565b34801561039e57600080fd5b5061025a61098c565b3480156103b357600080fd5b506103c263b050394f60e01b81565b6040516001600160e01b031990911681526020016101e8565b3480156103e757600080fd5b5061025a6103f6366004611735565b6109a0565b34801561040757600080fd5b5061025a610b4f565b34801561041c57600080fd5b50610211610b5f565b34801561043157600080fd5b506065546001600160a01b0316610211565b34801561044f57600080fd5b506103186040518060400160405280600b81526020017f4554532052656c6179657200000000000000000000000000000000000000000081525081565b34801561049857600080fd5b5061025a6104a7366004611838565b610b78565b3480156104b857600080fd5b506101dc610bbf565b3480156104cd57600080fd5b50610318610bcd565b3480156104e257600080fd5b5061025a6104f1366004611838565b610c5b565b34801561050257600080fd5b50610516610511366004611855565b610ceb565b604080519283526020830191909152016101e8565b34801561053757600080fd5b5061031860405180604001604052806008815260200167302e322d4265746160c01b81525081565b60006001600160e01b0319821663b050394f60e01b14806105a957507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b92915050565b6105b7610d72565b60fb546040805163fe52656f60e01b815290516000926001600160a01b03169163fe52656f9160048083019260209291908290030181865afa158015610601573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062591906118b0565b905060005b8281101561067057610660848483818110610647576106476118c9565b905060200281019061065991906118df565b3384610dc5565b610669816118ff565b905061062a565b50505050565b61067e610d72565b60005b818110156106c6576106b683838381811061069e5761069e6118c9565b90506020028101906106b091906118df565b33610f21565b6106bf816118ff565b9050610681565b505050565b6106d3610fa2565b6106db610ffc565b6040513081527fa3705e5a8cf0800dce2d7a76b8737622cbd3b3e9682c53da9eeccd99ad809373906020015b60405180910390a1565b610719610d72565b60fb546040805163fe52656f60e01b815290516000926001600160a01b03169163fe52656f9160048083019260209291908290030181865afa158015610763573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061078791906118b0565b905060005b82811015610670576107c28484838181106107a9576107a96118c9565b90506020028101906107bb91906118df565b3384611049565b6107cb816118ff565b905061078c565b60606107dc610d72565b60008267ffffffffffffffff8111156107f7576107f76116fa565b604051908082528060200260200182016040528015610820578160200160208202803683370190505b50905060005b838110156108f25760fb546001600160a01b031663a27eee3c868684818110610851576108516118c9565b90506020028101906108639190611928565b336040518463ffffffff1660e01b815260040161088293929190611998565b6020604051808303816000875af11580156108a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c591906118b0565b8282815181106108d7576108d76118c9565b60209081029190910101526108eb816118ff565b9050610826565b509392505050565b606060ff8054610909906119c5565b80601f0160208091040260200160405190810160405280929190818152602001828054610935906119c5565b80156109825780601f1061095757610100808354040283529160200191610982565b820191906000526020600020905b81548152906001019060200180831161096557829003601f168201915b5050505050905090565b610994610fa2565b61099e600061116c565b565b600054610100900460ff16158080156109c05750600054600160ff909116105b806109da5750303b1580156109da575060005460ff166001145b610a515760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084015b60405180910390fd5b6000805460ff191660011790558015610a74576000805461ff0019166101001790555b610a7c6111cb565b610a8461123e565b610a8c6112b1565b8651610a9f9060ff9060208a0190611510565b5060fb80546001600160a01b0380891673ffffffffffffffffffffffffffffffffffffffff199283161790925560fc805488841690831617905560fd805487841690831617905560fe805492861692909116919091179055610b0082610c5b565b8015610b46576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050505050565b610b57610fa2565b6106db611324565b6000610b736065546001600160a01b031690565b905090565b610b80611361565b610b8981610c5b565b6040513081527f1896d39287b56639e55216c3dd2e10fe8adaab5264319ac3cc7020668ac6f1699060200160405180910390a150565b6000610b7360975460ff1690565b60ff8054610bda906119c5565b80601f0160208091040260200160405190810160405280929190818152602001828054610c06906119c5565b8015610c535780601f10610c2857610100808354040283529160200191610c53565b820191906000526020600020905b815481529060010190602001808311610c3657829003601f168201915b505050505081565b610c63610fa2565b6001600160a01b038116610cdf5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610a48565b610ce88161116c565b50565b60fb54604051630927cfbb60e21b815260009182916001600160a01b039091169063249f3eec90610d26908790309033908990600401611b52565b6040805180830381865afa158015610d42573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d669190611b94565b915091505b9250929050565b60975460ff161561099e5760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a20706175736564000000000000000000000000000000006044820152606401610a48565b60008115610e9c5760fb54604051630927cfbb60e21b81526000916001600160a01b03169063249f3eec90610e0590889030908990600190600401611b52565b6040805180830381865afa158015610e21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e459190611b94565b909250905047821115610e9a5760405162461bcd60e51b815260206004820152601260248201527f496e73756666696369656e742066756e647300000000000000000000000000006044820152606401610a48565b505b60fb546040517f70a306f70000000000000000000000000000000000000000000000000000000081526001600160a01b03909116906370a306f7908390610ee99088908890600401611bb8565b6000604051808303818588803b158015610f0257600080fd5b505af1158015610f16573d6000803e3d6000fd5b505050505050505050565b60fb546040517f7e2babd00000000000000000000000000000000000000000000000000000000081526001600160a01b0390911690637e2babd090610f6c9085908590600401611bb8565b600060405180830381600087803b158015610f8657600080fd5b505af1158015610f9a573d6000803e3d6000fd5b505050505050565b6065546001600160a01b0316331461099e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610a48565b611004611361565b6097805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b039091168152602001610707565b6000811561111f5760fb54604051630927cfbb60e21b81526000916001600160a01b03169063249f3eec90611088908890309089908790600401611b52565b6040805180830381865afa1580156110a4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110c89190611b94565b90925090504782111561111d5760405162461bcd60e51b815260206004820152601260248201527f496e73756666696369656e742066756e647300000000000000000000000000006044820152606401610a48565b505b60fb546040517f01f1e2d80000000000000000000000000000000000000000000000000000000081526001600160a01b03909116906301f1e2d8908390610ee99088908890600401611bb8565b606580546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166112365760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b61099e6113b3565b600054610100900460ff166112a95760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b61099e61142a565b600054610100900460ff1661131c5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b61099e61149e565b61132c610d72565b6097805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586110313390565b60975460ff1661099e5760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f74207061757365640000000000000000000000006044820152606401610a48565b600054610100900460ff1661141e5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b6097805460ff19169055565b600054610100900460ff166114955760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b61099e3361116c565b600054610100900460ff166115095760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610a48565b600160c955565b82805461151c906119c5565b90600052602060002090601f01602090048101928261153e5760008555611584565b82601f1061155757805160ff1916838001178555611584565b82800160010185558215611584579182015b82811115611584578251825591602001919060010190611569565b50611590929150611594565b5090565b5b808211156115905760008155600101611595565b6000602082840312156115bb57600080fd5b81356001600160e01b0319811681146115d357600080fd5b9392505050565b60008083601f8401126115ec57600080fd5b50813567ffffffffffffffff81111561160457600080fd5b6020830191508360208260051b8501011115610d6b57600080fd5b6000806020838503121561163257600080fd5b823567ffffffffffffffff81111561164957600080fd5b611655858286016115da565b90969095509350505050565b600060208083528351808285015260005b8181101561168e57858101830151858201604001528201611672565b818111156116a0576000604083870101525b50601f01601f1916929092016040019392505050565b6020808252825182820181905260009190848201906040850190845b818110156116ee578351835292840192918401916001016116d2565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114610ce857600080fd5b803561173081611710565b919050565b60008060008060008060c0878903121561174e57600080fd5b863567ffffffffffffffff8082111561176657600080fd5b818901915089601f83011261177a57600080fd5b81358181111561178c5761178c6116fa565b604051601f8201601f19908116603f011681019083821181831017156117b4576117b46116fa565b816040528281528c60208487010111156117cd57600080fd5b82602086016020830137600060208483010152809a5050505050506117f460208801611725565b945061180260408801611725565b935061181060608801611725565b925061181e60808801611725565b915061182c60a08801611725565b90509295509295509295565b60006020828403121561184a57600080fd5b81356115d381611710565b6000806040838503121561186857600080fd5b823567ffffffffffffffff81111561187f57600080fd5b83016060818603121561189157600080fd5b91506020830135600381106118a557600080fd5b809150509250929050565b6000602082840312156118c257600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b60008235605e198336030181126118f557600080fd5b9190910192915050565b600060001982141561192157634e487b7160e01b600052601160045260246000fd5b5060010190565b6000808335601e1984360301811261193f57600080fd5b83018035915067ffffffffffffffff82111561195a57600080fd5b602001915036819003821315610d6b57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6040815260006119ac60408301858761196f565b90506001600160a01b0383166020830152949350505050565b600181811c908216806119d957607f821691505b602082108114156119fa57634e487b7160e01b600052602260045260246000fd5b50919050565b6000808335601e19843603018112611a1757600080fd5b830160208101925035905067ffffffffffffffff811115611a3757600080fd5b803603831315610d6b57600080fd5b6000611a528283611a00565b60608552611a6460608601828461196f565b915050602080840135601e19853603018112611a7f57600080fd5b8401818101903567ffffffffffffffff811115611a9b57600080fd5b8060051b803603871315611aae57600080fd5b87850384890152818552840183018385018360005b84811015611afd57878403601f19018352611ade8287611a00565b611ae986828461196f565b955050509186019190860190600101611ac3565b505050611b0d6040880188611a00565b955093508781036040890152611b2481868661196f565b98975050505050505050565b60038110611b4e57634e487b7160e01b600052602160045260246000fd5b9052565b608081526000611b656080830187611a46565b6001600160a01b038681166020850152851660408401529050611b8b6060830184611b30565b95945050505050565b60008060408385031215611ba757600080fd5b505080516020909101519092909150565b604081526000611bcb6040830185611a46565b90506001600160a01b0383166020830152939250505056fea2646970667358221220e16b6ddeb25e2dc805ce880e8139cff506cf93f901e231dfc24a46bb531c281664736f6c634300080c0033";

type ETSRelayerV2testConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ETSRelayerV2testConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ETSRelayerV2test__factory extends ContractFactory {
  constructor(...args: ETSRelayerV2testConstructorParams) {
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
      ETSRelayerV2test & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ETSRelayerV2test__factory {
    return super.connect(runner) as ETSRelayerV2test__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETSRelayerV2testInterface {
    return new Interface(_abi) as ETSRelayerV2testInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ETSRelayerV2test {
    return new Contract(address, _abi, runner) as unknown as ETSRelayerV2test;
  }
}