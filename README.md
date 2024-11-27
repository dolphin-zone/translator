# 🐬 Dolphin Speak Translator

A fun translator that converts text between human language and dolphinspeak.

## Installation

```sh
npm i @dolphin-zone/translator
```

## Usage

### `translate(input: string, options?: FilterOptions): string`

The main translation function that converts text between human language and
dolphinspeak. It automatically detects the input language using `isDolphin()`
unless explicitly specified in the options.

- If the input is detected as dolphinspeak, it translates to human language
- If the input is detected as human language, it translates to dolphinspeak
- Preserves special elements like URLs, emojis, domains, usernames and channels

### `isDolphin(input: string): boolean`

Helper function that detects whether text is dolphinspeak by analyzing its
pattern:

- Returns `true` if the input matches dolphinspeak patterns (sequences of 'E'
  and 'e')
- Returns `false` for human language text
- Used internally by `translate()` for automatic language detection
- Useful for user interfaces to show which language is being used

### Examples

```js
import { isDolphin, translate } from "@dolphin-zone/translator";

console.log(translate("helloworld"));
// EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE

console.log(translate("EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE"));
// helloworld

console.log(isDolphin("helloworld"));
// false

console.log(isDolphin("EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE"));
// true
```

## Options for Translation

The `translate` function accepts an optional `options` parameter that allows you
to customize the translation behavior. The `FilterOptions` interface includes
the following properties:

- `toDolphin`: A boolean indicating whether to translate to dolphinspeak. If not
  specified, the function auto-detects the direction.
- `swearFilter`: A boolean to enable or disable the filtering of swear words.
- `customFilter`: An object with `pattern` (a `RegExp`) and `replacement` (a
  `string`) to apply custom text replacements.

### Examples

```js
import { translate } from "@dolphin-zone/translator";

console.log(translate("This is a fucking test", { swearFilter: true }));
// e EEEE EE EEE EE EEE Ee EEeE EeEE EE EeeE EeeE EE eE eeE e E EEE e

console.log(translate("Visit my site at example.com", {
  customFilter: {
    pattern: /example\.com/g,
    replacement: "dolphin.cool",
  },
}));
// EEEe EE EEE EE e ee eEee EEE EE e E Ee e dolphin.cool

console.log(translate("hello world", { toDolphin: true }));
// EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE
```

## License

MIT
