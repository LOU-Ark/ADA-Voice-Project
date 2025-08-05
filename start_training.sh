#!/bin/bash

# 監視スクリプトのパス
MONITOR_SCRIPT="./watch_and_push.sh"
# 学習スクリプトのコマンド
TRAIN_COMMAND="python TTS/TTS/bin/train_tts.py --config_path TTS/configs/config_ada.json"

echo ">>> 監視スクリプトと学習スクリプトを同時に開始します。"

# 仮想環境を有効化
source tts_env/bin/activate

# 学習スクリプトをバックグラウンドで開始
eval $TRAIN_COMMAND &

# バックグラウンドで実行した学習プロセスのIDを取得
TRAIN_PID=$!
echo ">>> 学習プロセスを開始しました (PID: $TRAIN_PID)"

# 監視スクリプトを開始し、学習プロセスのIDを渡す
eval "$MONITOR_SCRIPT $TRAIN_PID"

# 学習プロセスが終了したら、ここに来る
echo ">>> 学習プロセスが終了しました。監視を停止します。"
