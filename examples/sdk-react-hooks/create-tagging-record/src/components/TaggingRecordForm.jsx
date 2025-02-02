import { useRelayerClient } from "@ethereum-tag-service/sdk-react-hooks";
import React, { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { useRelayers } from "../hooks/useRelayers";

function TaggingRecordForm() {
  const [tags, setTags] = useState([]);
  const [targetURI, setTargetURI] = useState("");
  const [recordType, setRecordType] = useState("");
  const [selectedRelayer, setSelectedRelayer] = useState(null);
  const [message, setMessage] = useState("");
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [createdRecordId, setCreatedRecordId] = useState(null);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { relayers, isLoading: relayersLoading, error: relayersError } = useRelayers({});
  const relayerClient = useRelayerClient({
    relayerAddress: selectedRelayer?.id,
    account: address,
    chainId: chainId,
  });

  useEffect(() => {
    if (!isConnected) {
      setMessage("Please connect your wallet");
    } else if (!chainId) {
      setMessage("Please connect to a supported network");
    } else {
      setMessage("");
    }
  }, [isConnected, chainId]);

  const handleCreateTaggingRecord = async () => {
    if (tags.length > 0 && targetURI && recordType && selectedRelayer && isConnected && chainId) {
      setIsCreatingRecord(true);
      setMessage("");
      setCreatedRecordId(null);
      try {
        const recordId = await relayerClient?.createTaggingRecord(tags, targetURI, recordType);
        setTags([]);
        setTargetURI("");
        setRecordType("");
        setCreatedRecordId(recordId);
        setMessage("Tagging record created successfully!");
      } catch (error) {
        console.error("Error creating tagging record:", error);
        setMessage("Failed to create tagging record. Please try again.");
      } finally {
        setIsCreatingRecord(false);
      }
    }
  };

  const handleAddTag = (event) => {
    event.preventDefault();
    const newTag = event.target.tag.value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      event.target.tag.value = "";
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  if (relayersLoading) return <div>Loading relayers...</div>;
  if (relayersError) return <div>Error loading relayers: {relayersError}</div>;

  return (
    <div>
      <form onSubmit={handleAddTag}>
        <input type="text" name="tag" placeholder="Enter tag name" />
        <button type="submit">Add Tag</button>
      </form>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={{ margin: "0 5px" }}>
            {tag}
            <button onClick={() => handleRemoveTag(index)}>x</button>
          </span>
        ))}
      </div>
      <input type="text" placeholder="Target URI" value={targetURI} onChange={(e) => setTargetURI(e.target.value)} />
      <input type="text" placeholder="Record Type" value={recordType} onChange={(e) => setRecordType(e.target.value)} />
      <select
        value={selectedRelayer ? selectedRelayer.id : ""}
        onChange={(e) => setSelectedRelayer(relayers.find((r) => r.id.toString() === e.target.value) || null)}
      >
        <option value="">Select Relayer</option>
        {relayers?.map((relayer) => (
          <option key={relayer.id} value={relayer.id}>
            {relayer.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleCreateTaggingRecord}
        disabled={
          !isConnected ||
          !chainId ||
          tags.length === 0 ||
          !targetURI ||
          !recordType ||
          !selectedRelayer ||
          isCreatingRecord
        }
      >
        {isCreatingRecord ? "Creating Record..." : "Create Tagging Record"}
      </button>
      {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}
      {createdRecordId && (
        <p>
          Your tagging record will be soon viewable at this link:{" "}
          <a
            href={`https://arbitrumsepolia.app.ets.xyz/explore/tagging-records/${createdRecordId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            https://stage.app.ets.xyz/explore/tagging-records/{createdRecordId}
          </a>
        </p>
      )}
    </div>
  );
}

export default TaggingRecordForm;
