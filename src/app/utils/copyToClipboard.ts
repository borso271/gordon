const copyToClipboard = (assistantText: string): void => {
  navigator.clipboard
    .writeText(assistantText)
    .then(() => {
      console.log("Copied to clipboard!");
    })
    .catch((err: unknown) => {
      console.error("Failed to copy text:", err);
    });
};

export default copyToClipboard;
