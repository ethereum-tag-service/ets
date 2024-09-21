import { QuestionMark } from "@app/components/icons";
import type { TagInput as TagInputType } from "@app/types/tag";
import { isValidTag } from "@app/utils/tagUtils";
import useTranslation from "next-translate/useTranslation";
import type React from "react";
import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

interface TagInputProps {
  tags: TagInputType[];
  handleDeleteTag: (i: number) => void;
  handleAddTag: (tag: TagInputType) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, handleDeleteTag, handleAddTag }) => {
  const { t } = useTranslation("common");
  const [tagInput, setTagInput] = useState<string>("");

  return (
    <div className="mb-4 w-full">
      <div className="relative">
        <ReactTags
          tags={tags}
          handleDelete={handleDeleteTag}
          handleAddition={(tag) => {
            setTagInput("");
            handleAddTag(tag);
          }}
          inputValue={tagInput}
          classNames={{
            tags: "flex flex-wrap gap-1",
            tag: "text-sm font-medium inline-block py-1 px-2 rounded link-primary bg-primary-content mt-2 last:mr-0 mr-1",
            tagInput: "input input-bordered w-full pr-10",
            tagInputField: "input input-bordered w-full pr-10",
            selected: "flex flex-wrap gap-1",
            remove: "btn btn-ghost btn-xs",
            suggestions: "dropdown dropdown-bottom",
            activeSuggestion: "bg-primary text-primary-content cursor-pointer",
            editTagInput: "input input-bordered w-full pr-10",
            editTagInputField: "input input-bordered w-full pr-10",
            clearAll: "btn btn-ghost btn-xs",
          }}
          handleInputChange={setTagInput}
          delimiters={delimiters}
          placeholder="Enter tags (e.g. #Tokenize, #love)"
          inputFieldPosition="bottom"
          autocomplete
        />
        <div
          className="tooltip tooltip-left md:tooltip-top absolute flex justify-center items-center"
          data-tip="Press enter, comma or tab to add tags"
          style={{ top: "50%", right: "0.5rem", transform: "translateY(-50%)" }}
        >
          <QuestionMark color="#db2777" size={26} />
        </div>
      </div>
      {tagInput && !isValidTag(tagInput) && tagInput !== "#" && (
        <div className="text-error mt-1 text-xs">{t("invalid-tag-message")}</div>
      )}
    </div>
  );
};

export default TagInput;
