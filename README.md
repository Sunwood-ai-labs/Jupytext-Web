# Jupytext-Web

ブラウザだけで動く Jupytext コンバータです！GitHub Pages で動作します。

## 概要

Jupytext-Web は、Jupyter Notebook (`.ipynb`) と Python スクリプト (`.py`)、Markdown (`.md`) などを相互変換できる Web アプリケーションです。

- **サーバー不要**: すべてブラウザ内で完結
- **Pyodide 使用**: ブラウザ内で Python を実行
- **Jupytext**: Jupyter の公式ツールを使用して変換

## デモ

GitHub Pages でホストされているため、以下の URL からすぐに使えます：

🔗 **https://Sunwood-ai-labs.github.io/Jupytext-Web/**

## 使い方

1. **ファイルを選択**: 変換したいファイル（`.ipynb`, `.py`, `.md` など）を選択
2. **変換先フォーマットを選択**: ドロップダウンから変換先のフォーマットを選択
3. **変換する**: ボタンをクリックすると、変換後のファイルが自動的にダウンロードされます

## 対応フォーマット

### 入力

- Jupyter Notebook (`.ipynb`)
- Python スクリプト (`.py`)
- Markdown (`.md`)
- その他 Jupytext が対応するフォーマット

### 出力

- `ipynb` - Jupyter Notebook
- `py:percent` - Python スクリプト（`# %%` スタイル）
- `py:light` - Python スクリプト（軽量スタイル）
- `md` - Markdown
- `myst` - MyST Markdown

## 技術スタック

- **Pyodide** (v0.26.2): ブラウザ内で Python を実行
- **Jupytext**: Jupyter Notebook と各種フォーマットの相互変換
- **Pure HTML/CSS/JavaScript**: フレームワーク不要のシンプルな構成

## ローカルでの実行

このプロジェクトは静的な HTML ファイルのみで構成されているため、以下の方法で簡単に実行できます：

### 方法1: 直接開く

`index.html` をブラウザで直接開く

### 方法2: ローカルサーバーを起動

```bash
# Python 3 の場合
python -m http.server 8000

# Node.js の場合
npx serve
```

その後、ブラウザで `http://localhost:8000` を開く

## GitHub Pages へのデプロイ

このリポジトリは GitHub Pages で自動的にデプロイされます。

### 設定手順

1. リポジトリの **Settings** → **Pages** を開く
2. **Source** で `Deploy from a branch` を選択
3. **Branch** で `main` / `/ (root)` を選択
4. **Save** をクリック

数分後、`https://<username>.github.io/Jupytext-Web/` でアクセスできるようになります。

## 初回ロード時間について

初回アクセス時は、Pyodide と Jupytext のインストールに **30秒〜1分程度** かかる場合があります。

- Pyodide のダウンロード: 約 10MB
- Jupytext と依存パッケージのインストール

2回目以降は、ブラウザのキャッシュにより高速に起動します。

## 制限事項

- ファイルサイズが大きすぎる場合、ブラウザのメモリ制限により変換できない可能性があります
- すべての変換がブラウザ内で行われるため、大規模なファイルの処理には時間がかかる場合があります

## ライセンス

このプロジェクトは MIT ライセンスのもとで公開されています。

## 関連リンク

- [Jupytext 公式ドキュメント](https://jupytext.readthedocs.io/)
- [Pyodide 公式サイト](https://pyodide.org/)
- [Jupyter Notebook](https://jupyter.org/)

## 貢献

バグ報告や機能リクエストは、[Issues](https://github.com/Sunwood-ai-labs/Jupytext-Web/issues) からお願いします！

---

Made with ❤️ by Sunwood AI Labs
