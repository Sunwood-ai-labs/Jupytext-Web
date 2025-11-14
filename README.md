<div align="center">

# 📓 Jupytext-Web

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://Sunwood-ai-labs.github.io/Jupytext-Web/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pyodide](https://img.shields.io/badge/Pyodide-v0.26.2-blue)](https://pyodide.org/)
[![Jupytext](https://img.shields.io/badge/Jupytext-Enabled-orange)](https://jupytext.readthedocs.io/)

**🌐 ブラウザだけで動く Jupytext コンバータ 🚀**

[🎯 デモを試す](https://Sunwood-ai-labs.github.io/Jupytext-Web/) | [📖 ドキュメント](#使い方) | [🐛 バグ報告](https://github.com/Sunwood-ai-labs/Jupytext-Web/issues)

</div>

---

## 📋 概要

**Jupytext-Web** は、Jupyter Notebook (`.ipynb`) と Python スクリプト (`.py`)、Markdown (`.md`) などを相互変換できる **完全ブラウザベース** の Web アプリケーションです。

### ✨ 主な特徴

- 🚫 **サーバー不要**: すべてブラウザ内で完結
- 🐍 **Pyodide 使用**: ブラウザ内で Python を実行
- 📝 **Jupytext**: Jupyter の公式ツールを使用して変換
- 🔒 **プライバシー保護**: ファイルはローカルで処理され、外部に送信されません
- ⚡ **高速変換**: キャッシュにより2回目以降は高速に起動

---

## 🎯 デモ

GitHub Pages でホストされているため、以下の URL からすぐに使えます：

### 🔗 [**https://Sunwood-ai-labs.github.io/Jupytext-Web/**](https://Sunwood-ai-labs.github.io/Jupytext-Web/)

> 💡 **ヒント**: 初回アクセス時は Pyodide と Jupytext のインストールに30秒〜1分程度かかります

---

## 🚀 使い方

### 📝 3ステップで簡単変換

1. **📁 ファイルを選択**: 変換したいファイル（`.ipynb`, `.py`, `.md` など）を選択
2. **🎨 変換先フォーマットを選択**: ドロップダウンから変換先のフォーマットを選択
3. **✨ 変換する**: ボタンをクリックすると、変換後のファイルが自動的にダウンロードされます

---

## 📦 対応フォーマット

<table>
<tr>
<td>

### 📥 入力形式

- 📓 **Jupyter Notebook** (`.ipynb`)
- 🐍 **Python スクリプト** (`.py`)
- 📝 **Markdown** (`.md`)
- 🔧 **その他 Jupytext 対応形式**

</td>
<td>

### 📤 出力形式

- `ipynb` - 📓 Jupyter Notebook
- `py:percent` - 🐍 Python スクリプト（`# %%` スタイル）
- `py:light` - 🐍 Python スクリプト（軽量スタイル）
- `md` - 📝 Markdown
- `myst` - 📚 MyST Markdown

</td>
</tr>
</table>

---

## 🛠️ 技術スタック

<div align="center">

| 技術 | バージョン | 説明 |
|------|-----------|------|
| 🐍 **Pyodide** | v0.26.2 | ブラウザ内で Python を実行 |
| 📝 **Jupytext** | Latest | Jupyter Notebook と各種フォーマットの相互変換 |
| 🌐 **HTML/CSS/JS** | Pure | フレームワーク不要のシンプルな構成 |

</div>

---

## 💻 ローカルでの実行

このプロジェクトは静的な HTML ファイルのみで構成されているため、以下の方法で簡単に実行できます：

### 📌 方法1: 直接開く

```bash
# ブラウザで直接開く
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

### 📌 方法2: ローカルサーバーを起動

<details>
<summary>🐍 Python を使用する場合</summary>

```bash
# Python 3 の場合
python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開く

</details>

<details>
<summary>📦 Node.js を使用する場合</summary>

```bash
# npx を使う（インストール不要）
npx serve

# または http-server をグローバルインストール
npm install -g http-server
http-server
```

その後、表示された URL をブラウザで開く

</details>

---

## 🚀 GitHub Pages へのデプロイ

このリポジトリは GitHub Pages で自動的にデプロイされます。

### 📝 設定手順

1. リポジトリの **Settings** → **Pages** を開く
2. **Source** で `Deploy from a branch` を選択
3. **Branch** で `main` / `/ (root)` を選択
4. **Save** をクリック

> ⏱️ 数分後、`https://<username>.github.io/Jupytext-Web/` でアクセスできるようになります

---

## ⏱️ 初回ロード時間について

初回アクセス時は、Pyodide と Jupytext のインストールに **30秒〜1分程度** かかる場合があります。

### 📊 ロード内訳

- 🐍 **Pyodide のダウンロード**: 約 10MB
- 📦 **Jupytext と依存パッケージのインストール**: 約 20〜30秒

> ⚡ **2回目以降は高速**: ブラウザのキャッシュにより数秒で起動します

---

## ⚠️ 制限事項

<table>
<tr>
<td>⚠️</td>
<td><strong>ファイルサイズ制限</strong></td>
<td>ファイルサイズが大きすぎる場合、ブラウザのメモリ制限により変換できない可能性があります</td>
</tr>
<tr>
<td>⏳</td>
<td><strong>処理時間</strong></td>
<td>すべての変換がブラウザ内で行われるため、大規模なファイルの処理には時間がかかる場合があります</td>
</tr>
<tr>
<td>🌐</td>
<td><strong>ブラウザ要件</strong></td>
<td>モダンブラウザ（Chrome、Firefox、Safari、Edge の最新版）が必要です</td>
</tr>
</table>

---

## 📄 ライセンス

このプロジェクトは **MIT ライセンス** のもとで公開されています。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

詳細は [LICENSE](LICENSE) ファイルをご覧ください。

---

## 🔗 関連リンク

<div align="center">

| リソース | 説明 | リンク |
|---------|------|--------|
| 📝 **Jupytext** | 公式ドキュメント | [jupytext.readthedocs.io](https://jupytext.readthedocs.io/) |
| 🐍 **Pyodide** | 公式サイト | [pyodide.org](https://pyodide.org/) |
| 📓 **Jupyter** | Jupyter Notebook | [jupyter.org](https://jupyter.org/) |

</div>

---

## 🤝 貢献

プロジェクトへの貢献を歓迎します！

### 🐛 バグ報告

バグを発見した場合は、[Issues](https://github.com/Sunwood-ai-labs/Jupytext-Web/issues) から報告してください。

### 💡 機能リクエスト

新機能のアイデアがある場合も、[Issues](https://github.com/Sunwood-ai-labs/Jupytext-Web/issues) からお気軽にご提案ください。

### 🔀 プルリクエスト

プルリクエストも大歓迎です！以下の手順で貢献できます：

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

<div align="center">

### 💖 Made with Love by

**[Sunwood AI Labs](https://github.com/Sunwood-ai-labs)**

[![GitHub](https://img.shields.io/badge/GitHub-Sunwood--ai--labs-181717?style=flat&logo=github)](https://github.com/Sunwood-ai-labs)

---

⭐ このプロジェクトが役に立ったら、スターをつけていただけると嬉しいです！

</div>
