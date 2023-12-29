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
import type { WMATIC, WMATICInterface } from "../../../contracts/test/WMATIC";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
    name: "symbol",
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
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
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
        name: "src",
        type: "address",
      },
      {
        internalType: "address",
        name: "dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60c0604052600d60808190526c57726170706564204d6174696360981b60a090815261002e916000919061007c565b5060408051808201909152600680825265574d4154494360d01b602090920191825261005c9160019161007c565b506002805460ff1916601217905534801561007657600080fd5b50610150565b82805461008890610115565b90600052602060002090601f0160209004810192826100aa57600085556100f0565b82601f106100c357805160ff19168380011785556100f0565b828001600101855582156100f0579182015b828111156100f05782518255916020019190600101906100d5565b506100fc929150610100565b5090565b5b808211156100fc5760008155600101610101565b600181811c9082168061012957607f821691505b6020821081141561014a57634e487b7160e01b600052602260045260246000fd5b50919050565b6107e98061015f6000396000f3fe6080604052600436106100c05760003560e01c8063313ce56711610074578063a9059cbb1161004e578063a9059cbb146101fd578063d0e30db0146100cf578063dd62ed3e1461021d576100cf565b8063313ce5671461018f57806370a08231146101bb57806395d89b41146101e8576100cf565b806318160ddd116100a557806318160ddd1461013257806323b872dd1461014f5780632e1a7d4d1461016f576100cf565b806306fdde03146100d7578063095ea7b314610102576100cf565b366100cf576100cd610255565b005b6100cd610255565b3480156100e357600080fd5b506100ec6102b0565b6040516100f991906105f5565b60405180910390f35b34801561010e57600080fd5b5061012261011d366004610666565b61033e565b60405190151581526020016100f9565b34801561013e57600080fd5b50475b6040519081526020016100f9565b34801561015b57600080fd5b5061012261016a366004610690565b6103aa565b34801561017b57600080fd5b506100cd61018a3660046106cc565b61052e565b34801561019b57600080fd5b506002546101a99060ff1681565b60405160ff90911681526020016100f9565b3480156101c757600080fd5b506101416101d63660046106e5565b60036020526000908152604090205481565b3480156101f457600080fd5b506100ec6105d4565b34801561020957600080fd5b50610122610218366004610666565b6105e1565b34801561022957600080fd5b50610141610238366004610700565b600460209081526000928352604080842090915290825290205481565b3360009081526003602052604081208054349290610274908490610749565b909155505060405134815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a2565b600080546102bd90610761565b80601f01602080910402602001604051908101604052809291908181526020018280546102e990610761565b80156103365780601f1061030b57610100808354040283529160200191610336565b820191906000526020600020905b81548152906001019060200180831161031957829003601f168201915b505050505081565b3360008181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906103999086815260200190565b60405180910390a350600192915050565b6001600160a01b0383166000908152600360205260408120548211156103cf57600080fd5b6001600160a01b038416331480159061040d57506001600160a01b038416600090815260046020908152604080832033845290915290205460001914155b1561047b576001600160a01b038416600090815260046020908152604080832033845290915290205482111561044257600080fd5b6001600160a01b03841660009081526004602090815260408083203384529091528120805484929061047590849061079c565b90915550505b6001600160a01b038416600090815260036020526040812080548492906104a390849061079c565b90915550506001600160a01b038316600090815260036020526040812080548492906104d0908490610749565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161051c91815260200190565b60405180910390a35060019392505050565b3360009081526003602052604090205481111561054a57600080fd5b336000908152600360205260408120805483929061056990849061079c565b9091555050604051339082156108fc029083906000818181858888f1935050505015801561059b573d6000803e3d6000fd5b5060405181815233907f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b659060200160405180910390a250565b600180546102bd90610761565b60006105ee3384846103aa565b9392505050565b600060208083528351808285015260005b8181101561062257858101830151858201604001528201610606565b81811115610634576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461066157600080fd5b919050565b6000806040838503121561067957600080fd5b6106828361064a565b946020939093013593505050565b6000806000606084860312156106a557600080fd5b6106ae8461064a565b92506106bc6020850161064a565b9150604084013590509250925092565b6000602082840312156106de57600080fd5b5035919050565b6000602082840312156106f757600080fd5b6105ee8261064a565b6000806040838503121561071357600080fd5b61071c8361064a565b915061072a6020840161064a565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561075c5761075c610733565b500190565b600181811c9082168061077557607f821691505b6020821081141561079657634e487b7160e01b600052602260045260246000fd5b50919050565b6000828210156107ae576107ae610733565b50039056fea2646970667358221220afb618fb06484311c31666547022702380f511e2062796c8abba4f7dfa88d48e64736f6c634300080c0033";

type WMATICConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WMATICConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WMATIC__factory extends ContractFactory {
  constructor(...args: WMATICConstructorParams) {
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
      WMATIC & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): WMATIC__factory {
    return super.connect(runner) as WMATIC__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WMATICInterface {
    return new Interface(_abi) as WMATICInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): WMATIC {
    return new Contract(address, _abi, runner) as unknown as WMATIC;
  }
}