# Simple Read Contract using sdk-react-hooks

This example demonstrates how to read from ETS contracts using sdk-react-hooks package.

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm run dev
   ```

3. **Open the example in your browser:**
usually: [http://localhost:5174/](http://localhost:5174/)

You can change the CTAG being read by editing the `src/App.tsx` file.

```typescript
  const checkTags = async () => {
    const tagsToCheck = ["#rainbow"];
    const existing = await existingTags(tagsToCheck);
    console.info("Existing tags:", existing);
  };
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ethereum-tag-service/ets/tree/main/examples/sdk-react-hooks/read-contract)
