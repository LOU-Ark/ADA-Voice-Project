import os
import json
import pandas as pd

# --- パス定義 ---
# データセットの親ディレクトリ (この中に 'wavs' と 'metadata.csv' がある)
DATASET_PATH = os.path.join(os.path.expanduser('~'), "TTS_Project/TTS/my_ada_voice/")
# 読み込むメタデータファイルのフルパス
METADATA_FILE = os.path.join(DATASET_PATH, "metadata.csv")
# 生成するコンフィグファイルの保存先
OUTPUT_CONFIG_FILE = os.path.join(os.getcwd(), "configs/config_ada.json")

# --- 処理開始 ---
print(f"'{METADATA_FILE}' から文字リストを生成中...")
try:
    df = pd.read_csv(METADATA_FILE, sep="|", header=None)
    all_text = "".join(df[1].astype(str))
    char_string = "".join(sorted(list(set(all_text))))
    print(" -> 文字リストの生成完了")
except FileNotFoundError:
    print(f"エラー: メタデータファイル '{METADATA_FILE}' が見つかりません。")
    exit()

config_template = {
    "run_name": "vits_ada_finetune",
    "output_path": "ada-voice-model/",
    "model": "VITS",
    "model_args": { "use_sdp": False },
    "datasets": [{
        "name": "ada_voice",
        "formatter": "ljspeech",
        "path": DATASET_PATH,
        "meta_file_train": "metadata.csv"
    }],
    "characters": {
        "characters_class": "TTS.tts.models.vits.VitsCharacters",
        "pad": "_", "eos": "&", "bos": "*", "blank": "#",
        "punctuations": "、。？！ー…",
        "characters": char_string
    },
    "audio": { "sample_rate": 22050, "do_trim_silence": True, "trim_db": 60 },
    "batch_size": 8, "eval_batch_size": 8, "num_loader_workers": 4, "num_eval_loader_workers": 4,
    "epochs": 10000, "learning_rate": 0.0001, "save_step": 1000, "print_step": 25, "eval_step": 1000,
    "tensorboard": True, "mixed_precision": True, "use_phonemes": False,
    "test_sentences": [ "こんにちは、わたしのなまえはえいだです。", "これはてすとぶんしょうです。" ]
}

os.makedirs(os.path.dirname(OUTPUT_CONFIG_FILE), exist_ok=True)
with open(OUTPUT_CONFIG_FILE, 'w', encoding='utf-8') as f:
    json.dump(config_template, f, ensure_ascii=False, indent=4)

print(f"\n処理が完了しました。'{OUTPUT_CONFIG_FILE}' が正常に生成されました。")
