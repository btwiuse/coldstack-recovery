all: fork.json
	#
	# 7. done
	#
	# You can launch the forked network with the following command if you didn't
	#   make any changes to the default validator set (//Alice)
	#
	@ echo "coldstack --chain=./build/fork.json --tmp --validator --alice --rpc-cors=all"

fork.json: raw.json
	#
	# 6. generating ./build/fork.json
	#
	deno run -A ./scripts/raw.ts > ./build/fork.json

raw.json: patch.json
	#
	# 5. generating ./build/raw.json
	#
	coldstack build-spec --chain=./build/patch.json --raw --disable-default-bootnode | jq -S . > ./build/raw.json

patch.json: template.json
	#
	# 4. generating ./build/patch.json
	#
	deno run -A ./scripts/patch.ts > ./build/patch.json
	deno fmt ./build/patch.json

template.json: dev.json
	#
	# 3. generating ./build/template.json
	#
	deno run -A ./scripts/template.ts > ./build/template.json

dev.json: precheck
	#
	# 2. generating ./build/dev.json and ./build/local.json
	#
	coldstack build-spec --disable-default-bootnode --dev > ./build/dev.json
	coldstack build-spec --disable-default-bootnode > ./build/local.json

precheck:
	#
	# 1. checking that all required commands exist
	#
	which coldstack
	which jq
	which deno
