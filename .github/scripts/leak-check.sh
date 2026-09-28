#!/usr/bin/env bash
# What a stranger can get from the site, checked the way a stranger would.
#
#   bash .github/scripts/leak-check.sh keys      the repo: nothing shaped like a secret key (no network)
#   bash .github/scripts/leak-check.sh private   the live site: nothing .vercelignore leaves out answers
#   bash .github/scripts/leak-check.sh full      the live site: all of it, once it serves this commit
#
# SITE overrides the address (default https://datein5days.com). Run by auto-ship.yml (keys,
# before every merge) and leak-check.yml (private and full). Exits non-zero on any finding.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
SITE="${SITE:-https://datein5days.com}"
MODE="${1:-full}"
fail=0
bad() { echo "::error::$*"; fail=1; }
status() { curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$SITE$1"; }

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
private=$(git ls-files | while IFS= read -r f; do public "$f" || echo "$f"; done)

c=$(status /c/01)
[ "$c" = 200 ] || { echo "::error::$SITE/c/01 answers $c, so nothing here would prove anything."; exit 1; }

# 1. Full runs wait for the deploy: every served file matches this commit.
if [ "$MODE" = full ]; then
  for i in $(seq 1 "${WAIT_TRIES:-20}"); do
    stale=$(for f in $served; do curl -s --max-time 20 "$SITE/$f" | cmp -s - "$f" || echo "$f"; done)
    [ -z "$stale" ] && break
    echo "waiting for the deploy, not live yet: $(echo $stale)"
    sleep 15
  done
  [ -n "$stale" ] && bad "The live site isn't serving this commit: $(echo $stale). A failed deploy, a rollback, or a file .vercelignore doesn't name."
fi

# 2. Nothing else in the repo answers, and nor do the paths every scanner tries.
leaks=0
for f in $private .git/config .git/HEAD .env .env.local .vercel/project.json; do
  c=$(status "/$f")
  case "$c" in 2*) bad "LEAK: /$f answers $c. It must 404: don't add it to the .vercelignore allowlist."; leaks=$((leaks + 1)) ;; esac
done
[ $leaks = 0 ] && echo "private: $(echo "$private" | wc -l) repo files and 5 usual suspects, none served"
if [ "$MODE" = private ]; then exit $fail; fi

# 3. The pages answer.
for p in /involved /privacy; do
  c=$(status "$p"); [ "$c" = 200 ] || bad "DOWN: $p answers $c"
done

# 4. Nothing served looks like a key.
for f in $served; do
  [[ "$f" =~ $TEXT ]] || continue
  hit=$(curl -s --max-time 20 "$SITE/$f" | grep -oE "$KEYS" | head -1)
  [ -n "$hit" ] && bad "KEY-SHAPED text served at /$f (${hit:0:8}...). Take it off the page and rotate it."
done

# 5. vercel.json's headers are on, the microphone is still allowed (voice answers need it),
#    and so is Vercel's own HSTS.
h=$(curl -sI --max-time 20 "$SITE/c/01" | tr -d '\r' | tr '[:upper:]' '[:lower:]')
for want in "content-security-policy: .*frame-ancestors" "x-content-type-options: nosniff" "x-frame-options: " \
            "referrer-policy: " "permissions-policy: .*microphone=\(self\)" "strict-transport-security: max-age="; do
  printf '%s\n' "$h" | grep -qE "^$want" || bad "HEADER missing or changed: $want"
done

[ $fail = 0 ] && echo "clean: $SITE serves this commit, nothing private, no keys, headers on"
exit $fail
