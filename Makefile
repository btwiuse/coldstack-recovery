all: raw.json
	#
	# 6. done
	#
	echo "coldstack --chain=./build/raw.json --tmp --validator --alice --rpc-cors=all"

raw.json: patch.json
	#
	# 5. generating ./build/raw.json
	#
	coldstack build-spec --chain=./build/patch.json --raw --disable-default-bootnode > ./build/raw.json

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
