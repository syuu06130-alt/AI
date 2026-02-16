/**
 * dark-AI - Universal AI Interface
 * Standalone JavaScript Implementation
 * Version: 1.0.0
 */

class DarkAI {
    constructor() {
        this.messages = [];
        this.currentProvider = 'claude';
        this.currentMode = 'fast';
        this.attachedFiles = [];
        this.apiKeys = {};
        this.init();
    }

    init() {
        this.loadApiKeys();
        this.setupEventListeners();
        this.updateProviderStatus();
    }

    // API Key Management
    loadApiKeys() {
        const saved = localStorage.getItem('darkAI_apiKeys');
        if (saved) {
            this.apiKeys = JSON.parse(saved);
            this.populateApiInputs();
        }
    }

    saveApiKeys() {
        this.apiKeys = {
            claude: document.getElementById('claudeApi').value,
            gpt: document.getElementById('gptApi').value,
            grok: document.getElementById('grokApi').value,
            gemini: document.getElementById('geminiApi').value,
            deepseek: document.getElementById('deepseekApi').value,
            dalle: document.getElementById('dalleApi').value
        };
        localStorage.setItem('darkAI_apiKeys', JSON.stringify(this.apiKeys));
        this.updateProviderStatus();
        alert('API設定を保存しました');
    }

    populateApiInputs() {
        const inputs = {
            'claudeApi': 'claude',
            'gptApi': 'gpt',
            'grokApi': 'grok',
            'geminiApi': 'gemini',
            'deepseekApi': 'deepseek',
            'dalleApi': 'dalle'
        };
        
        for (const [inputId, keyName] of Object.entries(inputs)) {
            const input = document.getElementById(inputId);
            if (input && this.apiKeys[keyName]) {
                input.value = this.apiKeys[keyName];
            }
        }
    }

    updateProviderStatus() {
        document.querySelectorAll('.ai-provider').forEach(provider => {
            const providerType = provider.getAttribute('data-provider');
            const status = provider.querySelector('.ai-status');
            if (this.apiKeys[providerType]) {
                status.classList.remove('inactive');
            } else {
                status.classList.add('inactive');
            }
        });
    }

    // Event Listeners
    setupEventListeners() {
        // AI Provider selection
        document.querySelectorAll('.ai-provider').forEach(provider => {
            provider.addEventListener('click', () => this.selectProvider(provider));
        });

        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectMode(btn));
        });

        // Input handling
        const textarea = document.getElementById('userInput');
        if (textarea) {
            textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }
    }

    selectProvider(providerElement) {
        const providerType = providerElement.getAttribute('data-provider');
        if (!this.apiKeys[providerType]) {
            alert(`${providerElement.textContent}のAPIキーが設定されていません`);
            this.openApiSettings();
            return;
        }
        document.querySelectorAll('.ai-provider').forEach(p => p.classList.remove('active'));
        providerElement.classList.add('active');
        this.currentProvider = providerType;
    }

    selectMode(modeButton) {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        modeButton.classList.add('active');
        this.currentMode = modeButton.getAttribute('data-mode');
    }

    // Message Handling
    async sendMessage() {
        const input = document.getElementById('userInput');
        const text = input.value.trim();
        
        if (!text && this.attachedFiles.length === 0) return;
        
        if (!this.apiKeys[this.currentProvider]) {
            alert('APIキーが設定されていません');
            this.openApiSettings();
            return;
        }

        // Clear empty state
        this.clearEmptyState();

        // Add user message
        const userMessage = {
            role: 'user',
            content: text,
            files: [...this.attachedFiles],
            timestamp: new Date().toLocaleTimeString()
        };
        this.messages.push(userMessage);
        this.displayMessage(userMessage);

        // Clear input
        input.value = '';
        this.attachedFiles = [];
        this.updateFilePreview();

        // Show typing indicator
        this.showTypingIndicator();

        // Show thinking mode if deep thinking
        if (this.currentMode === 'deep') {
            document.querySelector('.thinking-mode').style.display = 'flex';
        }

        try {
            let response;
            switch(this.currentProvider) {
                case 'claude':
                    response = await this.callClaudeAPI(text);
                    break;
                case 'gpt':
                    response = await this.callGPTAPI(text);
                    break;
                case 'grok':
                    response = await this.callGrokAPI(text);
                    break;
                case 'gemini':
                    response = await this.callGeminiAPI(text);
                    break;
                case 'deepseek':
                    response = await this.callDeepSeekAPI(text);
                    break;
            }

            this.hideTypingIndicator();
            document.querySelector('.thinking-mode').style.display = 'none';

            const aiMessage = {
                role: 'assistant',
                content: response.content,
                thinking: response.thinking,
                timestamp: new Date().toLocaleTimeString()
            };
            this.messages.push(aiMessage);
            this.displayMessage(aiMessage);

        } catch (error) {
            this.hideTypingIndicator();
            document.querySelector('.thinking-mode').style.display = 'none';
            alert('エラーが発生しました: ' + error.message);
        }
    }

    // API Calls
    async callClaudeAPI(text) {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.apiKeys.claude,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: this.currentMode === 'pro' ? "claude-opus-4-20250514" : "claude-sonnet-4-20250514",
                max_tokens: this.currentMode === 'fast' ? 1000 : 4000,
                messages: [{
                    role: "user",
                    content: this.currentMode === 'deep' 
                        ? `以下の質問について、深く思考してから答えてください。思考過程も含めて回答してください:\n\n${text}`
                        : text
                }]
            })
        });

        const data = await response.json();
        const content = data.content.find(c => c.type === 'text')?.text || '応答を取得できませんでした';
        
        return {
            content: content,
            thinking: this.currentMode === 'deep' ? '深い分析を実行しました' : null
        };
    }

    async callGPTAPI(text) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKeys.gpt}`
            },
            body: JSON.stringify({
                model: this.currentMode === 'pro' ? "gpt-4" : "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: this.currentMode === 'deep'
                        ? `Think deeply about this and provide a detailed analysis:\n\n${text}`
                        : text
                }],
                max_tokens: this.currentMode === 'fast' ? 500 : 2000
            })
        });

        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            thinking: this.currentMode === 'deep' ? 'GPT深層分析完了' : null
        };
    }

    async callGrokAPI(text) {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKeys.grok}`
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: text
                }],
                model: "grok-beta",
                stream: false
            })
        });

        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            thinking: this.currentMode === 'deep' ? 'Grok分析完了' : null
        };
    }

    async callGeminiAPI(text) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: this.currentMode === 'deep'
                            ? `Analyze this deeply and provide comprehensive insights:\n\n${text}`
                            : text
                    }]
                }]
            })
        });

        const data = await response.json();
        return {
            content: data.candidates[0].content.parts[0].text,
            thinking: this.currentMode === 'deep' ? 'Gemini深層分析完了' : null
        };
    }

    async callDeepSeekAPI(text) {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKeys.deepseek}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{
                    role: "user",
                    content: text
                }]
            })
        });

        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            thinking: this.currentMode === 'deep' ? 'DeepSeek分析完了' : null
        };
    }

    // UI Methods
    displayMessage(message) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        
        let html = `
            <div class="message-avatar">${message.role === 'user' ? '👤' : '🌑'}</div>
            <div class="message-content">
                <div class="message-header">
                    <span>${message.role === 'user' ? 'あなた' : 'dark-AI'}</span>
                    <span>${message.timestamp}</span>
                </div>
        `;

        if (message.thinking && this.currentMode === 'deep') {
            html += `
                <details class="thinking-process">
                    <summary>💭 思考過程</summary>
                    <p>${message.thinking}</p>
                </details>
            `;
        }

        html += `<div>${message.content.replace(/\n/g, '<br>')}</div>`;

        if (message.files && message.files.length > 0) {
            message.files.forEach(file => {
                if (file.type === 'image') {
                    html += `<img src="${file.data}" class="image-preview" alt="${file.name}">`;
                }
            });
        }

        html += `</div>`;
        messageDiv.innerHTML = html;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        const indicator = document.createElement('div');
        indicator.className = 'message assistant';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar">🌑</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatContainer.appendChild(indicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    clearEmptyState() {
        const chatContainer = document.getElementById('chatContainer');
        const emptyState = chatContainer.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
    }

    // File Handling
    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            this.attachedFiles.push({
                type: 'file',
                name: file.name,
                file: file
            });
        });
        this.updateFilePreview();
    }

    handleImageSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.attachedFiles.push({
                    type: 'image',
                    name: file.name,
                    data: e.target.result
                });
                this.updateFilePreview();
            };
            reader.readAsDataURL(file);
        });
    }

    updateFilePreview() {
        const preview = document.getElementById('filePreview');
        preview.innerHTML = '';
        this.attachedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <span>${file.type === 'image' ? '🖼️' : '📄'} ${file.name}</span>
                <span class="remove-file" onclick="darkAI.removeFile(${index})">×</span>
            `;
            preview.appendChild(item);
        });
    }

    removeFile(index) {
        this.attachedFiles.splice(index, 1);
        this.updateFilePreview();
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    // Utility Methods
    openApiSettings() {
        document.getElementById('apiModal').classList.add('active');
    }

    closeApiSettings() {
        document.getElementById('apiModal').classList.remove('active');
    }

    clearChat() {
        if (confirm('チャット履歴を削除しますか？')) {
            this.messages = [];
            document.getElementById('chatContainer').innerHTML = `
                <div class="empty-state">
                    <h2>dark-AIへようこそ</h2>
                    <p>新しい会話を始めましょう</p>
                </div>
            `;
        }
    }

    exportChat() {
        const chatText = this.messages.map(m => 
            `[${m.timestamp}] ${m.role === 'user' ? 'あなた' : 'dark-AI'}: ${m.content}`
        ).join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dark-ai-chat-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadHTML() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dark-ai.html';
        a.click();
        URL.revokeObjectURL(url);
    }

    async generateImage() {
        const prompt = window.prompt('生成したい画像の説明を入力してください:');
        if (!prompt) return;

        if (!this.apiKeys.dalle) {
            alert('DALL-E APIキーが設定されていません');
            this.openApiSettings();
            return;
        }

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKeys.dalle}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024"
                })
            });

            const data = await response.json();
            const imageUrl = data.data[0].url;

            const aiMessage = {
                role: 'assistant',
                content: `画像を生成しました: "${prompt}"`,
                files: [{
                    type: 'image',
                    data: imageUrl,
                    name: 'generated_image.png'
                }],
                timestamp: new Date().toLocaleTimeString()
            };
            this.messages.push(aiMessage);
            this.displayMessage(aiMessage);

        } catch (error) {
            alert('画像生成エラー: ' + error.message);
        }
    }

    toggleCanvas() {
        alert('Canvas機能を準備中...\n\n実装予定:\n- HTMLキャンバス\n- コード生成\n- ビジュアルエディタ');
    }
}

// Initialize dark-AI when DOM is ready
let darkAI;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        darkAI = new DarkAI();
    });
} else {
    darkAI = new DarkAI();
}

// Global functions for HTML onclick handlers
function sendMessage() { darkAI.sendMessage(); }
function openApiSettings() { darkAI.openApiSettings(); }
function closeApiSettings() { darkAI.closeApiSettings(); }
function saveApiSettings() { darkAI.saveApiKeys(); }
function clearChat() { darkAI.clearChat(); }
function exportChat() { darkAI.exportChat(); }
function downloadHTML() { darkAI.downloadHTML(); }
function downloadZIP() { alert('ZIP機能は開発中です'); }
function toggleCanvas() { darkAI.toggleCanvas(); }
function generateImage() { darkAI.generateImage(); }
function handleFileSelect(event) { darkAI.handleFileSelect(event); }
function handleImageSelect(event) { darkAI.handleImageSelect(event); }
function handleKeyDown(event) { darkAI.handleKeyDown(event); }