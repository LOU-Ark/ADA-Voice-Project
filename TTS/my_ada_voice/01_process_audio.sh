#!/bin/bash
set -e
rm -rf wavs && mkdir -p wavs
i=1
for f in wavs_original/*.wav; do
  NEW_NAME=$(printf "ada_%04d.wav" "$i")
  ffmpeg -y -i "$f" -ar 22050 -ac 1 "wavs/$NEW_NAME" >/dev/null 2>&1
  i=$((i+1))
done
echo "音声ファイルの処理とリネームが完了しました。"
