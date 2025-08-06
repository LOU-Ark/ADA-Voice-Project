document.addEventListener('DOMContentLoaded', () => {

    // --- データ定義 ---

    const wbsData = [
        { id: 1, name: 'プロジェクト管理', children: [ { id: 1.1, name: '計画立案' }, { id: 1.2, name: '進捗・課題管理' } ]},
        { id: 2, name: '開発環境構築', children: [ { id: 2.1, name: 'OS環境設定' }, { id: 2.2, name: 'Pythonプロジェクト環境設定' }, { id: 2.3, name: 'Coqui-TTS環境設定' } ]},
        { id: 3, name: '学習データ準備', children: [ { id: 3.1, name: '音声データ収集・整理' }, { id: 3.2, name: '音声データ加工' }, { id: 3.3, name: 'メタデータ作成' } ]},
        { id: 4, name: 'モデル学習', children: [ { id: 4.1, name: '学習設定' }, { id: 4.2, name: '学習実行' }, { id: 4.3, name: 'モデル評価' } ]},
        { id: 5, name: '音声合成（推論）', children: [ { id: 5.1, name: '推論実行と品質評価' } ]},
        { id: 6, name: 'プロジェクト完了', children: [ { id: 6.1, name: '成果物の保管' }, { id: 6.2, name: 'プロジェクトの振り返り' } ]}
    ];

    const scheduleData = [
        { task: '開発環境構築', start: '2025-07-30', end: '2025-07-30' },
        { task: '学習データ準備', start: '2025-07-31', end: '2025-07-31' },
        { task: '学習設定', start: '2025-08-01', end: '2025-08-01' },
        { task: '学習実行', start: '2025-08-01', end: '2025-08-07' },
        { task: 'モデル評価', start: '2025-08-08', end: '2025-08-08' },
        { task: '音声合成（推論）', start: '2025-08-08', end: '2025-08-08' },
        { task: 'プロジェクト完了', start: '2025-08-09', end: '2025-08-09' }
    ];

    const issueData = [
        { id: '001', title: '`apt update`のネットワークエラー', desc: '進行に影響なしと判断し、作業を継続。' },
        { id: '002', title: 'メタデータのクリーニングが不完全', desc: 'テキストを整形するスクリプトを改善。' },
        { id: '003', title: '`config.json`の設定項目不足', desc: '設定生成スクリプトを修正し、不足項目を追加。' },
        { id: '004', title: 'データ形式とフォーマッターの不整合', desc: 'データをフォーマッターが期待する3列形式に変換して解決。' },
        { id: '005', title: 'ファイルパスの拡張子二重付与', desc: 'メタデータの1列目から`.wav`を削除して解決。' },
        { id: '006', title: '`sed`コマンドがファイル名を破損', desc: 'コマンドの欠陥を特定し、全データを再生成するスクリプトで解決。' },
        { id: '007', title: 'プログラム内部のパスハードコード問題', desc: 'プログラムの仕様に合わせてディレクトリ構造と設定を修正。' },
        { id: '008', title: 'データセットのステレオ音声混入', desc: '全音声ファイルを強制的にモノラルに再変換して解決。' },
        { id: '009', title: '`metadata.csv`が1行になる問題', desc: 'シェルスクリプトの欠陥を特定し、改行を破壊しないPythonスクリプトに置き換えて解決。' },
        { id: '010', title: 'チェックポイントファイル破損', desc: '破損した最新のチェックポイントを削除し、一つ前のバックアップから学習を再開。' },
        { id: '011', title: '学習ログの表示問題', desc: 'プロジェクトを完全にリセットし、ファイル名のリネームを含む最終版のデータ準備スクリプトを実行して解決。' }
    ];

    const proceduresData = [
        {
            phase: '作業場所について（プロジェクトルート）',
            isIntro: true,
            description: 'この手順書では、全ての作業はユーザーのホームディレクトリから開始することを推奨します。ホームディレクトリは `~` で表され、ターミナルでは `root@hostname:~#` のように表示されます。Windows PCのデスクトップ（WSL2からは `/mnt/c/Users/[YourUsername]/Desktop`）でも可能ですが、ホームディレクトリが一般的です。'
        },
        {
            phase: 'フェーズ1: 環境構築',
            steps: [
                { title: 'システム更新とパッケージインストール', description: 'システムを最新化し、Pythonや音声処理に必要なツールを導入します。', path: 'root@hostname:~#', command: 'sudo apt update && sudo apt install python3.10 python3.10-venv python3-pip git git-lfs ffmpeg kakasi -y' },
                { title: 'プロジェクトディレクトリ作成と移動', description: '作業ファイルを集約する専用のフォルダを作成し、そこに移動します。', path: 'root@hostname:~#', command: 'mkdir ~/TTS_Project && cd ~/TTS_Project' },
                { title: 'Python仮想環境の作成と有効化', description: 'プロジェクト専用のPython環境を分離し、有効化します。', path: 'root@hostname:~/TTS_Project#', command: 'python3.10 -m venv tts_env\nsource tts_env/bin/activate' },
                { title: 'TTSライブラリとソースコードの準備', description: '音声合成ライブラリ本体と、学習用スクリプトを準備します。', path: '(tts_env) root@hostname:~/TTS_Project#', command: 'pip install TTS\ngit clone https://github.com/coqui-ai/TTS.git' }
            ]
        },
        {
            phase: 'フェーズ2: データ準備',
            steps: [
                { title: '元データ用ディレクトリ作成', description: 'オリジナルの音声ファイルを保管するための置き場所を作成します。', path: '(tts_env) root@hostname:~/TTS_Project#', command: 'mkdir -p TTS/my_ada_voice/wavs_original' },
                { title: '元データをコピー', description: '用意した音声ファイルを、プロジェクト内の所定の場所にコピーします。', path: '(tts_env) root@hostname:~/TTS_Project#', command: 'cp /path/to/your/wavs/*.wav TTS/my_ada_voice/wavs_original/' },
                { title: 'データ準備スクリプト実行', description: '音声のリネームと整形、テキスト抽出を全自動で行うスクリプトです。', path: '(tts_env) root@hostname:~/TTS_Project#', command: 'cd TTS/my_ada_voice\n(tts_env) root@hostname:~/TTS_Project/TTS/my_ada_voice# python3 rebuild_metadata.py' }
            ]
        },
        {
            phase: 'フェーズ3: 学習',
            steps: [
                { title: '設定ファイル生成', description: 'AIに学習方法を指示する設計図（config.json）を自動生成します。', path: '(tts_env) root@hostname:~/TTS_Project/TTS/my_ada_voice#', command: 'cd ~/TTS_Project/TTS\n(tts_env) root@hostname:~/TTS_Project/TTS# python create_config.py' },
                { title: '学習開始', description: '作成したデータと設定を使い、モデルの学習をゼロから開始します。', path: '(tts_env) root@hostname:~/TTS_Project/TTS#', command: 'python TTS/bin/train_tts.py --config_path configs/config_ada.json' },
                { title: '学習再開', description: '中断した学習を、保存されたチェックポイントから再開します。', path: '(tts_env) root@hostname:~/TTS_Project/TTS#', command: 'python TTS/bin/train_tts.py --continue_path ada-voice-model/[学習フォルダ名]/' }
            ]
        }
    ];

    // --- APIキー定義 ---
    // このプレースホルダーはGitHub Actionsによって置換されます
    const apiKey = 'GEMINI_API_KEY_PLACEHOLDER';


    // --- UI要素の初期化と描画 ---

    // WBSリストの描画
    const wbsList = document.getElementById('wbs-list');
    if (wbsList) {
        wbsData.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="wbs-toggle font-bold cursor-pointer p-2 rounded hover:bg-slate-100">${item.id}. ${item.name}</div>
                <ul class="ml-6 hidden space-y-1 pt-1">
                    ${item.children.map(child => `<li class="p-1 pl-2">${child.id}. ${child.name}</li>`).join('')}
                </ul>
            `;
            wbsList.appendChild(li);
        });

        wbsList.addEventListener('click', (e) => {
            const toggle = e.target.closest('.wbs-toggle');
            if (toggle) {
                toggle.classList.toggle('open');
                toggle.nextElementSibling.classList.toggle('hidden');
            }
        });
    }

    // 作業手順の描画
    const proceduresContainer = document.getElementById('procedures-container');
    if (proceduresContainer) {
        proceduresData.forEach(proc => {
            if (proc.isIntro) {
                proceduresContainer.innerHTML += `
                    <div class="bg-slate-100 p-4 rounded-lg">
                        <h4 class="font-bold text-lg mb-2 text-slate-700">${proc.phase}</h4>
                        <p class="text-slate-600">${proc.description}</p>
                    </div>`;
            } else {
                let stepsHtml = proc.steps.map(step => `
                    <div class="mb-4">
                        <h5 class="font-semibold text-slate-700">${step.title}</h5>
                        <p class="text-sm text-slate-500 mb-2">${step.description}</p>
                        <div class="code-block bg-slate-800 rounded-lg p-4 text-sm font-mono text-white relative">
                            <button class="copy-btn">コピー</button>
                            <div class="whitespace-pre-wrap"><span class="code-path">${step.path}</span> ${step.command}</div>
                        </div>
                    </div>`).join('');
                proceduresContainer.innerHTML += `
                    <div>
                        <h4 class="font-bold text-lg mb-3 text-slate-800">${proc.phase}</h4>
                        ${stepsHtml}
                    </div>`;
            }
        });

        proceduresContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                const btn = e.target;
                const commandText = btn.nextElementSibling.textContent.trim().replace(/^.+?#\s*/, '');
                navigator.clipboard.writeText(commandText).then(() => {
                    btn.textContent = 'コピー完了!';
                    setTimeout(() => { btn.textContent = 'コピー'; }, 2000);
                });
            }
        });
    }
    
    // スケジュールチャートの描画
    const scheduleChartCtx = document.getElementById('scheduleChart');
    if (scheduleChartCtx) {
        new Chart(scheduleChartCtx, {
            type: 'bar',
            data: {
                labels: scheduleData.map(d => d.task),
                datasets: [{
                    label: '作業期間',
                    data: scheduleData.map(d => [new Date(d.start).getTime(), new Date(d.end).getTime() + 86400000]), // 終了日を含むために1日加算
                    backgroundColor: '#14b8a6', // teal-500
                    borderColor: '#0f766e', // teal-700
                    borderWidth: 1,
                    barPercentage: 0.5,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'yyyy-MM-dd',
                            displayFormats: {
                                day: 'M/d'
                            }
                        },
                        min: new Date('2025-07-29').getTime(),
                        max: new Date('2025-08-10').getTime(),
                        title: { display: true, text: '日付' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const start = new Date(context.raw[0]).toLocaleDateString('ja-JP');
                                const end = new Date(context.raw[1] - 86400000).toLocaleDateString('ja-JP');
                                return `${context.dataset.label}: ${start} - ${end}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 課題タイムラインの描画
    const issueTimeline = document.getElementById('issue-timeline');
    if (issueTimeline) {
        issueData.forEach(issue => {
            const cardHtml = `
                <div class="mb-8 flex">
                    <div class="flex flex-col items-center mr-4">
                        <div>
                            <div class="flex items-center justify-center w-8 h-8 bg-teal-500 rounded-full text-white font-bold">${issue.id.padStart(2, '0')}</div>
                        </div>
                        <div class="w-px h-full bg-slate-300"></div>
                    </div>
                    <div class="pb-8 w-full">
                        <div class="issue-card bg-white p-4 rounded-lg shadow-sm border-l-teal-500 cursor-pointer">
                            <p class="font-bold text-slate-800">${issue.title}</p>
                            <p class="issue-desc text-slate-600 mt-2 hidden">${issue.desc}</p>
                        </div>
                    </div>
                </div>`;
            issueTimeline.innerHTML += cardHtml;
        });

        issueTimeline.addEventListener('click', (e) => {
            const card = e.target.closest('.issue-card');
            if (card) {
                card.querySelector('.issue-desc').classList.toggle('hidden');
            }
        });
    }


    // --- AI分析モーダル機能 ---
    
    const modal = document.getElementById('ai-modal');
    const modalBg = modal.querySelector('.modal-bg');
    const modalContent = modal.querySelector('.modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const generateSummaryBtn = document.getElementById('generate-summary-btn');

    function openModal(title) {
        modalTitle.textContent = title;
        modalBody.innerHTML = `<div class="flex justify-center items-center h-32"><div class="spinner w-12 h-12 rounded-full border-4"></div></div>`;
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalBg.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
    }

    function closeModal() {
        modalBg.classList.add('opacity-0');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalBg.addEventListener('click', closeModal);

    generateSummaryBtn.addEventListener('click', async () => {
        openModal('AIによるプロジェクト総括レポート');
        const prompt = `以下のプロジェクト情報を基に、プロジェクトのポストモーテム（事後検証）レポートを作成してください。成功点、課題、そして将来のプロジェクトへの教訓を重点的にまとめてください。\n\n# WBS\n${JSON.stringify(wbsData, null, 2)}\n\n# スケジュール\n${JSON.stringify(scheduleData, null, 2)}\n\n# 発生した課題一覧\n${JSON.stringify(issueData, null, 2)}`;
        
        try {
            const result = await callGeminiForAnalysis(prompt);
            modalBody.innerHTML = `<div class="prose max-w-none text-slate-700">${result.replace(/\n/g, '<br>')}</div>`;
        } catch (error) {
            modalBody.innerHTML = `<p class="text-red-500">分析中にエラーが発生しました: ${error.message}</p>`;
        }
    });

    async function callGeminiForAnalysis(prompt) {
        const proxyUrl = 'https://gemini-proxy.loutarma.workers.dev';
    
        // APIに送るデータ本体
        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };
    
        // Workerにリクエストを送信
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }


    // --- チャットボット機能のロジック ---

    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatCloseBtn = document.getElementById('chatbot-close-btn');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');

    let chatHistory = [];
    let pageContext = '';

    function getPageContext() {
        if (pageContext) return pageContext;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.body.innerHTML;
        tempDiv.querySelectorAll('script, style, #chatbot-container, #chatbot-icon, #ai-modal').forEach(el => el.remove());
        pageContext = tempDiv.innerText.replace(/\s+/g, ' ').trim();
        return pageContext.substring(0, 7000); // コンテキストの長さを制限
    }

    function toggleChatbot() {
        chatbotContainer.classList.toggle('hidden');
        chatbotIcon.classList.toggle('hidden');
        if (!chatbotContainer.classList.contains('hidden')) {
            inputField.focus();
            if (messagesContainer.children.length === 0) {
                 addMessageToUI('bot', 'こんにちは！このプロジェクトについて何か質問はありますか？');
            }
        }
    }

    chatbotIcon.addEventListener('click', toggleChatbot);
    chatCloseBtn.addEventListener('click', toggleChatbot);

    function addMessageToUI(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageElement;
    }
    
    async function handleSendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '') return;

        addMessageToUI('user', userMessage);
        inputField.value = '';

        const loadingIndicator = addMessageToUI('bot', '');
        loadingIndicator.classList.add('loading');
        
        try {
            const botResponse = await getGeminiResponseForChat(userMessage);
            loadingIndicator.remove();
            addMessageToUI('bot', botResponse);
        } catch (error) {
            console.error('Error fetching from Gemini API:', error);
            loadingIndicator.remove();
            addMessageToUI('bot', '申し訳ありません、エラーが発生しました。');
        }
    }

    sendBtn.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    async function getGeminiResponseForChat(userMessage) {
        const proxyUrl = 'https://gemini-proxy.loutarma.workers.dev';
    
        const context = getPageContext();
        const systemInstruction = {
            role: "model",
            parts: [{ text: `あなたはウェブページの解説アシスタントです。以下のページ内容を参考に、ユーザーの質問に親切かつ簡潔に日本語で答えてください。\n\n[ウェブページの内容]\n${context}` }]
        };
    
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
    
        const payload = {
            contents: [systemInstruction, ...chatHistory],
            generationConfig: {
                temperature: 0.7,
                topP: 1.0,
                maxOutputTokens: 512,
            },
        };
    
        // Workerにリクエストを送信
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(errorData.error.message || 'API request failed');
        }
    
        const data = await response.json();
        
        if (!data.candidates?.[0]?.content) {
            console.error("Invalid API Response:", data);
            throw new Error("AIからの有効な応答がありませんでした。");
        }
    
        const botResponseText = data.candidates[0].content.parts[0].text;
        
        chatHistory.push({ role: "model", parts: [{ text: botResponseText }] });
        if (chatHistory.length > 8) {
            chatHistory.splice(0, 2); 
        }
    
        return botResponseText;
    }
});
