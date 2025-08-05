#!/bin/bash
set -e # エラーが発生したら即座に停止

# --- 設定 ---
# 学習スクリプトのコマンド
TRAIN_COMMAND="python TTS/TTS/bin/train_tts.py --config_path TTS/configs/config_ada.json"

echo "✅ 学習を開始します。ベストモデルが更新されるたびに自動でプッシュします。"

# 仮想環境を有効化
source tts_env/bin/activate

# 【修正点】学習コマンドの全出力(標準出力と標準エラー出力)をパイプに渡す
eval $TRAIN_COMMAND 2>&1 | while IFS= read -r line; do
  # 学習ログはそのまま画面に表示する
  echo "$line"

  # ログの1行に "> BEST MODEL" という文字列が含まれているかチェック
  if [[ "$line" == *"> BEST MODEL"* ]]; then
    echo "----------------------------------------------------"
    echo "[!] 新しいベストモデルを検知しました。GitHubにプッシュします。"

    # 行からベストモデルのパスを抽出 (例: .../best_model_192.pth)
    BEST_MODEL_PATH=$(echo "$line" | awk '{print $4}')

    # Gitコマンドを実行
    git add .
    git commit -m "Update best model: $(basename "$BEST_MODEL_PATH")"
    git push origin main

    echo "[OK] プッシュが完了しました。"
    echo "----------------------------------------------------"
  fi
done

echo "✅ 学習プロセスが完了しました。最後の変更をプッシュします..."
git add .
git commit -m "Final push after training completion" || true
git push origin main
echo "✅ 全てのプロセスが完了しました。"
