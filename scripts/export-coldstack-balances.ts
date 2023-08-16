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

const accounts = await apiAt.query.coldStack.balances.entries();

const kvs = Object.fromEntries(accounts.map(([k, v])=>[k.toHuman()[0], v.toHuman().replaceAll(",", "")]));

const json = JSON.stringify(kvs, '', '  ');

console.log(json);

Deno.writeTextFileSync("coldStack.balances.json", json);

Deno.exit();
// Deno.serve((req: Request) => new Response(json));
