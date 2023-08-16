#!/usr/bin/env -S deno run -A

import {
  hexToU8a,
  u8aConcat,
  u8aToHex,
  u8aToU8a,
} from "https://deno.land/x/polkadot@0.2.41/util/mod.ts";
import {
  blake2AsHex,
  blake2AsU8a,
  xxhashAsU8a,
} from "https://deno.land/x/polkadot@0.2.41/util-crypto/mod.ts";
import { TypeRegistry } from "https://deno.land/x/polkadot@0.2.41/types/create/index.ts";

let registry = new TypeRegistry();

export type HasherInput = Uint8Array;

export type HasherFunction = (data: HasherInput) => Uint8Array;

const DEFAULT_FN = (data: HasherInput): Uint8Array => xxhashAsU8a(data, 128);

export const HASHERS = {
  Blake2_128: (data: HasherInput) =>
    // eslint-disable-line camelcase
    blake2AsU8a(data, 128),
  Blake2_128Concat: (data: HasherInput) =>
    // eslint-disable-line camelcase
    u8aConcat(blake2AsU8a(data, 128), u8aToU8a(data)),
  Blake2_256: (data: HasherInput) =>
    // eslint-disable-line camelcase
    blake2AsU8a(data, 256),
  Identity: (data: HasherInput) => u8aToU8a(data),
  Twox128: (data: HasherInput) => xxhashAsU8a(data, 128),
  Twox256: (data: HasherInput) => xxhashAsU8a(data, 256),
  Twox64Concat: (data: HasherInput) =>
    u8aConcat(xxhashAsU8a(data, 64), u8aToU8a(data)),
};

export function blake2_128Concat(data: `0x${string}`): string {
  return u8aToHex(HASHERS.Blake2_128Concat(
    registry.createType("Bytes", data).toU8a(),
  ));
}

let balances = Deno.readTextFileSync("genesis.raw.top.coldStack.balances.json");

let kvs = Object.entries(JSON.parse(balances));

let rawKvs = kvs.map(([k, v]) => [
  u8aToHex(
    u8aConcat(
      HASHERS.Twox128(`ColdStack`),
      HASHERS.Twox128(`Balances`),
      hexToU8a(blake2_128Concat(k)),
    ),
  ),
  u8aToHex(registry.createType("u128", v).toU8a()),
]);

// console.error(Object.fromEntries(rawKvs.slice(0, 1)))

let rawJSON = Deno.readTextFileSync("./build/raw.json");

let raw = JSON.parse(rawJSON);

rawKvs.forEach(([k, v]) => {
  raw.genesis.raw.top[k] = v;
});

console.log(JSON.stringify(raw, null, "  "));
