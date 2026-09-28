#!/usr/bin/env bash
# What a stranger can get from the site, checked the way a stranger would.
#
#   bash .github/scripts/leak-check.sh keys      the repo: nothing shaped like a secret key (no network)
#   bash .github/scripts/leak-check.sh private   the live site: nothing .vercelignore leaves out answers
#   bash .github/scripts/leak-check.sh full      the live site: all of it, once it serves this commit
#
# SITE overrides the address (default https://datein5days.com). Run by auto-ship.yml (keys,
# before every merge) and leak-check.yml (private and full). Exits non-zero on any finding.
#
# It asks like a visitor: one request at a time with a pause, a name in the User-Agent, and never
# a path scanners try (/.env, /.git/...). The first version did try them, and Vercel's firewall
# took it for an attacker: everything after answered 403. A 403 proves nothing either way, so
# anything but the expected answer fails the run as unchecked, never passes it.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
SITE="${SITE:-https://datein5days.com}"
MODE="${1:-full}"
PAUSE="${PAUSE:-0.3}"
fail=0
bad() { echo "::error::$*"; fail=1; }
get() { sleep "$PAUSE"; curl -s -A "datein5days-leak-check (GitHub Actions)" --max-time 20 "$@"; }
status() { get -o /dev/null -w "%{http_code}" "$SITE$1"; }

# Key shapes that are never meant to be public. PostHog's phc_ key is (it can only send events),
# and so is the Apps Script /exec URL, so neither is here.
KEYS='phx_[A-Za-z0-9]{20,}|\b[sr]k_(live|test)_[A-Za-z0-9]{10,}|\bsk-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY'
KEYS+='|\bghp_[A-Za-z0-9]{36}|\bgithub_pat_[A-Za-z0-9_]{20,}|\bxox[abprs]-[A-Za-z0-9-]{10,}|\bAKIA[0-9A-Z]{16}'
KEYS+='|\bya29\.[A-Za-z0-9_-]{20,}|"(refresh_token|client_secret|private_key)"[[:space:]]*:'
TEXT='\.(html|js|mjs|css|json|md|txt|xml|yml|yaml|svg|sh|gs)$'

if [ "$MODE" = keys ]; then
  while IFS= read -r f; do
    grep -nEo "$KEYS" "$f" | while IFS=: read -r line hit; do
      echo "::error file=$f,line=$line::Key-shaped text (${hit:0:8}...). Keys never go in the repo: keep them in GitHub or Apps Script secrets, and rotate this one."
    done | grep . && fail=1
  done < <(git ls-files | grep -E "$TEXT")
  [ $fail = 0 ] && echo "keys: nothing key-shaped in $(git ls-files | grep -cE "$TEXT") text files"
  exit $fail
fi

# The root names .vercelignore lets through; everything else in the repo stays off the site.
allow=$(sed -n 's#^!/\{0,1\}\([^/]*\).*#\1#p' .vercelignore | sort -u)
public() { printf '%s\n' "$allow" | grep -qxF "${1%%/*}"; }
# served files to compare against the live site. vercel.json is config, 404.html the error page.
served=$(git ls-files | while IFS= read -r f; do public "$f" && [ "$f" != vercel.json ] && [ "$f" != 404.html ] && echo "$f"; done)
# private files to ask for, minus dotfiles: /.gitignore reads like a scanner, and whatever would
# serve those (a lost .vercelignore) serves context.md too
private=$(git ls-files | grep -vE '(^|/)\.' | while IFS= read -r f; do public "$f" || echo "$f"; done)
# the pages vercel.json rewrites to, /c/01 first
pages=$(node -e 'for (const r of require("./vercel.json").rewrites || []) if (!/[:(*]/.test(r.source)) console.log(r.source)')

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
# each served file is fetched once per look: compared with this commit, then scanned for keys
fetch_served() { for f in $served; do mkdir -p "$tmp/$(dirname "$f")"; get -o "$tmp/$f" "$SITE/$f"; done; }
stale_files() { for f in $served; do cmp -s "$tmp/$f" "$f" || echo "$f"; done; }
# what the live /c/01 lacks of vercel.json's headers (the microphone still allowed: voice answers
# need it), or "status N" when it couldn't be read at all
missing_headers() {
  local h code want
  h=$(get -I "$SITE/c/01" | tr -d '\r' | tr '[:upper:]' '[:lower:]')
  code=$(printf '%s\n' "$h" | sed -n '1s#^http/[0-9.]* \([0-9]*\).*#\1#p')
  [ "$code" = 200 ] || { echo "status ${code:-none}"; return; }
  for want in "content-security-policy: .*frame-ancestors" "x-content-type-options: nosniff" "x-frame-options: " \
              "referrer-policy: " "permissions-policy: .*microphone=\(self\)" "strict-transport-security: max-age="; do
    printf '%s\n' "$h" | grep -qE "^$want" || echo "$want"
  done
}

c=$(status /c/01)
[ "$c" = 200 ] || { echo "::error::$SITE/c/01 answers $c, so nothing here would prove anything."; exit 1; }

# 1. Full runs wait for the deploy: every served file matches this commit and the headers are on.
#    Files alone can't tell: a merge that only changes vercel.json leaves every page as it was.
if [ "$MODE" = full ]; then
  for i in $(seq 1 "${WAIT_TRIES:-16}"); do
    [ "$i" = 1 ] || sleep 15
    fetch_served
    stale=$(stale_files)
    missing=$(missing_headers)
    [ -z "$stale$missing" ] && break
    echo "waiting for the deploy, not live yet: $(echo $stale)${missing:+ (headers)}"
  done
  [ -n "$stale" ] && bad "The live site isn't serving this commit: $(echo $stale). A failed deploy, a rollback, or a file .vercelignore doesn't name."
fi

# 2. Nothing else in the repo is served: each one a plain 404.
odd=0
for f in $private; do
  c=$(status "/$f")
  case "$c" in
    404) ;;
    2*) bad "LEAK: /$f answers $c. It must 404: don't add it to the .vercelignore allowlist."; odd=$((odd + 1)) ;;
    *) bad "UNCHECKED: /$f answers $c, not 404, so this run proves nothing about it (a firewall block, or the site is down)."; odd=$((odd + 1)) ;;
  esac
done
[ $odd = 0 ] && echo "private: $(echo $private | wc -w) repo files, every one a 404"
if [ "$MODE" = private ]; then exit $fail; fi

# 3. The pages answer.
for p in $pages; do
  c=$(status "$p"); [ "$c" = 200 ] || bad "DOWN: $p answers $c"
done

# 4. Nothing served looks like a key.
for f in $served; do
  [[ "$f" =~ $TEXT ]] || continue
  hit=$(grep -oE "$KEYS" "$tmp/$f" | head -1)
  [ -n "$hit" ] && bad "KEY-SHAPED text served at /$f (${hit:0:8}...). Take it off the page and rotate it."
done

# 5. The headers, as last seen in step 1.
while IFS= read -r want; do
  case "$want" in
    "") ;;
    status*) bad "UNCHECKED: /c/01's headers couldn't be read ($want)." ;;
    *) bad "HEADER missing or changed: $want" ;;
  esac
done <<< "$missing"

[ $fail = 0 ] && echo "clean: $SITE serves this commit, nothing private, no keys, headers on"
exit $fail
