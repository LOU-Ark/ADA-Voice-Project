#!/bin/bash
set -e
rm -f metadata.csv
i=1
for f in wavs_original/*.wav; do
  NEW_NAME_BASE=$(printf "ada_%04d" "$i")

  ORIGINAL_BASENAME=$(basename "$f")
  TEXT_PART="${ORIGINAL_BASENAME%.wav}"
  TEXT_PART=$(echo "$TEXT_PART" | sed -E 's/([ _＿]nc[0-9].*|[ _＿]sm[0-9].*)//g' | sed -E 's/^[0-9]+_//' | sed -E 's/^(ADA喜|ADA煽|ADA怒|ADA)[[:space:]]*//' | sed -E 's/(\(|（)[^)]*(\)|）)//g' | sed "s/['’\"]//g" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g' | sed 's/[_＿]+$//')
  HIRAGANA_TEXT=$(echo "$TEXT_PART" | kakasi -i utf8 -o utf8 -JH -KH -aH | tr -d ' \t' | sed 's/lev/れぶ/g')

  if [ -n "$HIRAGANA_TEXT" ]; then
    echo "${NEW_NAME_BASE}|${HIRAGANA_TEXT}|${HIRAGANA_TEXT}" >> metadata.csv
  fi
  i=$((i+1))
done
echo "メタデータの生成が完了しました。"
