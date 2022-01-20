/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ETSAccessControlsUpgrade,
  ETSAccessControlsUpgradeInterface,
} from "../ETSAccessControlsUpgrade";

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
    name: "PUBLISHER_ROLE",
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
    inputs: [],
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
    name: "isPublisher",
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
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "postUpgrade",
    outputs: [],
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
  {
    inputs: [],
    name: "upgraded",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
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
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523060601b60805234801561001757600080fd5b5060805160601c61150e61004b60003960008181610583015281816105c30152818161067801526106b8015261150e6000f3fe60806040526004361061012a5760003560e01c806354fd4d50116100ab578063a3f4df7e1161006f578063a3f4df7e14610340578063b1441ce61461037f578063c28de2cd1461039f578063d547741f146103d3578063d8f4b6fd146103f3578063ffa1ad74146104275761012a565b806354fd4d501461028b5780638129fc1c146102c2578063857d2608146102d757806391d148541461030b578063a217fddf1461032b5761012a565b806336568abe116100f257806336568abe146102045780633659cfe6146102245780633d20b15c1461024457806341859ac8146102585780634f1ef286146102785761012a565b806301ffc9a71461012f578063248a9ca31461016457806324d7806c146101a25780632f2ff15d146101c2578063347308b2146101e4575b600080fd5b34801561013b57600080fd5b5061014f61014a36600461119a565b610458565b60405190151581526020015b60405180910390f35b34801561017057600080fd5b5061019461017f366004611157565b60009081526065602052604090206001015490565b60405190815260200161015b565b3480156101ae57600080fd5b5061014f6101bd366004611080565b610491565b3480156101ce57600080fd5b506101e26101dd36600461116f565b61049d565b005b3480156101f057600080fd5b5061014f6101ff366004611080565b6104c9565b34801561021057600080fd5b506101e261021f36600461116f565b6104f5565b34801561023057600080fd5b506101e261023f366004611080565b610578565b34801561025057600080fd5b50600161014f565b34801561026457600080fd5b5061014f610273366004611080565b610641565b6101e261028636600461109a565b61066d565b34801561029757600080fd5b50604080518082019091526005815264302e322e3160d81b60208201525b60405161015b91906112ec565b3480156102ce57600080fd5b506101e2610723565b3480156102e357600080fd5b506101947f5474431f81b75a7b45d74ffe5ff51964b4290ef4c86184accd4e4a9822dae90181565b34801561031757600080fd5b5061014f61032636600461116f565b6107f7565b34801561033757600080fd5b50610194600081565b34801561034c57600080fd5b506102b5604051806040016040528060138152602001724554532061636365737320636f6e74726f6c7360681b81525081565b34801561038b57600080fd5b506101e261039a3660046111c2565b610822565b3480156103ab57600080fd5b5060408051808201909152600b81526a1e5bdd481adb9bddc81a5d60aa1b60208201526102b5565b3480156103df57600080fd5b506101e26103ee36600461116f565b6108a3565b3480156103ff57600080fd5b506101947fad312f08b8889cfe65ec2f1faae419f8b47f0153a3483ea6130918c055c8183d81565b34801561043357600080fd5b506102b560405180604001604052806005815260200164302e322e3160d81b81525081565b60006001600160e01b03198216637965db0b60e01b148061048957506301ffc9a760e01b6001600160e01b03198316145b90505b919050565b600061048981836107f7565b6000828152606560205260409020600101546104ba81335b6108c9565b6104c4838361092d565b505050565b60006104897f5474431f81b75a7b45d74ffe5ff51964b4290ef4c86184accd4e4a9822dae901836107f7565b6001600160a01b038116331461056a5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61057482826109b3565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156105c15760405162461bcd60e51b815260040161056190611324565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166105f3610a1a565b6001600160a01b0316146106195760405162461bcd60e51b815260040161056190611370565b61062281610a48565b6040805160008082526020820190925261063e91839190610a54565b50565b60006104897fad312f08b8889cfe65ec2f1faae419f8b47f0153a3483ea6130918c055c8183d836107f7565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106b65760405162461bcd60e51b815260040161056190611324565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166106e8610a1a565b6001600160a01b03161461070e5760405162461bcd60e51b815260040161056190611370565b61071782610a48565b61057482826001610a54565b600054610100900460ff1661073e5760005460ff1615610742565b303b155b6107a55760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610561565b600054610100900460ff161580156107d0576000805460ff1961ff0019909116610100171660011790555b6107d8610b9f565b6107e3600033610be0565b801561063e576000805461ff001916905550565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600061082e81336104b5565b6104c46040518060400160405280601a81526020017f455453416363657373436f6e74726f6c7320757067726164656400000000000081525084848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610bea92505050565b6000828152606560205260409020600101546108bf81336104b5565b6104c483836109b3565b6108d382826107f7565b610574576108eb816001600160a01b03166014610c2f565b6108f6836020610c2f565b604051602001610907929190611277565b60408051601f198184030181529082905262461bcd60e51b8252610561916004016112ec565b61093782826107f7565b6105745760008281526065602090815260408083206001600160a01b03851684529091529020805460ff1916600117905561096f3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6109bd82826107f7565b156105745760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b600061057481336104b5565b6000610a5e610a1a565b9050610a6984610e18565b600083511180610a765750815b15610a8757610a858484610ebd565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610b9857805460ff191660011781556040516001600160a01b0383166024820152610b0690869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052610ebd565b50805460ff19168155610b17610a1a565b6001600160a01b0316826001600160a01b031614610b8f5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610561565b610b9885610fa8565b5050505050565b600054610100900460ff16610bc65760405162461bcd60e51b8152600401610561906113bc565b610bce610fe8565b610bd6610fe8565b610bde610fe8565b565b610574828261092d565b6105748282604051602401610c009291906112ff565b60408051601f198184030181529190526020810180516001600160e01b0316634b5c427760e01b17905261100f565b60606000610c3e83600261141f565b610c49906002611407565b67ffffffffffffffff811115610c6f57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610c99576020820181803683370190505b509050600360fc1b81600081518110610cc257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610cff57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000610d2384600261141f565b610d2e906001611407565b90505b6001811115610dc2576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610d7057634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110610d9457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93610dbb8161146e565b9050610d31565b508315610e115760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610561565b9392505050565b803b610e7c5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610561565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b610f1c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610561565b600080846001600160a01b031684604051610f37919061125b565b600060405180830381855af49150503d8060008114610f72576040519150601f19603f3d011682016040523d82523d6000602084013e610f77565b606091505b5091509150610f9f82826040518060600160405280602781526020016114b260279139611030565b95945050505050565b610fb181610e18565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b600054610100900460ff16610bde5760405162461bcd60e51b8152600401610561906113bc565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6060831561103f575081610e11565b82511561104f5782518084602001fd5b8160405162461bcd60e51b815260040161056191906112ec565b80356001600160a01b038116811461048c57600080fd5b600060208284031215611091578081fd5b610e1182611069565b600080604083850312156110ac578081fd5b6110b583611069565b9150602083013567ffffffffffffffff808211156110d1578283fd5b818501915085601f8301126110e4578283fd5b8135818111156110f6576110f661149b565b604051601f8201601f19908116603f0116810190838211818310171561111e5761111e61149b565b81604052828152886020848701011115611136578586fd5b82602086016020830137856020848301015280955050505050509250929050565b600060208284031215611168578081fd5b5035919050565b60008060408385031215611181578182fd5b8235915061119160208401611069565b90509250929050565b6000602082840312156111ab578081fd5b81356001600160e01b031981168114610e11578182fd5b600080602083850312156111d4578182fd5b823567ffffffffffffffff808211156111eb578384fd5b818501915085601f8301126111fe578384fd5b81358181111561120c578485fd5b86602082850101111561121d578485fd5b60209290920196919550909350505050565b6000815180845261124781602086016020860161143e565b601f01601f19169290920160200192915050565b6000825161126d81846020870161143e565b9190910192915050565b60007f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000825283516112af81601785016020880161143e565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516112e081602884016020880161143e565b01602801949350505050565b600060208252610e11602083018461122f565b600060408252611312604083018561122f565b8281036020840152610f9f818561122f565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6000821982111561141a5761141a611485565b500190565b600081600019048311821515161561143957611439611485565b500290565b60005b83811015611459578181015183820152602001611441565b83811115611468576000848401525b50505050565b60008161147d5761147d611485565b506000190190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a264697066735822122028e7a688e8ddf65eeed0e3324f6c573c2a5923668a76a871b86fb669166dcbca64736f6c63430008020033";

export class ETSAccessControlsUpgrade__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ETSAccessControlsUpgrade> {
    return super.deploy(overrides || {}) as Promise<ETSAccessControlsUpgrade>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ETSAccessControlsUpgrade {
    return super.attach(address) as ETSAccessControlsUpgrade;
  }
  connect(signer: Signer): ETSAccessControlsUpgrade__factory {
    return super.connect(signer) as ETSAccessControlsUpgrade__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETSAccessControlsUpgradeInterface {
    return new utils.Interface(_abi) as ETSAccessControlsUpgradeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ETSAccessControlsUpgrade {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ETSAccessControlsUpgrade;
  }
}
