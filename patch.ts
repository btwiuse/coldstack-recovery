#!/usr/bin/env -S deno run -A

let templateJSON = Deno.readTextFileSync("template.json");

let template = JSON.parse(templateJSON);

let patched = JSON.stringify(template, null, "  ");

let patches = [
  "genesis.runtime.balances.balances",
  "genesis.runtime.session.keys",
  "genesis.runtime.validatorSet.validators",
  "genesis.runtime.sudo.key",
  "genesis.runtime.coldStack.key",
  "genesis.runtime.coldStack.totalIssuance",
];

for (let p of patches) {
  patched = patched.replace(`"${p}"`, Deno.readTextFileSync(`${p}.json`));
}

console.log(patched);
