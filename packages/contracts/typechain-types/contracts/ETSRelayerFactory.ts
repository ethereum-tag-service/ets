/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface ETSRelayerFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "NAME"
      | "addRelayer"
      | "ets"
      | "etsAccessControls"
      | "etsTarget"
      | "etsToken"
      | "getBeacon"
      | "getImplementation"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "NAME", values?: undefined): string;
  encodeFunctionData(functionFragment: "addRelayer", values: [string]): string;
  encodeFunctionData(functionFragment: "ets", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "etsAccessControls",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "etsTarget", values?: undefined): string;
  encodeFunctionData(functionFragment: "etsToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "getBeacon", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getImplementation",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "NAME", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addRelayer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "etsAccessControls",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "etsTarget", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "etsToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBeacon", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getImplementation",
    data: BytesLike
  ): Result;
}

export interface ETSRelayerFactory extends BaseContract {
  connect(runner?: ContractRunner | null): ETSRelayerFactory;
  waitForDeployment(): Promise<this>;

  interface: ETSRelayerFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  NAME: TypedContractMethod<[], [string], "view">;

  addRelayer: TypedContractMethod<
    [_relayerName: string],
    [string],
    "nonpayable"
  >;

  ets: TypedContractMethod<[], [string], "view">;

  etsAccessControls: TypedContractMethod<[], [string], "view">;

  etsTarget: TypedContractMethod<[], [string], "view">;

  etsToken: TypedContractMethod<[], [string], "view">;

  getBeacon: TypedContractMethod<[], [string], "view">;

  getImplementation: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "NAME"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "addRelayer"
  ): TypedContractMethod<[_relayerName: string], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "ets"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "etsAccessControls"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "etsTarget"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "etsToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getBeacon"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getImplementation"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}