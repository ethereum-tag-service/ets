### TransactionConfig.ts

**Purpose**: `transactionConfig.ts` defines the sequence of components (steps) that are used in the transaction process for different types of transactions such as bidding or settling an auction. Each type of transaction may require different user interactions and confirmations, and this configuration file organizes those steps in a systematic way.

**Structure**:

- **TransactionType**: An enumeration that identifies the type of transaction, such as `Bid`, `SettleAuction`, etc.
- **StepConfig**: An array for each transaction type that specifies the components to be rendered at each step of the transaction process. Each entry in the array represents a step in the transaction flow and includes:
  - **component**: The React component that should be rendered for this step.
  - **props**: Any props that need to be passed to the component.

````typescript
import { TransactionType } from "@app/types/transaction"; // Adjust import paths as necessary
import { BidConfirm, BidInput, SettleConfirm, AddRelayerConfirm, AddRelayerInput } from "@app/components/transaction";

export interface StepConfig {
  component: React.ComponentType<any>;
  props?: { [key: string]: any };
}

export const transactionConfig: { [key in TransactionType]: StepConfig[] } = {
  [TransactionType.AddRelayer]: [
    {
      component: AddRelayerInput,
      props: { /* props for AddRelayerForm */ },
    },
    {
      component: AddRelayerConfirm,
      props: { /* props for confirmation */ },
    },
  ],
  [TransactionType.Bid]: [
    {
      component: BidInput,
      props: { /* props for BidForm */ },
    },
    {
      component: BidConfirm,
      props: { /* props for ConfirmBid */ },
    },
  ],
  [TransactionType.SettleAuction]: [
    {
      component: SettleConfirm,
      props: { /* props for ConfirmSettleAuction */ },
    },
  ],
};

### TransactionFlowWrapper

**Purpose**: `TransactionFlowWrapper` manages the user interface flow for transactions based on the `transactionConfig`. It dynamically renders the appropriate component for each step of a transaction, based on the user's progress through the steps (e.g., filling out a form, confirming details, completing the transaction).

**Functionality**:

- **Step Management**: It keeps track of the current step index using state and updates it as the user progresses through the transaction steps.
- **Dynamic Component Rendering**: Based on the current step index, it retrieves the component and props for that step from the `transactionConfig` and renders it.
- **Navigation Functions**: Provides functions to navigate to the next step or jump to a specific step, which can be passed down to the transaction step components to allow for user-initiated navigation.

```typescript
const TransactionFlowWrapper: React.FC<FlowWrapperProps> = ({ transactionType }) => {
  const { isPending, hash, isError } = useTransaction();
  const steps = transactionConfig[transactionType];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    setCurrentStepIndex(0); // Resets to the initial step whenever the transaction type changes
  }, [transactionType]);

  useEffect(() => {
    const confirmationStepIndex = steps.length - 1;
    if (isPending || hash || isError) {
      setCurrentStepIndex(confirmationStepIndex);
    } else {
      setCurrentStepIndex(0);
    }
  }, [isPending, hash, isError, steps.length]);

  const CurrentStepComponent = steps[currentStepIndex].component;
  const currentStepProps = steps[currentStepIndex].props;

  const goToNextStep = () => setCurrentStepIndex((prevIndex) => prevIndex + 1);
  const goToStep = (index: number) => setCurrentStepIndex(index);

  return (
    <div>
      <CurrentStepComponent {...currentStepProps} goToNextStep={goToNextStep} goToStep={goToStep} />
    </div>
  );
};

export default TransactionFlowWrapper;

````

### Integration and Usage

In the broader application, `TransactionFlowWrapper` is typically used within modals or specific UI contexts where transactions are initiated. For example, in the `Modal` component associated with an auction action, you might render `TransactionFlowWrapper` passing the appropriate `transactionType` to handle bidding or settling:

```javascript
<Modal ...>
  <TransactionFlowWrapper transactionType={TransactionType.Bid} />
</Modal>
```

This design separates the concerns of managing transaction steps and their UI from other parts of the application, centralizing transaction flow logic and making it easier to modify or extend.
