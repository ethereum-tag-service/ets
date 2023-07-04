/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IETSTarget,
  IETSTargetInterface,
} from "../../../contracts/interfaces/IETSTarget";

const _abi = [
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
        name: "targetId",
        type: "uint256",
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
] as const;

export class IETSTarget__factory {
  static readonly abi = _abi;
  static createInterface(): IETSTargetInterface {
    return new utils.Interface(_abi) as IETSTargetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IETSTarget {
    return new Contract(address, _abi, signerOrProvider) as IETSTarget;
  }
}
