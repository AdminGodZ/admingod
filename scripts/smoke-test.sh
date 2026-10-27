#!/usr/bin/env bash
# Checks a running site container. Usage: scripts/smoke-test.sh http://localhost:8080
set -euo pipefail

base_url="${1:?usage: smoke-test.sh <base-url>}"
failures=0

for _ in $(seq 1 30); do
  curl -fs -o /dev/null "$base_url/" && break
  sleep 1
done

# expect <path> <status> [text the body must contain]
expect() {
  local path="$1" status="$2" needle="${3:-}"
  local body actual
  body="$(mktemp)"
  actual="$(curl -s -o "$body" -w "%{http_code}" "$base_url$path")"

  if [[ "$actual" != "$status" ]]; then
    echo "FAIL $path: expected $status, got $actual"
    failures=$((failures + 1))
  elif [[ -n "$needle" ]] && ! grep -q "$needle" "$body"; then
    echo "FAIL $path: body is missing \"$needle\""
    failures=$((failures + 1))
  else
    echo "ok   $path -> $actual"
  fi
  rm -f "$body"
}

expect / 200 "AdminGod"
expect /contact 200 "<form"
expect /contact/ 200 "<form"
expect /sitemap.xml 200 "<urlset"
expect /robots.txt 200 "Sitemap:"
expect /favicon.ico 200
expect /research 404
expect /does-not-exist 404 "<html"

asset="$(curl -s "$base_url/" | grep -o '/_astro/[^"]*\.css' | head -n 1)"
if [[ -z "$asset" ]]; then
  echo "FAIL no /_astro CSS asset referenced from /"
  failures=$((failures + 1))
elif ! curl -sI "$base_url$asset" | grep -qi "cache-control: public, max-age=31536000, immutable"; then
  echo "FAIL $asset is not served with immutable caching"
  failures=$((failures + 1))
else
  echo "ok   $asset is cached immutably"
fi

if ! curl -sI "$base_url/" | grep -qi "x-content-type-options: nosniff"; then
  echo "FAIL security headers are missing"
  failures=$((failures + 1))
else
  echo "ok   security headers present"
fi

if ((failures > 0)); then
  echo "$failures smoke check(s) failed"
  exit 1
fi
echo "All smoke checks passed"
