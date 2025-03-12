const shareContent = (assistantText) => {
    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: "Check this out!",
        text: assistantText,
      })
      .then(() => console.log("Content shared successfully!"))
      .catch((err) => console.error("Error sharing content:", err));
    } else {
      // Fallback to copying if sharing is not available
      console.log("Web Share API not supported, copying to clipboard instead.");
      navigator.clipboard.writeText(assistantText)
        .then(() => console.log("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy text:", err));
    }
  };
  
  export default shareContent;
  