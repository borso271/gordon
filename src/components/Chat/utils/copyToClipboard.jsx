

const copyToClipboard = (assistantText) => {
  console.log("We arrive here");
  navigator.clipboard.writeText(assistantText).then(() => {
    console.log("Copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy text:", err);
  });
};

export default copyToClipboard

