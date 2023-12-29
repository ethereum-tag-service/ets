import React, { useEffect } from "react";
import { createContext, useState, ReactNode } from "react";
import { fetchHasTags } from "@app/services/tokenService";
import { useAccount } from "wagmi";

export enum AddRelayerSteps {
  CheckUser = 1,
  AddRelayerForm,
  ConfirmTransaction,
  TransactionProcessing,
  TransactionComplete,
}

type TransactionStage = "Preparing" | "Waiting for Signature" | "Sent" | "Processing" | "Completed" | "Failed";

type TransactionStatus = {
  loading: boolean;
  success: boolean;
  error: Error | null;
  stage: TransactionStage | null;
};

type FormData = {
  name: string;
};

export type FormContextValue = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  hasTags: boolean;
  AddRelayerSteps: typeof AddRelayerSteps;
  currentStep: AddRelayerSteps;
  goToNextStep: () => void;
  goToStep: (step: AddRelayerSteps) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  //submitNewRelayer: (name: string) => void;
  transactionStatus: TransactionStatus;
  setTransactionStatus: (status: TransactionStatus) => void;
};

export const AddRelayerContext = createContext<FormContextValue | undefined>(undefined);

export const AddRelayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(AddRelayerSteps.CheckUser);
  const [formData, setFormData] = useState({
    name: "",
  });
  const { address, isConnected } = useAccount();
  const [hasTags, setHasTags] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>({
    loading: false,
    success: false,
    error: null,
    stage: null,
  });

  const goToNextStep = () => {
    setCurrentStep((prevStep) => {
      let nextStep;
      if (prevStep === AddRelayerSteps.AddRelayerForm) {
        nextStep = AddRelayerSteps.ConfirmTransaction;
      } else {
        nextStep = prevStep + 1;
      }
      return nextStep;
    });
  };

  const goToStep = (step: AddRelayerSteps) => setCurrentStep(step);

  const resetTransactionStatus = () => {
    setTransactionStatus({ loading: false, success: false, error: null, stage: null });
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const tags = await fetchHasTags(address);
      setHasTags(tags);
    };

    if (address && isConnected) {
      fetchData();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isConnected && hasTags) {
      setCurrentStep(AddRelayerSteps.AddRelayerForm);
    } else {
      setCurrentStep(AddRelayerSteps.CheckUser);
    }
  }, [isConnected, hasTags]);

  const contextValue: FormContextValue = {
    address,
    isConnected,
    hasTags,
    AddRelayerSteps,
    currentStep,
    goToNextStep,
    goToStep,
    formData,
    setFormData,
    //submitNewRelayer: handleNewRelayerSubmission,
    transactionStatus,
    setTransactionStatus,
  };

  return <AddRelayerContext.Provider value={contextValue}>{children}</AddRelayerContext.Provider>;
};