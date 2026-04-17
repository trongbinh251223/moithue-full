#!/usr/bin/env bash
# Đồng bộ schema + dữ liệu nền D1 production với trạng thái tương đương preview (migrations + patch).
# Không chạy seed.sql mặc định (seed XÓA toàn bộ users/properties — chỉ dùng demo).
# Để nạp demo giống preview: RUN_SEED=1 bash scripts/d1-prod-parity.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> migrations apply (remote production)"
npm run db:migrations:apply:remote

run_optional () {
  local label="$1"
  shift
  echo "==> $label"
  if "$@"; then
    true
  else
    echo "    (bỏ qua / đã áp dụng — xem log phía trên)"
  fi
}

run_optional "add password_hash (bỏ qua nếu đã có)" npm run db:prod:add-password-hash
run_optional "add role_id (bỏ qua nếu đã có)" npm run db:prod:add-role-id
run_optional "roles + sessions" npm run db:prod:roles-sessions
run_optional "add updated_at (bỏ qua nếu đã có)" npm run db:prod:users-updated-at
run_optional "backfill role_id + updated_at" npm run db:prod:users-backfill

if [[ "${RUN_SEED:-}" == "1" ]]; then
  echo "==> seed.sql (XÓA dữ liệu cũ — chỉ dùng môi trường demo)"
  npm run db:seed:remote
else
  echo "==> bỏ qua seed (đặt RUN_SEED=1 nếu muốn dữ liệu demo giống preview)"
fi

echo "==> xong db:prod:parity"
