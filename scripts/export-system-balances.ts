#!/usr/bin/env -S deno run -A

import {
  ApiPromise,
  WsProvider,
} from "https://deno.land/x/polkadot@0.2.41/api/mod.ts";

async function initApi() {
  // const PROVIDER = Deno.env.get("PROVIDER") ?? "wss://coldstack.ufo.k0s.io";
  const PROVIDER = Deno.env.get("PROVIDER") ?? "ws://localhost:9944";
  const provider = new WsProvider(PROVIDER);
  const types = {
    "Gateway": {
      "address": "Vec<u8>",
      "seedAddress": "Option<Vec<u8>>",
      "storage": "u8"
    }
};
  return await ApiPromise.create({ provider, types });
}

console.log("api is initializing. Please hold on...");

const api = await initApi();

const blockHeight = 8000000;

const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

// const apiAt = await api.at(blockHash);
const apiAt = api;

const date = new Date((await apiAt.query.timestamp.now()).toNumber());

console.log(date);

const accounts = await apiAt.query.system.account.entries();

const kvs = Object.fromEntries(accounts.map(([k, v])=>[k.toHuman()[0], v.data.free.toBigInt().toString()]));

const json = JSON.stringify(kvs, '', '  ');

console.log(json);

Deno.writeTextFileSync("system.balances.json", json);

Deno.exit();
// Deno.serve((req: Request) => new Response(json));
//
/*
 * let x = {
  "5FpZpbVC5gzV5QB965o9ob6AZB5kh8T3uw8bGdyabHGTnVq6": "0",
  "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY": "29999374999361",
  "5FviQTMcu22GmvqhhQZothTk2gcFwjY1YUQi6swwKUyEtdft": "1152921404231846608",
  "5CZhSbpeeFW6Vew9A21VVAphPVpL3BrAeofhoRCVAfcDxfoq": "49749999656",
  "5E7Zpk5ZXPgELhZmaho3rHPGjSKEyieY19kMT1zanJJK4ftk": "0",
  "5EHesFZL38fJfi9HhRCiWXCmb8mLLeHmrctnFdZh2TqqDabM": "0",
  "5GcDQpUgPumxHV7J5uWA5yU2HMzKTUB2r6Koeb9TwgZQJime": "29999624999639",
  "5EvZqjQCK3XsF7Z17ymfjWSK1CiKWGbJvcyixL7Cwu6uCh89": "0",
  "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY": "39999749999746",
  "5GppjLjVS37MDHeX4YSWGG1TMUhto362RSgvE85mo9iFvfJu": "1152821504231846595",
  "5GBTjow4QC3u7BBYWxkRwMPgvSBVd775ABmkhs7XxJtQe5BG": "49374999164",
  "5D9qczdM5six6Dnp8QXUVzUr1Phdd7nNRiYtdLHQpK3TnidV": "0"
}

console.log(JSON.stringify(Object.entries(x).filter(([k, v])=>v!="0"), null, '  '))
*/
