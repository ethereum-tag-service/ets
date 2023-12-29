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
import type { NonPayableOverrides } from "../../common";
import type { ETSTarget, ETSTargetInterface } from "../../contracts/ETSTarget";

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
        internalType: "address",
        name: "etsAccessControls",
        type: "address",
      },
    ],
    name: "AccessControlsSet",
    type: "event",
  },
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
        internalType: "address",
        name: "etsEnrichTarget",
        type: "address",
      },
    ],
    name: "EnrichTargetSet",
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
        internalType: "uint256",
        name: "targetId",
        type: "uint256",
      },
    ],
    name: "TargetCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "targetId",
        type: "uint256",
      },
    ],
    name: "TargetUpdated",
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
    inputs: [
      {
        internalType: "string",
        name: "_targetURI",
        type: "string",
      },
    ],
    name: "computeTargetId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_targetURI",
        type: "string",
      },
    ],
    name: "createTarget",
    outputs: [
      {
        internalType: "uint256",
        name: "targetId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "etsAccessControls",
    outputs: [
      {
        internalType: "contract IETSAccessControls",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "etsEnrichTarget",
    outputs: [
      {
        internalType: "contract IETSEnrichTarget",
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
        name: "_targetURI",
        type: "string",
      },
    ],
    name: "getOrCreateTargetId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_targetId",
        type: "uint256",
      },
    ],
    name: "getTargetById",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "enriched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "httpStatus",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
        ],
        internalType: "struct IETSTarget.Target",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_targetURI",
        type: "string",
      },
    ],
    name: "getTargetByURI",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "targetURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "createdBy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "enriched",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "httpStatus",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
        ],
        internalType: "struct IETSTarget.Target",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_etsAccessControls",
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
        internalType: "contract IETSAccessControls",
        name: "_accessControls",
        type: "address",
      },
    ],
    name: "setAccessControls",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_etsEnrichTarget",
        type: "address",
      },
    ],
    name: "setEnrichTarget",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_targetId",
        type: "uint256",
      },
    ],
    name: "targetExistsById",
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
        name: "_targetURI",
        type: "string",
      },
    ],
    name: "targetExistsByURI",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "targets",
    outputs: [
      {
        internalType: "string",
        name: "targetURI",
        type: "string",
      },
      {
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "enriched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "httpStatus",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_targetId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_targetURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_enriched",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_httpStatus",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "updateTarget",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
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
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e1565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100df576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b608051611c8c610118600039600081816108a80152818161092d01528181610a2401528181610aa90152610b930152611c8c6000f3fe6080604052600436106101295760003560e01c8063794e75fc116100a5578063c4d66de811610074578063cd7c68e211610059578063cd7c68e214610391578063cf99c815146103b1578063f0496c86146103d157600080fd5b8063c4d66de814610351578063cd15832f1461037157600080fd5b8063794e75fc1461029b5780637ab3f1cd146102bb5780638299f9f9146102db578063a3f4df7e146102fb57600080fd5b806323c7e9f3116100fc5780633659cfe6116100e15780633659cfe6146102515780634f1ef2861461027357806352d1902d1461028657600080fd5b806323c7e9f3146101fd57806331bb0c691461023157600080fd5b80630a39ce021461012e5780630c48789c146101685780631b2d87c3146101985780631b8278e2146101c5575b600080fd5b34801561013a57600080fd5b5061014e610149366004611823565b6103f1565b60405161015f959493929190611894565b60405180910390f35b34801561017457600080fd5b5061018861018336600461196c565b61053e565b604051901515815260200161015f565b3480156101a457600080fd5b506101b86101b3366004611823565b610558565b60405161015f91906119b5565b3480156101d157600080fd5b506066546101e5906001600160a01b031681565b6040516001600160a01b03909116815260200161015f565b34801561020957600080fd5b5061022361021836600461196c565b805160209091012090565b60405190815260200161015f565b34801561023d57600080fd5b5061022361024c36600461196c565b610701565b34801561025d57600080fd5b5061027161026c366004611a33565b61089d565b005b610271610281366004611a50565b610a19565b34801561029257600080fd5b50610223610b86565b3480156102a757600080fd5b506101b86102b636600461196c565b610c4b565b3480156102c757600080fd5b506101886102d6366004611afd565b610c96565b3480156102e757600080fd5b506065546101e5906001600160a01b031681565b34801561030757600080fd5b506103446040518060400160405280600981526020017f455453546172676574000000000000000000000000000000000000000000000081525081565b60405161015f9190611b8a565b34801561035d57600080fd5b5061027161036c366004611a33565b610d69565b34801561037d57600080fd5b5061027161038c366004611a33565b610e9c565b34801561039d57600080fd5b506101886103ac366004611823565b6110a3565b3480156103bd57600080fd5b506102236103cc36600461196c565b6110d6565b3480156103dd57600080fd5b506102716103ec366004611a33565b611114565b60676020526000908152604090208054819061040c90611b9d565b80601f016020809104026020016040519081016040528092919081815260200182805461043890611b9d565b80156104855780601f1061045a57610100808354040283529160200191610485565b820191906000526020600020905b81548152906001019060200180831161046857829003601f168201915b50505060018401546002850154600386015460048701805496976001600160a01b0390941696929550909350906104bb90611b9d565b80601f01602080910402602001604051908101604052809291908181526020018280546104e790611b9d565b80156105345780601f1061050957610100808354040283529160200191610534565b820191906000526020600020905b81548152906001019060200180831161051757829003601f168201915b5050505050905085565b80516020820120600090610551816110a3565b9392505050565b6105936040518060a001604052806060815260200160006001600160a01b031681526020016000815260200160008152602001606081525090565b60008281526067602052604090819020815160a081019092528054829082906105bb90611b9d565b80601f01602080910402602001604051908101604052809291908181526020018280546105e790611b9d565b80156106345780601f1061060957610100808354040283529160200191610634565b820191906000526020600020905b81548152906001019060200180831161061757829003601f168201915b505050918352505060018201546001600160a01b03166020820152600282015460408201526003820154606082015260048201805460809092019161067890611b9d565b80601f01602080910402602001604051908101604052809291908181526020018280546106a490611b9d565b80156106f15780601f106106c6576101008083540402835291602001916106f1565b820191906000526020600020905b8154815290600101906020018083116106d457829003601f168201915b5050505050815250509050919050565b600061070c8261053e565b1561075e5760405162461bcd60e51b815260206004820152601060248201527f746172676574206964206578697374730000000000000000000000000000000060448201526064015b60405180910390fd5b60008251116107af5760405162461bcd60e51b815260206004820152600c60248201527f656d7074792074617267657400000000000000000000000000000000000000006044820152606401610755565b81516020808401919091206040805160a081018252858152338185015260008183018190526060820181905282518086018452818152608083015283815260678552919091208151805193949293919261080e92849290910190611716565b506020828101516001830180546001600160a01b0319166001600160a01b039092169190911790556040830151600283015560608301516003830155608083015180516108619260048501920190611716565b50506040518281527f503a6e6145f2d2a2a9b0845c2193aef653400c52f93b1c897bd55d36a396be7c915060200160405180910390a192915050565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016141561092b5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b6064820152608401610755565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166109867f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146109f15760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b6064820152608401610755565b6109fa81611260565b60408051600080825260208201909252610a1691839190611308565b50565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610aa75760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b6064820152608401610755565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610b027f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b031614610b6d5760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b6064820152608401610755565b610b7682611260565b610b8282826001611308565b5050565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610c265760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610755565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b610c866040518060a001604052806060815260200160006001600160a01b031681526020016000815260200160008152602001606081525090565b8151602083012061055181610558565b6066546000906001600160a01b03163314610ce35760405162461bcd60e51b815260206004820152600d60248201526c1058d8d95cdcc819195b9a5959609a1b6044820152606401610755565b6000888152606760205260409020610cfc90888861179a565b5060008881526067602052604090206002810186905560038101859055610d2790600401848461179a565b506040518881527f9d29e5045b411bb06d81d8ff11c828d9f1d7eb076eec9ca45eda49fc99f762b29060200160405180910390a1506001979650505050505050565b600054610100900460ff1615808015610d895750600054600160ff909116105b80610da35750303b158015610da3575060005460ff166001145b610e155760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152608401610755565b6000805460ff191660011790558015610e38576000805461ff0019166101001790555b606580546001600160a01b0319166001600160a01b0384161790558015610b82576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15050565b606554604051630935e01b60e21b81523360048201526001600160a01b03909116906324d7806c90602401602060405180830381865afa158015610ee4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f089190611bd8565b610f445760405162461bcd60e51b815260206004820152600d60248201526c1058d8d95cdcc819195b9a5959609a1b6044820152606401610755565b6001600160a01b038116610f9a5760405162461bcd60e51b815260206004820152601660248201527f416464726573732063616e6e6f74206265207a65726f000000000000000000006044820152606401610755565b604051630935e01b60e21b81523360048201526001600160a01b038216906324d7806c90602401602060405180830381865afa158015610fde573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110029190611bd8565b61104e5760405162461bcd60e51b815260206004820181905260248201527f43616c6c6572206e6f742061646d696e20696e206e657720636f6e74726163746044820152606401610755565b606580546001600160a01b0319166001600160a01b0383169081179091556040519081527f2f55f724ae3134584dfdd86a4ee1e090635ff9913722b5fe06e064cc7e3ed8b4906020015b60405180910390a150565b600081815260676020526040812080548291906110bf90611b9d565b9050116110cd5760006110d0565b60015b92915050565b8051602080830191909120600081815260679092526040822080548391906110fd90611b9d565b9050111561110b5792915050565b61055183610701565b606554604051630935e01b60e21b81523360048201526001600160a01b03909116906324d7806c90602401602060405180830381865afa15801561115c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111809190611bd8565b6111bc5760405162461bcd60e51b815260206004820152600d60248201526c1058d8d95cdcc819195b9a5959609a1b6044820152606401610755565b6001600160a01b0381166112125760405162461bcd60e51b815260206004820152600b60248201527f42616420616464726573730000000000000000000000000000000000000000006044820152606401610755565b606680546001600160a01b0319166001600160a01b0383169081179091556040519081527fe96313c1f3045cd25cc6a60c1f5b3511040581e2aa833e3e035e1cc5fb83667090602001611098565b606554604051630935e01b60e21b81523360048201526001600160a01b03909116906324d7806c90602401602060405180830381865afa1580156112a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112cc9190611bd8565b610a165760405162461bcd60e51b815260206004820152600d60248201526c1058d8d95cdcc819195b9a5959609a1b6044820152606401610755565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156113405761133b836114ad565b505050565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561139a575060408051601f3d908101601f1916820190925261139791810190611bfa565b60015b61140c5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201527f6f6e206973206e6f7420555550530000000000000000000000000000000000006064820152608401610755565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81146114a15760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f7860448201527f6961626c655555494400000000000000000000000000000000000000000000006064820152608401610755565b5061133b83838361156b565b6001600160a01b0381163b61152a5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201527f6f74206120636f6e7472616374000000000000000000000000000000000000006064820152608401610755565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b61157483611596565b6000825111806115815750805b1561133b5761159083836115d6565b50505050565b61159f816114ad565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606105518383604051806060016040528060278152602001611c30602791396060600080856001600160a01b0316856040516116139190611c13565b600060405180830381855af49150503d806000811461164e576040519150601f19603f3d011682016040523d82523d6000602084013e611653565b606091505b50915091506116648683838761166e565b9695505050505050565b606083156116da5782516116d3576001600160a01b0385163b6116d35760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610755565b50816116e4565b6116e483836116ec565b949350505050565b8151156116fc5781518083602001fd5b8060405162461bcd60e51b81526004016107559190611b8a565b82805461172290611b9d565b90600052602060002090601f016020900481019282611744576000855561178a565b82601f1061175d57805160ff191683800117855561178a565b8280016001018555821561178a579182015b8281111561178a57825182559160200191906001019061176f565b5061179692915061180e565b5090565b8280546117a690611b9d565b90600052602060002090601f0160209004810192826117c8576000855561178a565b82601f106117e15782800160ff1982351617855561178a565b8280016001018555821561178a579182015b8281111561178a5782358255916020019190600101906117f3565b5b80821115611796576000815560010161180f565b60006020828403121561183557600080fd5b5035919050565b60005b8381101561185757818101518382015260200161183f565b838111156115905750506000910152565b6000815180845261188081602086016020860161183c565b601f01601f19169290920160200192915050565b60a0815260006118a760a0830188611868565b6001600160a01b038716602084015285604084015284606084015282810360808401526118d48185611868565b98975050505050505050565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff80841115611911576119116118e0565b604051601f8501601f19908116603f01168101908282118183101715611939576119396118e0565b8160405280935085815286868601111561195257600080fd5b858560208301376000602087830101525050509392505050565b60006020828403121561197e57600080fd5b813567ffffffffffffffff81111561199557600080fd5b8201601f810184136119a657600080fd5b6116e4848235602084016118f6565b602081526000825160a060208401526119d160c0840182611868565b90506001600160a01b03602085015116604084015260408401516060840152606084015160808401526080840151601f198483030160a0850152611a158282611868565b95945050505050565b6001600160a01b0381168114610a1657600080fd5b600060208284031215611a4557600080fd5b813561055181611a1e565b60008060408385031215611a6357600080fd5b8235611a6e81611a1e565b9150602083013567ffffffffffffffff811115611a8a57600080fd5b8301601f81018513611a9b57600080fd5b611aaa858235602084016118f6565b9150509250929050565b60008083601f840112611ac657600080fd5b50813567ffffffffffffffff811115611ade57600080fd5b602083019150836020828501011115611af657600080fd5b9250929050565b600080600080600080600060a0888a031215611b1857600080fd5b87359650602088013567ffffffffffffffff80821115611b3757600080fd5b611b438b838c01611ab4565b909850965060408a0135955060608a0135945060808a0135915080821115611b6a57600080fd5b50611b778a828b01611ab4565b989b979a50959850939692959293505050565b6020815260006105516020830184611868565b600181811c90821680611bb157607f821691505b60208210811415611bd257634e487b7160e01b600052602260045260246000fd5b50919050565b600060208284031215611bea57600080fd5b8151801515811461055157600080fd5b600060208284031215611c0c57600080fd5b5051919050565b60008251611c2581846020870161183c565b919091019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220a9dd74ceaa6b1f496f20b09ea471bb013334028b9d2dcb1c6ebe8a20a41b3dfa64736f6c634300080c0033";

type ETSTargetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ETSTargetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ETSTarget__factory extends ContractFactory {
  constructor(...args: ETSTargetConstructorParams) {
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
      ETSTarget & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ETSTarget__factory {
    return super.connect(runner) as ETSTarget__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETSTargetInterface {
    return new Interface(_abi) as ETSTargetInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ETSTarget {
    return new Contract(address, _abi, runner) as unknown as ETSTarget;
  }
}