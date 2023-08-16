#!/usr/bin/env -S deno run -A

let devJSON = Deno.readTextFileSync("./build/dev.json");

let dev = JSON.parse(devJSON);

dev.name = "ColdStack";
dev.id = "coldstack";
dev.chainType = "Live";
dev.protocolId = "coldstack";

dev.genesis.runtime.balances.balances = "genesis.runtime.balances.balances";
dev.genesis.runtime.session.keys = "genesis.runtime.session.keys";
dev.genesis.runtime.validatorSet.validators =
  "genesis.runtime.validatorSet.validators";
dev.genesis.runtime.sudo.key = "genesis.runtime.sudo.key";
dev.genesis.runtime.coldStack.key = "genesis.runtime.coldStack.key";
dev.genesis.runtime.coldStack.totalIssuance =
  "genesis.runtime.coldStack.totalIssuance";

console.log(JSON.stringify(dev, null, "  "));
