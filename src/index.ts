/** Mapping of characters to their dolphinspeak equivalents */
export const dolphinMap: { [key: string]: string } = {
  "a": "Ee",
  "b": "eEEE",
  "c": "eEeE",
  "d": "eEE",
  "e": "E",
  "f": "EEeE",
  "g": "eeE",
  "h": "EEEE",
  "i": "EE",
  "j": "Eeee",
  "k": "eEe",
  "l": "EeEE",
  "m": "ee",
  "n": "eE",
  "o": "eee",
  "p": "EeeE",
  "q": "eeEe",
  "r": "EeE",
  "s": "EEE",
  "t": "e",
  "u": "EEe",
  "v": "EEEe",
  "w": "Eee",
  "x": "eEEe",
  "y": "eEee",
  "z": "eeEE",
  "1": "Eeeee",
  "2": "EEeee",
  "3": "EEEee",
  "4": "EEEEe",
  "5": "EEEEE",
  "6": "eEEEE",
  "7": "eeEEE",
  "8": "eeeEE",
  "9": "eeeeE",
  "0": "eeeee",
  ".": "EeEeEe",
  ",": "eeEEee",
  "?": "EEeeEE",
  "/": "eEEeE",
  "!": "eEeeEE",
  "(": "eEeeE",
  ")": "eEeeEe",
  "&": "EeEEE",
  ":": "eeeEEE",
  ";": "eEeEeE",
  "=": "eEEEe",
  "+": "EeEeE",
  "-": "eEEEEe",
  "_": "EEeeEe",
  '"': "EeEEeE",
  "'": "EeeeeE",
  "$": "EEEeEEe",
  "@": "EeeEeE",
  "¿": "EEeeE",
  "¡": "eEeEe",
};

/** Mapping of swear words to their dolphin-friendly alternatives */
export const dolphinSwearMap: { [key: string]: string } = {
  "fucking": "flipping",
  "fucked": "flipped",
  "fucker": "flipper",
  "fuck": "flip",
  "shit": "splash",
  "damn": "dorsal",
  "bitch": "beach",
  "ass": "fin",
  "bastard": "blowhole",
  "crap": "kelp",
  "piss": "squirt",
  "dick": "fluke",
  "cock": "clam",
  "cunt": "coral",
};

export interface FilterOptions {
  toDolphin?: boolean;
  swearFilter?: boolean;
  customFilter?: {
    pattern: RegExp;
    replacement: string;
  };
}

/**
 * Translates text between human and dolphinspeaks
 * @param input The text to translate
 * @param options Optional configuration for translation behavior
 * @returns The translated text
 */
export function translate(input: string, options?: FilterOptions): string {
  // Auto-detect direction if not specified
  const toDolphin = options?.toDolphin ?? !isDolphin(input);

  // Core translation
  if (toDolphin) {
    const cleanedInput = formatAndCleanInput(input, options);
    return encodeDolphin(cleanedInput);
  } else {
    const translated = decodeDolphin(input);
    return formatAndCleanInput(translated, options);
  }
}

/**
 * Detects if input text is in dolphinspeak
 * @param input The text to analyze
 * @returns True if text appears to be dolphinspeak
 */
export function isDolphin(input: string): boolean {
  if (!input) return false;

  // Split into words
  const words = input.split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) return false;

  // Count words that only contain e/E
  const eWords = words.filter((word) => /^[eE]+$/.test(word));
  const regularWords = words.length - eWords.length;

  // Dolphin text has more e-only words than regular words
  return eWords.length > regularWords;
}

/**
 * Applies content filters to input text
 * @param input The text to clean
 * @param options Optional filtering options
 * @returns The cleaned text
 */
function formatAndCleanInput(input: string, options?: FilterOptions): string {
  if (!options) return input;

  let output = input;

  // Apply swear filter
  if (options?.swearFilter) {
    output = output.replace(
      new RegExp(
        Object.keys(dolphinSwearMap).join("|"),
        "gi",
      ),
      (match: string) => {
        return dolphinSwearMap[match.toLowerCase()] || match;
      },
    );
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

/**
 * Checks if a character is whitespace (excluding 'e'/'E')
 * @param char The character to check
 * @returns True if character is whitespace
 */
function isWhitespace(char: string): boolean {
  if (char === "e" || char === "E") return false;
  return char === " " || char === "\n" || char === "\r";
}

/** Regular expression patterns for special text elements */
const PATTERNS = [
  /(https?:\/\/)?([a-z0-9]+\.)+[a-z]{2,}(\/\S*)?/gi, // URL
  /\p{Extended_Pictographic}/gu, // Emoji
  /([a-z0-9-]+\.)+[a-z]{2,}/gi, // Domain
  /@[a-zA-Z0-9][a-zA-Z0-9_.-]*/g, // Username
];

/**
 * Converts human text to dolphinspeak
 * @param input The text to encode
 * @returns The dolphinspeak text
 */
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

/**
 * Converts dolphinspeak back to human text
 * @param input The dolphinspeak text to decode
 * @returns The human language text
 */
function decodeDolphin(input: string): string {
  let output = "";
  const words = input.split(/(?<=\n)|(?=\n)|[ ]/).filter((word) => word !== "");
  const reverseDolphinMap = Object.fromEntries(
    Object.entries(dolphinMap).map(([k, v]) => [v, k]),
  );

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
