import { useTokenClient } from "@ethereum-tag-service/sdk-react-hooks";

function App() {
  const { existingTags } = useTokenClient({
    chainId: 421614,
    account: "0x1234567890123456789012345678901234567890",
  });

  const checkTags = async () => {
    const tagsToCheck = ["#rainbow"];
    const existing = await existingTags(tagsToCheck);
    console.info("Existing tags:", existing);
  };

  return (
    <div>
      <h1>ETS Tag Checker</h1>
      <button onClick={checkTags}>Check Tags</button>
      <p>Check the developer console for the results.</p>
    </div>
  );
}

export default App;
