import { dolphinMap, dolphinSwearMap } from "./language-map.ts";

export interface FilterOptions {
  direction?: "toDolphin" | "fromDolphin";
  swearFilter?: boolean;
  customFilter?: {
    pattern: RegExp;
    replacement: string;
  };
}

const reverseDolphinMap = Object.fromEntries(
  Object.entries(dolphinMap).map(([k, v]) => [v, k]),
);

const FILTER_PATTERN_SWEAR = new RegExp(
  Object.keys(dolphinSwearMap).join("|"),
  "gi",
);

const PATTERNS = [
  /(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,}(\/\S*)?/gi, // URL
  /\p{Extended_Pictographic}/gu, // Emoji
  /([a-z0-9-]+\.)+[a-z]{2,}/gi, // Domain
  /@[a-zA-Z0-9][a-zA-Z0-9_.-]*/g, // Username
];

export function translate(input: string, options?: FilterOptions): string {
  // Auto-detect direction if not provided
  const direction = options?.direction || detectLanguage(input);

  // Core translation
  if (direction === "toDolphin") {
    const cleanedInput = formatAndCleanInput(input, options);
    return encodeDolphin(cleanedInput);
  } else {
    const translated = decodeDolphin(input);
    return formatAndCleanInput(translated, options);
  }
}

function detectLanguage(input: string): "toDolphin" | "fromDolphin" {
  const totalChars = input.length;
  if (totalChars === 0) return "toDolphin";

  const eCount = (input.match(/E/g) || []).length;
  const spaceCount = (input.match(/ /g) || []).length;

  // Calculate ratios
  const eRatio = eCount / totalChars;
  const spaceRatio = spaceCount / totalChars;

  // Dolphin text typically has >25% E's and >20% spaces
  return (eRatio > 0.25 && spaceRatio > 0.16) ? "fromDolphin" : "toDolphin";
}

function formatAndCleanInput(input: string, options?: FilterOptions): string {
  if (!options) return input;

  let output = input;

  // Apply swear filter
  if (options?.swearFilter) {
    output = output.replace(FILTER_PATTERN_SWEAR, (match) => {
      return dolphinSwearMap[match.toLowerCase()] || match;
    });
  }

  // Apply custom filter if provided
  if (options?.customFilter) {
    output = output.replace(
      options.customFilter.pattern,
      options.customFilter.replacement,
    );
  }

  return output;
}

function isWhitespace(char: string): boolean {
  if (char === "e" || char === "E") return false;
  return char === " " || char === "\n" || char === "\r";
}

function encodeDolphin(input: string): string {
  let output = "";
  let i = 0;

  while (i < input.length) {
    // Check for special patterns (URLs, emojis, domains, usernames)
    let matched = false;
    for (const pattern of PATTERNS) {
      const match = input.slice(i).match(pattern);
      if (match?.[0] && input.slice(i).indexOf(match[0]) === 0) {
        output += match[0];
        i += match[0].length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Handle regular characters
    const char = input[i].toLowerCase();
    if (dolphinMap[char]) {
      const lastChar = output[output.length - 1];
      const needsSpace = output && !isWhitespace(lastChar);
      output += needsSpace ? " " : "";
      output += dolphinMap[char];
    } else if (isWhitespace(char)) {
      // Preserve whitespace characters
      output += char;
    }
    i++;
  }

  return output.trim();
}

function decodeDolphin(input: string): string {
  let output = "";
  const words = input.split(/(?<=\n)|(?=\n)|[ ]/).filter((word) => word !== "");

  for (const word of words) {
    if (reverseDolphinMap[word]) {
      output += reverseDolphinMap[word];
    } else if (isWhitespace(word)) {
      output += word;
    } else {
      let txt;
      for (const pattern of PATTERNS) {
        if (word.match(pattern)) {
          txt = word;
          break;
        }
      }
      if (txt) {
        output += output[output.length - 1] === " " ? "" : " ";
        output += txt;
        output += " ";
      } else {
        output += "?";
      }
    }
  }

  return output.trim();
}
