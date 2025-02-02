import { useRelayerClient, useTokenClient } from "@ethereum-tag-service/sdk-react-hooks";
import React, { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { useRelayers } from "../hooks/useRelayers";

function CreateTagForm() {
  const [tags, setTags] = useState([]);
  const [selectedRelayer, setSelectedRelayer] = useState(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [message, setMessage] = useState("");
  const [createdTags, setCreatedTags] = useState([]);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { relayers, isLoading: relayersLoading, error: relayersError } = useRelayers({});
  const { tagExists } = useTokenClient({
    chainId: chainId,
    account: address,
  });
  const { createTags } = useRelayerClient({
    relayerAddress: selectedRelayer?.id,
    account: address,
    chainId: chainId,
  });

  useEffect(() => {
    if (!isConnected) {
      setMessage("Please connect your wallet");
    } else {
      setMessage("");
    }
  }, [isConnected]);

  const handleAddTag = async (event) => {
    event.preventDefault();
    const newTag = event.target.tag.value.trim();
    const exists = await tagExists?.(newTag);
    if (exists) {
      setMessage("This tag already exists");
    } else {
      setTags([...tags, { text: newTag }]);
      event.target.tag.value = "";
      setMessage("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSelectRelayer = (event) => {
    const relayerId = event.target.value;
    const selected = relayers.find((relayer) => relayer.id.toString() === relayerId);
    setSelectedRelayer(selected || null);
  };

  const handleCreateTags = async () => {
    if (tags.length > 0 && selectedRelayer && isConnected) {
      setIsCreatingTag(true);
      setMessage("");
      setCreatedTags([]);
      try {
        const tagValues = tags.map((tag) => tag.text);
        const result = await createTags?.(tagValues);
        console.info("createdTags result", result);
        setTags([]);
        if (result?.createdTags) {
          setCreatedTags(result.createdTags.map((tag) => ({ text: tag })));
          setMessage(`Tags created successfully. Transaction hash: ${result.transactionHash}`);
        } else {
          setMessage("No new tags were created. They might already exist.");
        }
      } catch (error) {
        console.error("Error creating tags:", error);
        setMessage("Failed to create tags. Please try again.");
      } finally {
        setIsCreatingTag(false);
      }
    }
  };

  if (relayersLoading) return <div>Loading relayers...</div>;
  if (relayersError) return <div>Error loading relayers: {relayersError}</div>;

  return (
    <div>
      <p>Enter tags to create. Each tag must start with # and contain at least one character after.</p>
      <form onSubmit={handleAddTag}>
        <div>
          <input type="text" name="tag" placeholder="Enter tag (e.g. #example)" />
          <button type="submit">Add Tag</button>
        </div>
      </form>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={{ margin: "0 5px" }}>
            {tag.text}
            <button onClick={() => handleRemoveTag(index)}>x</button>
          </span>
        ))}
      </div>
      <select value={selectedRelayer ? selectedRelayer.id : ""} onChange={handleSelectRelayer}>
        <option disabled value="">
          Select a relayer
        </option>
        {relayers?.map((relayer) => (
          <option key={relayer.id} value={relayer.id}>
            {relayer.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleCreateTags}
        disabled={!isConnected || !chainId || tags.length === 0 || !selectedRelayer || isCreatingTag}
      >
        {isCreatingTag ? "Creating Tags..." : "Create Tags"}
      </button>
      {message && <p>{message}</p>}
      {createdTags.length > 0 && (
        <div>
          <h3>Created Tags:</h3>
          <p>These tags will soon be viewable at the following links:</p>
          <ul>
            {createdTags.map((tag, index) => (
              <li key={index}>
                <a
                  href={`https://arbitrumsepolia.app.ets.xyz/explore/tags/${tag.text.slice(1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tag.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CreateTagForm;
