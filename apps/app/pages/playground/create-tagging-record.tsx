import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Layout from "@app/layouts/default";
import { useRelayers } from "@app/hooks/useRelayers";
import { useAccount } from "wagmi";
import { isValidTag } from "@app/utils/tagUtils";
import { Hex } from "viem";
import debounce from "lodash.debounce";
import useToast from "@app/hooks/useToast";
import TagInput from "@app/components/TagInput";
import { TagInput as TagInputType } from "@app/types/tag";
import Link from "next/link";
import { useRelayerClient } from "@ethereum-tag-service/sdk-react-hooks";

const CreateTaggingRecord: NextPage = () => {
  const { t } = useTranslation("common");
  const { showToast, ToastComponent } = useToast();
  const [tags, setTags] = useState<TagInputType[]>([]);
  const [recordType, setRecordType] = useState<string>("");
  const [selectedRelayer, setSelectedRelayer] = useState<{ id: Hex; name: string } | null>(null);
  const { address: tagger, chain } = useAccount();
  const { relayers } = useRelayers({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [taggingRecordId, setTaggingRecordId] = useState<string | null>(null);
  const { createTaggingRecord } = useRelayerClient({
    relayerAddress: selectedRelayer?.id,
    account: tagger,
    chainId: chain?.id,
  });

  const handleDeleteTag = useCallback(
    (i: number) => {
      setTags(tags.filter((tag, index) => index !== i));
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
      const selected = relayers?.find((relayer: any) => relayer.id.toString() === relayerId);
      setSelectedRelayer(selected || null);
    },
    [relayers],
  );

  const fetchRandomImage = useCallback(
    debounce(async () => {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_KEY; // Use the environment variable
      if (!accessKey) {
        console.error("Unsplash Access Key is not defined");
        return;
      }
      const url = `https://api.unsplash.com/photos/random?orientation=landscape&client_id=${accessKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setImageUrl(data.urls.regular); // Get the regular-sized image URL
      } catch (error) {
        console.error("Error fetching random image:", error);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    fetchRandomImage();
    return () => {
      fetchRandomImage.cancel();
    };
  }, [fetchRandomImage]);

  const handleCreateTaggingRecord = async () => {
    if (selectedRelayer) {
      setIsLoading(true);
      try {
        const tagValues = tags.map((tag) => tag.text);
        const recordId = await createTaggingRecord?.(tagValues, imageUrl, recordType, tagger);

        if (recordId) {
          setTaggingRecordId(recordId);
        }

        showToast({
          title: "Success",
          description: (
            <>
              {t("tagging-record-created-successfully")}
              <Link
                href={`/explore/tagging-records/${recordId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                View tagging record
              </Link>
            </>
          ),
        });

        setTags([]);
        setRecordType("");
      } catch (error) {
        console.error("Error creating tagging record:", error);

        showToast({
          title: "Error",
          description: t("error-creating-tagging-record"),
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      showToast({
        title: "Error",
        description: t("please-select-a-relayer"),
      });
    }
  };

  return (
    <Layout>
      <div className="col-span-7">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div role="tablist" className="tabs tabs-bordered mb-4">
            <input
              type="radio"
              name="create_record_tabs"
              role="tab"
              className="tab text-lg font-semibold"
              aria-label="Tag a random image"
              defaultChecked
            />
            <div role="tabpanel" className="tab-content">
              <div className="flex items-center">
                <button onClick={fetchRandomImage} className="btn btn-primary btn-sm ml-auto">
                  {t("refresh")}
                </button>
              </div>
              {imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={imageUrl}
                    alt="Random Image"
                    className="object-cover w-full my-4"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )}
            </div>

            <input
              type="radio"
              name="create_record_tabs"
              role="tab"
              className="tab text-lg font-semibold"
              aria-label="Tag a URL"
            />
            <div role="tabpanel" className="tab-content pt-8">
              <div>
                <input
                  type="text"
                  placeholder="Enter URL (e.g., https://example.com/image.jpg)"
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="input input-bordered w-full"
                  aria-label="Record Type"
                />
              </div>
            </div>
          </div>

          <TagInput tags={tags} handleDeleteTag={handleDeleteTag} handleAddTag={handleAddTag} infoInside />
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
              {relayers?.map((relayer: any, index: number) => (
                <option key={index} value={relayer.id}>
                  {relayer.name}
                </option>
              ))}
            </select>
          </div>

          {taggingRecordId && (
            <div className="mb-2">
              <Link
                href={`/explore/tagging-records/${taggingRecordId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View tagging record
              </Link>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleCreateTaggingRecord}
              disabled={isLoading || !imageUrl || tags.length === 0 || !recordType || !selectedRelayer}
              className={`btn ${
                isLoading || !imageUrl || tags.length === 0 || !recordType || !selectedRelayer
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
          </div>
        </div>
      </div>
      <div className="col-span-5">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t("tagging-record-inputs")}</h2>
          <div className="mb-2">
            <span className="font-bold">{t("relayer")}:</span> {selectedRelayer ? selectedRelayer.name : "/"}
          </div>
          <div className="mb-2 flex items-center">
            <span className="font-bold">{t("target")}:</span>
            <div className="truncate flex-1 mx-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate"
                title="Click to view the full URL"
              >
                {imageUrl}
              </a>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(imageUrl)}
              className="btn btn-xs btn-outline"
              title="Copy URL"
            >
              {t("copy")}
            </button>
          </div>
          <div className="mb-2 flex items-center">
            <span className="font-bold">{t("tagger")}:</span>
            <div className="truncate flex-1 mx-2">{tagger || "/"}</div>
            <button
              onClick={() => tagger && navigator.clipboard.writeText(tagger)}
              className="btn btn-xs btn-outline"
              title="Copy URL"
            >
              {t("copy")}
            </button>
          </div>

          <div className="mb-2">
            <span className="font-bold">{t("record-type")}:</span> {recordType || "/"}
          </div>
        </div>
      </div>
      {ToastComponent}
    </Layout>
  );
};

export default CreateTaggingRecord;
