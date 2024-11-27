import { assertEquals } from "@std/assert";
import { translate } from "../src/index.ts";

Deno.test("English => Dolphin", () => {
  const input = "hello world";
  const expected = "EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE";
  assertEquals(translate(input), expected);
});

Deno.test("English with domain => Dolphin", () => {
  const input = "hello dolphin.cool world";
  const expected = "EEEE E EeEE EeEE eee dolphin.cool Eee eee EeE EeEE eEE";
  assertEquals(translate(input), expected);
});

Deno.test("English with Emoji => Dolphin", () => {
  const input = "hello 👋👋 world 🌎 🌎 🌎 world";
  const expected =
    "EEEE E EeEE EeEE eee 👋👋 Eee eee EeE EeEE eEE 🌎 🌎 🌎 Eee eee EeE EeEE eEE";
  assertEquals(translate(input), expected);
});

Deno.test("English with URL => Dolphin", () => {
  const input = "check out this link https://example.com its great";
  const expected =
    "eEeE EEEE E eEeE eEe eee EEe e e EEEE EE EEE EeEE EE eE eEe https://example.com EE e EEE eeE EeE E Ee e";
  assertEquals(translate(input), expected);
});

Deno.test("English with custom filter => Dolphin", () => {
  const input = "what the heck";
  const expected = "Eee EEEE Ee e e EEEE E eEEE eee eEEE eEEE Ee";
  assertEquals(
    translate(input, {
      customFilter: { pattern: /heck/g, replacement: "bobba" },
    }),
    expected,
  );
});

Deno.test("English with censored word => Dolphin", () => {
  const input = "lets fucking go";
  const expected = `EeEE E e EEE EEeE EeEE EE EeeE EeeE EE eE eeE eeE eee`;
  assertEquals(translate(input, { swearFilter: true }), expected);
});

Deno.test("English with uncensored word => Dolphin", () => {
  const input = "lets fucking go";
  const expected = `EeEE E e EEE EEeE EEe eEeE eEe EE eE eeE eeE eee`;
  assertEquals(translate(input), expected);
});

Deno.test("English with line breaks => Dolphin", () => {
  const input = "hello\n\nworld\nmultiline";
  const expected =
    "EEEE E EeEE EeEE eee\n\nEee eee EeE EeEE eEE\nee EEe EeEE e EE EeEE EE eE E";
  assertEquals(translate(input), expected);
});

Deno.test("English with multiline => Dolphin", () => {
  const input = `hello

world
multiline`;
  const expected = `EEEE E EeEE EeEE eee

Eee eee EeE EeEE eEE
ee EEe EeEE e EE EeEE EE eE E`;
  assertEquals(translate(input), expected);
});

Deno.test("English with username => Dolphin", () => {
  const input = "follow me @anondolphin on finspace";
  const expected =
    "EEeE eee EeEE EeEE eee Eee ee E @anondolphin eee eE EEeE EE eE EEE EeeE Ee eEeE E";
  assertEquals(translate(input), expected);
});

Deno.test("English with complex sentence => Dolphin", () => {
  const input =
    "follow-me @anondolphin on-finspace-and-check-out dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  const expected =
    "EEeE eee EeEE EeEE eee Eee eEEEEe ee E @anondolphin eee eE eEEEEe EEeE EE eE EEE EeeE Ee eEeE E eEEEEe Ee eE eEE eEEEEe eEeE EEEE E eEeE eEe eEEEEe eee EEe e dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  assertEquals(translate(input), expected);
});
