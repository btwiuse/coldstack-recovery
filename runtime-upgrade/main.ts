#!/usr/bin/env -S deno run -A

import {
  ApiPromise,
  Keyring,
  WsProvider,
} from "https://deno.land/x/polkadot/api/mod.ts";
import { u8aToHex } from "https://deno.land/x/polkadot/util/mod.ts";
import { sendAndInclude } from "./sendAndInclude.ts";

// let providerAddress = "wss://blockchain-ws.coldstack.io";

// coldstack --dev --tmp --alice
let providerAddress = "ws://127.0.0.1:9944";

let api = await ApiPromise.create({
  provider: new WsProvider(providerAddress),
  noInitWarn: true,
});

const keyring = new Keyring({ type: "sr25519", ss58Format: 42 });

console.log(api.isConnected);

console.log(keyring);

const sudoKey = Deno.env.get("SUDO_KEY") ?? "//Alice";

console.log(sudoKey);

const sudo = keyring.createFromUri(sudoKey);

console.log(sudo.toJson());

console.log(Deno.args);

const wasmPath = Deno.args[0] ?? "compressed.wasm";

const wasmHex = u8aToHex(Deno.readFileSync(wasmPath));

// const tx = api.tx.sudo.sudo(api.tx.system.remark(''))

const tx = api.tx.sudo.sudo(
  api.tx.scheduler.scheduleAfter(5, null, 0, api.tx.system.setCode(wasmHex)),
);

await sendAndInclude(tx, sudo);
