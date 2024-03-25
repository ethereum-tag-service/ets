export const isValidTag = (tag?: string) => {
  if (!tag) {
    return false;
  }

  if (!tag.startsWith("#")) {
    return false;
  }

  const tagWithoutHashtag = tag.slice(1);
  if (tagWithoutHashtag.includes(" ")) {
    return false;
  }

  const minLength = 2;
  const maxLength = 32;
  if (tagWithoutHashtag.length < minLength || tagWithoutHashtag.length > maxLength) {
    return false;
  }

  return true;
};

export const invalidTagMsg =
  "Invalid tag format. Tags must start with a #, contain no spaces, and be between 2 and 32 characters long (excluding the #).";
