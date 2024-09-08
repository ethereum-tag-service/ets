import TagInput from "@app/components/TagInput";
import { useRelayers } from "@app/hooks/useRelayers";
import useToast from "@app/hooks/useToast";
import type { TagInput as TagInputType } from "@app/types/tag";
import { isValidTag } from "@app/utils/tagUtils";
import useTranslation from "next-translate/useTranslation";
import { useCallback, useState } from "react";
import type { Hex } from "viem";
import { useAccount } from "wagmi";
import ConnectButtonETS from "./ConnectButtonETS";

interface TaggingFormProps {
  target: string;
  onCreateRecord: (tagValues: string[], target: string, recordType: string) => void;
  isLoading: boolean;
  selectedRelayer: { id: Hex; name: string } | null;
  setSelectedRelayer: (relayer: { id: Hex; name: string } | null) => void;
}

const TaggingForm: React.FC<TaggingFormProps> = ({
  target,
  onCreateRecord,
  isLoading,
  selectedRelayer,
  setSelectedRelayer,
}) => {
  const { t } = useTranslation("common");
  const { showToast } = useToast();
  const [tags, setTags] = useState<TagInputType[]>([]);
  const [recordType, setRecordType] = useState<string>("");
  const { relayers } = useRelayers({});
  const { isConnected } = useAccount();
  console.info("isConnected", isConnected);

  const handleDeleteTag = useCallback(
    (i: number) => {
      setTags(tags.filter((_tag, index) => index !== i));
    },
    [tags],
  );

  const handleAddTag = useCallback(
    (tag: TagInputType) => {
      if (isValidTag(tag.text)) {
        setTags((prevTags) => [...prevTags, tag]);
      } else {
        showToast({
          title: "Error",
          description: t("invalid-tag-message"),
        });
      }
    },
    [showToast, t],
  );

  const handleSelectRelayer = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const relayerId = event.target.value;
      const selected = relayers?.find((relayer) => relayer.id.toString() === relayerId);
      setSelectedRelayer(selected || null);
    },
    [relayers, setSelectedRelayer],
  );

  const handleSubmit = () => {
    if (selectedRelayer) {
      const tagValues = tags.map((tag) => tag.text);
      onCreateRecord(tagValues, target, recordType);
    } else {
      showToast({
        title: "Error",
        description: t("please-select-a-relayer"),
      });
    }
  };

  return (
    <>
      <TagInput tags={tags} handleDeleteTag={handleDeleteTag} handleAddTag={handleAddTag} />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter record type (e.g., discovery)"
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="input input-bordered w-full"
          aria-label="Record Type"
        />
      </div>
      <div className="mb-4">
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedRelayer ? selectedRelayer.id : ""}
          onChange={handleSelectRelayer}
          aria-label="Select Relayer"
        >
          <option disabled value="">
            {t("select-a-relayer")}
          </option>
          {relayers?.map((relayer, index) => (
            <option key={index} value={relayer.id}>
              {relayer.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        {!isConnected ? (
          <ConnectButtonETS className="btn-primary btn-sm" />
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !target || tags.length === 0 || !recordType || !selectedRelayer}
            className={`btn ${
              isLoading || !target || tags.length === 0 || !recordType || !selectedRelayer
                ? "btn-disabled"
                : "btn-primary"
            }`}
            aria-label="Create Tagging Record"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">&#9696;</span> {t("creating")}...
              </>
            ) : (
              t("Create")
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default TaggingForm;
