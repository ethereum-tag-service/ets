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
  ETSEnrichTargetUpgrade,
  ETSEnrichTargetUpgradeInterface,
} from "../../../../contracts/test/UUPSTesting.sol/ETSEnrichTargetUpgrade";

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
        internalType: "uint256",
        name: "targetId",
        type: "uint256",
      },
    ],
    name: "RequestEnrichTarget",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_targetId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_httpStatus",
        type: "uint256",
      },
    ],
    name: "fulfillEnrichTarget",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IETSAccessControls",
        name: "_etsAccessControls",
        type: "address",
      },
      {
        internalType: "contract IETSTarget",
        name: "_etsTarget",
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
        internalType: "uint256",
        name: "_targetId",
        type: "uint256",
      },
    ],
    name: "requestEnrichTarget",
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
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100e1565b600054610100900460ff161561008e5760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff908116146100df576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b60805161143d61011860003960008181610248015281816102d201528181610520015281816105a5015261068f015261143d6000f3fe6080604052600436106100b15760003560e01c806356c63489116100695780636a34db1c1161004e5780636a34db1c146101a75780638299f9f9146101c7578063a3f4df7e146101e757600080fd5b806356c634891461014f5780635b6411ab1461018757600080fd5b8063485cc9551161009a578063485cc955146100f95780634f1ef2861461011957806352d1902d1461012c57600080fd5b80633659cfe6146100b65780633d20b15c146100d8575b600080fd5b3480156100c257600080fd5b506100d66100d1366004610f72565b61023d565b005b3480156100e457600080fd5b50604051600181526020015b60405180910390f35b34801561010557600080fd5b506100d6610114366004610f8f565b6103be565b6100d6610127366004611079565b610515565b34801561013857600080fd5b50610141610682565b6040519081526020016100f0565b34801561015b57600080fd5b5060985461016f906001600160a01b031681565b6040516001600160a01b0390911681526020016100f0565b34801561019357600080fd5b506100d66101a236600461110c565b610747565b3480156101b357600080fd5b506100d66101c236600461118e565b610950565b3480156101d357600080fd5b5060975461016f906001600160a01b031681565b3480156101f357600080fd5b506102306040518060400160405280600f81526020017f455453456e72696368546172676574000000000000000000000000000000000081525081565b6040516100f091906111ff565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156102d05760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b60648201526084015b60405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661032b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146103965760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b60648201526084016102c7565b61039f81610a5d565b604080516000808252602082019092526103bb91839190610b3b565b50565b600054610100900460ff16158080156103de5750600054600160ff909116105b806103f85750303b1580156103f8575060005460ff166001145b61046a5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016102c7565b6000805460ff19166001179055801561048d576000805461ff0019166101001790555b609780546001600160a01b0380861673ffffffffffffffffffffffffffffffffffffffff199283161790925560988054928516929091169190911790558015610510576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156105a35760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b19195b1959d85d1958d85b1b60a21b60648201526084016102c7565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166105fe7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6001600160a01b0316146106695760405162461bcd60e51b815260206004820152602c60248201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060448201526b6163746976652070726f787960a01b60648201526084016102c7565b61067282610a5d565b61067e82826001610b3b565b5050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107225760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c000000000000000060648201526084016102c7565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b609754604080517f3c0c4566000000000000000000000000000000000000000000000000000000008152905133926001600160a01b031691633c0c45669160048083019260209291908290030181865afa1580156107a9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107cd9190611212565b6001600160a01b0316146108235760405162461bcd60e51b815260206004820152601f60248201527f6f6e6c7920706c6174666f726d206d617920656e72696368207461726765740060448201526064016102c7565b6098546040517f1b2d87c3000000000000000000000000000000000000000000000000000000008152600481018690526000916001600160a01b031690631b2d87c390602401600060405180830381865afa158015610886573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108ae9190810190611274565b60985481516040517f7ab3f1cd0000000000000000000000000000000000000000000000000000000081529293506001600160a01b0390911691637ab3f1cd9161090591899190429088908b908b9060040161132e565b6020604051808303816000875af1158015610924573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109489190611389565b505050505050565b6098546040517fcd7c68e2000000000000000000000000000000000000000000000000000000008152600481018390526001600160a01b039091169063cd7c68e290602401602060405180830381865afa1580156109b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109d69190611389565b1515600114610a275760405162461bcd60e51b815260206004820152600e60248201527f496e76616c69642074617267657400000000000000000000000000000000000060448201526064016102c7565b6040518181527fa769cb5a56651753718b44cdc6b7211e001c6d099d9aa9b1dfcaa19991b66d219060200160405180910390a150565b6097546001600160a01b03166324d7806c336040517fffffffff0000000000000000000000000000000000000000000000000000000060e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610acb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aef9190611389565b6103bb5760405162461bcd60e51b815260206004820152600d60248201527f4163636573732064656e6965640000000000000000000000000000000000000060448201526064016102c7565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610b6e5761051083610cdb565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610bc8575060408051601f3d908101601f19168201909252610bc5918101906113ab565b60015b610c3a5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201527f6f6e206973206e6f74205555505300000000000000000000000000000000000060648201526084016102c7565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc8114610ccf5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f7860448201527f6961626c6555554944000000000000000000000000000000000000000000000060648201526084016102c7565b50610510838383610da6565b6001600160a01b0381163b610d585760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201527f6f74206120636f6e74726163740000000000000000000000000000000000000060648201526084016102c7565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b610daf83610dd1565b600082511180610dbc5750805b1561051057610dcb8383610e11565b50505050565b610dda81610cdb565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060610e3683836040518060600160405280602781526020016113e160279139610e3d565b9392505050565b6060600080856001600160a01b031685604051610e5a91906113c4565b600060405180830381855af49150503d8060008114610e95576040519150601f19603f3d011682016040523d82523d6000602084013e610e9a565b606091505b5091509150610eab86838387610eb5565b9695505050505050565b60608315610f21578251610f1a576001600160a01b0385163b610f1a5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102c7565b5081610f2b565b610f2b8383610f33565b949350505050565b815115610f435781518083602001fd5b8060405162461bcd60e51b81526004016102c791906111ff565b6001600160a01b03811681146103bb57600080fd5b600060208284031215610f8457600080fd5b8135610e3681610f5d565b60008060408385031215610fa257600080fd5b8235610fad81610f5d565b91506020830135610fbd81610f5d565b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60405160a0810167ffffffffffffffff8111828210171561101a5761101a610fc8565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561104957611049610fc8565b604052919050565b600067ffffffffffffffff82111561106b5761106b610fc8565b50601f01601f191660200190565b6000806040838503121561108c57600080fd5b823561109781610f5d565b9150602083013567ffffffffffffffff8111156110b357600080fd5b8301601f810185136110c457600080fd5b80356110d76110d282611051565b611020565b8181528660208385010111156110ec57600080fd5b816020840160208301376000602083830101528093505050509250929050565b6000806000806060858703121561112257600080fd5b84359350602085013567ffffffffffffffff8082111561114157600080fd5b818701915087601f83011261115557600080fd5b81358181111561116457600080fd5b88602082850101111561117657600080fd5b95986020929092019750949560400135945092505050565b6000602082840312156111a057600080fd5b5035919050565b60005b838110156111c25781810151838201526020016111aa565b83811115610dcb5750506000910152565b600081518084526111eb8160208601602086016111a7565b601f01601f19169290920160200192915050565b602081526000610e3660208301846111d3565b60006020828403121561122457600080fd5b8151610e3681610f5d565b600082601f83011261124057600080fd5b815161124e6110d282611051565b81815284602083860101111561126357600080fd5b610f2b8260208301602087016111a7565b60006020828403121561128657600080fd5b815167ffffffffffffffff8082111561129e57600080fd5b9083019060a082860312156112b257600080fd5b6112ba610ff7565b8251828111156112c957600080fd5b6112d58782860161122f565b82525060208301516112e681610f5d565b80602083015250604083015160408201526060830151606082015260808301518281111561131357600080fd5b61131f8782860161122f565b60808301525095945050505050565b86815260a06020820152600061134760a08301886111d3565b8660408401528560608401528281036080840152838152838560208301376000602085830101526020601f19601f860116820101915050979650505050505050565b60006020828403121561139b57600080fd5b81518015158114610e3657600080fd5b6000602082840312156113bd57600080fd5b5051919050565b600082516113d68184602087016111a7565b919091019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a264697066735822122084136fc249f8692fcd50933a8145aaa45b67f5f66d81c4429a9c8b963cc2763164736f6c634300080c0033";

type ETSEnrichTargetUpgradeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ETSEnrichTargetUpgradeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ETSEnrichTargetUpgrade__factory extends ContractFactory {
  constructor(...args: ETSEnrichTargetUpgradeConstructorParams) {
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
      ETSEnrichTargetUpgrade & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ETSEnrichTargetUpgrade__factory {
    return super.connect(runner) as ETSEnrichTargetUpgrade__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETSEnrichTargetUpgradeInterface {
    return new Interface(_abi) as ETSEnrichTargetUpgradeInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ETSEnrichTargetUpgrade {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ETSEnrichTargetUpgrade;
  }
}