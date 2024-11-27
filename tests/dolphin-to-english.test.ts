import { assertEquals } from "@std/assert";
import { translate } from "../src/index.ts";

Deno.test("Dolphin => English", () => {
  const input = "EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE";
  const expected = "helloworld";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with domain => English", () => {
  const input = "EEEE E EeEE EeEE eee dolphin.cool Eee eee EeE EeEE eEE";
  const expected = "hello dolphin.cool world";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with Emoji => English", () => {
  const input =
    "EEEE E EeEE EeEE eee 👋👋 Eee eee EeE EeEE eEE 🌎 🌎 🌎 Eee eee EeE EeEE eEE";
  const expected = "hello 👋👋 world 🌎 🌎 🌎 world";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with URL => English", () => {
  const input =
    "eEeE EEEE E eEeE eEe eee EEe e e EEEE EE EEE EeEE EE eE eEe https://example.com EE e EEE eeE EeE E Ee e";
  const expected = "checkoutthislink https://example.com itsgreat";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with custom filter => English", () => {
  const input = "Eee EEEE Ee e e EEEE E EEEE E eEeE eEe";
  const expected = "whatthebobba";
  assertEquals(
    translate(input, {
      customFilter: { pattern: /heck/g, replacement: "bobba" },
    }),
    expected,
  );
});

Deno.test("Dolphin with censored word => English", () => {
  const input = "EeEE E e EEE EEeE EeEE EE EeeE EeeE EE eE eeE eeE eee";
  const expected = "letsflippinggo";
  assertEquals(translate(input, { swearFilter: true }), expected);
});

Deno.test("Dolphin with uncensored word => English", () => {
  const input = "EeEE E e EEE EEeE EEe eEeE eEe EE eE eeE eeE eee";
  const expected = "letsfuckinggo";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with line breaks => English", () => {
  const input =
    "EEEE E EeEE EeEE eee\n\nEee eee EeE EeEE eEE\nee EEe EeEE e EE EeEE EE eE E";
  const expected = "hello\n\nworld\nmultiline";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with multiline => English", () => {
  const input = `EEEE E EeEE EeEE eee

Eee eee EeE EeEE eEE
ee EEe EeEE e EE EeEE EE eE E`;
  const expected = `hello

world
multiline`;
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with username => English", () => {
  const input =
    "EEeE eee EeEE EeEE eee Eee ee E @anondolphin eee eE EEeE EE eE EEE EeeE Ee eEeE E";
  const expected = "followme @anondolphin onfinspace";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with complex sentence => English", () => {
  const input =
    "EEeE eee EeEE EeEE eee Eee eEEEEe ee E @anondolphin eee eE eEEEEe EEeE EE eE EEE EeeE Ee eEeE E eEEEEe Ee eE eEE eEEEEe eEeE EEEE E eEeE eEe eEEEEe eee EEe e dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  const expected =
    "follow-me @anondolphin on-finspace-and-check-out dolphin.cool 🐬🐬🐬 🐬🐬 🐬 https://dolphin.cool/some/long/url/to/nowhere.html";
  assertEquals(translate(input), expected);
});

Deno.test("Dolphin with channel => English", () => {
  const input =
    "EeEE E e EEE e Ee EeEE eEe eee eE /dolphin-zone EeEE Ee e E EeE e eee eEE Ee eEee";
  const expected = "letstalkon /dolphin-zone latertoday";
  assertEquals(translate(input), expected);
});
