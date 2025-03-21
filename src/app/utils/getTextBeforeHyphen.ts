export function getTextBeforeHyphen(input: string): string  {
    if (typeof input === "string" && input.includes("-")) {
      return input.split("-")[0].trim();
    }
    return input;
  }
  