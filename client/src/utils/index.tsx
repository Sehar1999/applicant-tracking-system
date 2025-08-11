const jwtDecode = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const getCapitalizeAndRemoveHyphen = (attachment: string) => {
  return attachment
    ?.split("-")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(" ");
};

export const transformSentence = (sentence: string) => {
  const words = sentence.split(" ");

  const transformedWords = words.map((word, index) => {
    if (index === 0) {
      return word.charAt(0) + word.slice(1).toLowerCase();
    } else {
      return word.toLowerCase();
    }
  });

  const transformedSentence = transformedWords.join(" ");

  return transformedSentence;
};

export const getFileNameFromUrl = (fileUrl: string): string => {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    // Remove any query parameters and get the filename
    const fileName = lastPart.split("?")[0];
    // Remove timestamp prefix if present (format: timestamp-filename.ext)
    const parts = fileName.split("-");
    if (parts.length > 1) {
      // Check if first part is a timestamp (numeric)
      if (!isNaN(Number(parts[0]))) {
        return parts.slice(1).join("-");
      }
    }
    return fileName;
  } catch {
    return "Unknown file";
  }
};