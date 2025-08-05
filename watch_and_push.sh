#!/bin/bash

# --- 設定 ---
WATCH_DIR="TTS/ada-voice-model"
PUSH_THRESHOLD=5
# 統合スクリプトから渡された学習プロセスのID
TRAIN_PID=$1

# .pth ファイルの数を数える関数
count_pth_files() {
    find "$1" -type f -name "*.pth" 2>/dev/null | wc -l
}

echo ">>> 学習ディレクトリの監視を開始 (学習プロセスPID: $TRAIN_PID)"
last_push_count=$(count_pth_files "$WATCH_DIR")
echo ">>> 現在のチェックポイント数: $last_push_count"

# 学習プロセスが実行中である限り、監視を続ける
while kill -0 $TRAIN_PID 2>/dev/null; do
    # inotifywaitで、1分間のタイムアウト付きでファイル作成を待つ
    inotifywait -r -q -t 60 -e create "$WATCH_DIR" || true

    current_count=$(count_pth_files "$WATCH_DIR")

    if (( current_count >= last_push_count + PUSH_THRESHOLD )); then
        echo "[!] 閾値に達しました。GitHubにプッシュします。"
        git add .
        LATEST_CHECKPOINT=$(ls -t $WATCH_DIR/*/*.pth | head -n 1)
        COMMIT_MESSAGE="自動プッシュ: +$PUSH_THRESHOLD 個 (最新: $(basename $LATEST_CHECKPOINT))"
        git commit -m "$COMMIT_MESSAGE"
        git push origin main
        echo "[成功] プッシュが完了しました。"
        last_push_count=$current_count
    fi
done

echo ">>> 学習プロセスが終了したため、最後のプッシュを実行します..."
git add .
git commit -m "Final checkpoint push after training completion" || true
git push origin main
echo ">>> 監視を終了します。"
