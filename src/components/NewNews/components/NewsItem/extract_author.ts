function extractWebsiteName(url: string): string {
    // Default value if no valid name is found
    const defaultName = "Trusted Source";
  
    // Regular expression to match a domain before common TLDs (.com, .org, .co, .io, etc.)
    const match = url.match(/\/\/(?:www\.)?(?:([\w-]+)\.)?([\w-]+)\.(com|org|co|io|net|gov|edu|info|uk|us)/);
  
    // If a match is found, return the second capturing group (main domain)
    return match ? match[2] : defaultName;
  }
  export function formatAuthor(author: string | null | undefined, url: string): string {
    if (author && author.trim().length > 0) {
      const cleanedAuthor = author.includes(",")
        ? author.split(",")[0].trim()
        : author.trim();
  
      return cleanedAuthor
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  
    return extractWebsiteName(url);
  }
  