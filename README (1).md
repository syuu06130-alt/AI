# dark-AI - Universal AI Interface

## 概要
dark-AIは、複数のAIプロバイダーを統合した次世代AIチャットインターフェースです。

## 主な機能

### 🤖 対応AIプロバイダー
- **Claude AI** (Anthropic)
- **ChatGPT** (OpenAI)
- **Grok AI** (X.AI)
- **Gemini** (Google)
- **DeepSeek**

### ⚡ 実行モード
- **高速モード**: 素早い応答
- **Proモード**: 高度なモデル使用
- **深い思考モード**: 詳細な分析と思考過程の表示

### 🎨 追加機能
- **画像生成**: DALL-E統合
- **ファイル添付**: 複数ファイル対応
- **画像添付**: 画像アップロード
- **Canvas機能**: (開発中)
- **改行対応**: Shift+Enterで改行
- **チャット保存**: テキストエクスポート
- **HTML/ZIPダウンロード**: 完全な保存

## セットアップ

### 1. APIキーの取得

各AIサービスからAPIキーを取得してください：

- **Claude**: https://console.anthropic.com/
- **OpenAI** (ChatGPT/DALL-E): https://platform.openai.com/api-keys
- **X.AI** (Grok): https://x.ai/
- **Google** (Gemini): https://makersuite.google.com/app/apikey
- **DeepSeek**: https://platform.deepseek.com/

### 2. API設定

1. サイドバーの「🔑 API設定」をクリック
2. 各AIのAPIキーを入力
3. 「保存」をクリック

APIキーはブラウザのローカルストレージに安全に保存されます。

## 使い方

### 基本的な使用
1. サイドバーから使用するAIプロバイダーを選択
2. モード（高速/Pro/深い思考）を選択
3. メッセージを入力して送信

### ファイル添付
- 「📎 ファイル添付」ボタンでドキュメントを添付
- 「🖼️ 画像添付」ボタンで画像を添付

### 画像生成
- トップバーの「🖼️」アイコンをクリック
- プロンプトを入力して画像を生成

### キーボードショートカット
- **Enter**: メッセージ送信
- **Shift + Enter**: 改行

## 機能詳細

### 深い思考モード
このモードでは、AIが：
- 質問を多角的に分析
- 思考過程を明示
- より詳細な回答を提供

思考過程は折りたたみ可能な「💭 思考過程」セクションに表示されます。

### API使用について

各AIプロバイダーは独自のAPIを使用します：

```javascript
// Claude API 例
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  messages: [...]
}

// ChatGPT API 例
{
  model: "gpt-3.5-turbo",
  messages: [...],
  max_tokens: 500
}
```

### データプライバシー
- APIキーはローカルストレージに保存
- チャット履歴もローカルに保存
- サーバーには送信されません

## トラブルシューティング

### APIエラー
- APIキーが正しいか確認
- APIクレジットが残っているか確認
- ネットワーク接続を確認

### 画像が表示されない
- ブラウザの設定でJavaScriptが有効か確認
- コンソールでエラーを確認

## 技術仕様

- **フロントエンド**: Pure HTML/CSS/JavaScript
- **依存関係**: なし（単一HTMLファイル）
- **ブラウザ互換性**: Chrome, Firefox, Safari, Edge

## 今後の実装予定

- ✅ 複数AI対応
- ✅ 深い思考モード
- ✅ 画像生成
- ✅ ファイル添付
- 🚧 Canvas機能（HTMLエディタ）
- 🚧 音声入力/出力
- 🚧 プラグインシステム
- 🚧 チーム共有機能

## ライセンス
MIT License

## 作者
dark-AI Development Team

## サポート
問題が発生した場合は、GitHubのIssuesでご報告ください。

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-16
