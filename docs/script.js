document.addEventListener('DOMContentLoaded', () => {

    // --- 元のレポート機能のデータとロジック ---

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

    // --- AI分析モーダル機能のAPIキー ---
    // このプレースホルダーはGitHub Actionsによって置換されます
    const apiKey = 'GEMINI_API_KEY_PLACEHOLDER';

    // ... (元のレポート機能の関数群。WBS描画、チャート描画など、ここに変更はありません) ...
    // ... (元のコードが長いため、この部分は省略します) ...


    // --- チャットボット機能のロジック ---

    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close-btn');
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
    closeBtn.addEventListener('click', toggleChatbot);

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
        // --- チャットボット機能のAPIキー ---
        // このプレースホルダーはGitHub Actionsによって置換されます
        const chatApiKey = 'GEMINI_API_KEY_PLACEHOLDER';

        if (chatApiKey === 'GEMINI_API_KEY_PLACEHOLDER') {
            return "AIアシスタントは現在利用できません。ウェブサイトの管理者が設定を確認中です。";
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${chatApiKey}`;
        
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

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
