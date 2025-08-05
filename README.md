# ADA-Voice-Project
## AI音声モデル「エイダ」開発プロジェクト

このリポジトリは、「AI音声モデル『エイダ』開発プロジェクト」の開発環境と、その進捗を可視化するインタラクティブなWebレポートを統合管理するものです。

-   **開発**: リポジトリのルートディレクトリで、音声モデルの学習、スクリプトの管理、成果物（モデルファイル）のバージョン管理を行います。
-   **公開**: `/docs` ディレクトリ内の `index.html` が、GitHub Pagesとして公開され、プロジェクトの全貌をインタラクティブに探求できます。

## 主な機能

-   **統合されたワークフロー**: 1つのリポジトリで開発と公開サイトの管理が完結します。
-   **インテリジェントな自動プッシュ**: ローカルでの学習中、ベストモデルが更新された瞬間にのみ、その成果が自動でGitHubにプッシュされます。
-   **インタラクティブなWebレポート**:
    -   WBS、作業手順、タイムラインを動的に表示。
    -   開発中に発生した全課題とその解決策を時系列で確認。
    -   Gemini APIを利用し、プロジェクトの総括や各課題の詳細なAI分析が可能。

## デモ

最新のインタラクティブレポートは、以下のURLで常時公開されています。

<https://lou-ark.github.io/ADA-Voice-Project/>

## 使い方

### 1. 開発環境のセットアップと学習の実行

このプロジェクトをローカルで実行し、モデルの再学習や開発に参加するための手順です。

#### 前提条件

-   Git および Git LFS
-   Python 3.10
-   Ubuntu (またはWSL2) 環境
-   `ffmpeg`, `kakasi`, `inotify-tools`

#### 手順

1.  **リポジトリのクローン**:
    まず、このリポジトリをローカルマシンにクローンします。
    ```bash
    git clone https://github.com/LOU-Ark/ADA-Voice-Project.git
    cd ADA-Voice-Project
    ```

2.  **Git LFSのセットアップ**:
    大容量のモデルファイルを扱うために、Git LFSを有効化します。
    ```bash
    git lfs install
    ```

3.  **Python仮想環境のセットアップ**:
    プロジェクト専用のPython環境を構築します。
    ```bash
    python3.10 -m venv tts_env
    source tts_env/bin/activate
    pip install TTS
    ```

4.  **元音声データの配置**:
    学習の元となる、あなた自身のWAVファイルを `TTS/my_ada_voice/wavs_original/` ディレクトリに配置してください。

5.  **統合学習スクリプトの実行**:
    以下のコマンド一つで、データの前処理、学習の開始、そしてベストモデル更新時の自動プッシュが全て実行されます。
    ```bash
    chmod +x start_training.sh
    ./start_training.sh
    ```

### 2. WebレポートのAI機能を利用する

Webレポート上のAI分析機能は、閲覧者自身のAPIキーで利用できます。

1.  [Google AI Studio](https://aistudio.google.com/app/apikey) にアクセスし、無料のAPIキーを取得します。
2.  公開されているWebレポートを開き、「✨ AI分析」セクションに移動します。
3.  「APIキー設定」の入力欄に、取得したAPIキーを貼り付け、「保存」ボタンをクリックします。
4.  キーはブラウザに安全に保存されます。

## 使用技術

-   **フロントエンド**: HTML, Vanilla JavaScript
-   **スタイリング**: Tailwind CSS
-   **データ可視化**: Chart.js
-   **AI**: Google Gemini API
-   **開発ワークフロー**: Git, Git LFS, Shell Script
