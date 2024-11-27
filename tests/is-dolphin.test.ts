import { assertEquals } from "@std/assert";
import { isDolphin } from "../src/index.ts";

Deno.test("English 100%", () => {
  const input = "hello world";
  assertEquals(isDolphin(input), false);
});

Deno.test("English with domain", () => {
  const input = "hello dolphin.cool world";
  assertEquals(isDolphin(input), false);
});

Deno.test("English with a lot of e's", () => {
  const input = `eager beekeepers determinedly preserve serene evergreen trees`;
  assertEquals(isDolphin(input), false);
});

Deno.test("Dolphin 100%", () => {
  const input = "EEEE E EeEE EeEE eee Eee eee EeE EeEE eEE";
  assertEquals(isDolphin(input), true);
});

Deno.test("Dolphin with domain", () => {
  const input = "EEEE E EeEE EeEE dolphin.cool eee Eee eee EeE EeEE eEE";
  assertEquals(isDolphin(input), true);
});

Deno.test("Dolphin with really long domain", () => {
  const input = "EEEE E EeEE EeEE this-is-a-really-long-domain.com";
  assertEquals(isDolphin(input), true);
});

Deno.test("Dolphin with emoji", () => {
  const input = "EEEE E EeEE EeEE 👋👋 👋 👋";
  assertEquals(isDolphin(input), true);
});
