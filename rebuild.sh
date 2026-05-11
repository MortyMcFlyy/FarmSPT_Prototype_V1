#!/usr/bin/env bash

SERVICE="${1}"

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

cd "${SCRIPT_DIR}" || exit

docker compose --env-file .env up \
    --build \
    --remove-orphans \
    --force-recreate \
    --no-deps \
    -d "${SERVICE}"
