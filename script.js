// グローバル変数
let pyodide = null;
let jupytextReady = false;
let currentFile = null;
let currentInputMode = 'file'; // 'file' or 'text'
let editor = null; // Ace Editor インスタンス

// DOM要素の取得
const elements = {
  status: document.getElementById("status"),
  convertBtn: document.getElementById("convert"),
  preview: document.getElementById("preview"),
  previewContent: document.getElementById("preview-content"),
  fileInput: document.getElementById("file"),
  fileInfo: document.getElementById("file-info"),
  fileDropZone: document.getElementById("file-drop-zone"),
  fileName: document.getElementById("file-name"),
  fileSize: document.getElementById("file-size"),
  removeFileBtn: document.getElementById("remove-file"),
  progressContainer: document.getElementById("progress-container"),
  progressFill: document.getElementById("progress-fill"),
  toFormat: document.getElementById("to-format"),
  copyBtn: document.getElementById("copy-btn"),
  addTimestamp: document.getElementById("add-timestamp"),
  // Tab elements
  tabFile: document.getElementById("tab-file"),
  tabText: document.getElementById("tab-text"),
  fileUploadSection: document.getElementById("file-upload-section"),
  textInputSection: document.getElementById("text-input-section"),
  // Text input elements
  textInput: document.getElementById("text-input"),
  textCharCount: document.getElementById("text-char-count"),
  clearTextBtn: document.getElementById("clear-text"),
  textInputFormat: document.getElementById("text-input-format")
};

// ステータスメッセージを表示
function showStatus(message, type = 'info') {
  elements.status.textContent = message;
  elements.status.className = `status show ${type}`;
}

// ステータスを非表示
function hideStatus() {
  elements.status.classList.remove('show');
}

// プログレスバーを表示
function showProgress(percent) {
  elements.progressContainer.classList.add('show');
  elements.progressFill.style.width = `${percent}%`;
}

// プログレスバーを非表示
function hideProgress() {
  elements.progressContainer.classList.remove('show');
  elements.progressFill.style.width = '0%';
}

// プレビューを表示
function showPreview(content) {
  elements.previewContent.textContent = content;
  elements.preview.classList.add('show');
}

// プレビューを非表示
function hidePreview() {
  elements.preview.classList.remove('show');
  elements.previewContent.textContent = '';
}

// ファイル情報を表示
function showFileInfo(file) {
  currentFile = file;
  const sizeKB = (file.size / 1024).toFixed(2);
  elements.fileName.textContent = file.name;
  elements.fileSize.textContent = `${sizeKB} KB`;
  elements.fileInfo.classList.add('show');
  elements.fileDropZone.classList.add('has-file');
}

// ファイル情報をクリア
function clearFileInfo() {
  currentFile = null;
  elements.fileInfo.classList.remove('show');
  elements.fileDropZone.classList.remove('has-file');
  elements.fileInput.value = '';
  hidePreview();
}

// Pyodideとjupytextの初期化
async function initPyodideAndJupytext() {
  try {
    showStatus("Pyodide を読み込み中...", "info");
    showProgress(10);

    pyodide = await loadPyodide();
    showProgress(40);

    showStatus("jupytext と依存パッケージをインストール中...", "info");
    await pyodide.loadPackage("micropip");
    showProgress(60);

    await pyodide.runPythonAsync(`
import micropip
await micropip.install(["jupytext", "nbformat"])
    `);
    showProgress(100);

    jupytextReady = true;

    setTimeout(() => {
      hideProgress();
      showStatus("準備完了！ファイルを選んで変換できます。", "success");
      elements.convertBtn.textContent = "🚀 変換する";
      elements.convertBtn.disabled = false;
    }, 500);
  } catch (e) {
    console.error(e);
    hideProgress();
    showStatus("初期化に失敗しました。コンソールを確認してください。", "error");
    elements.convertBtn.disabled = true;
  }
}

// テキストから変換処理
async function convertTextWithJupytext(content, fromFormat, toFormat) {
  const pyCode = `
from jupytext import reads, writes

content = ${JSON.stringify(content)}
from_format = ${JSON.stringify(fromFormat)}
to_format = ${JSON.stringify(toFormat)}

# Read the content with the specified format
nb = reads(content, from_format)

# Convert to the target format
out_text = writes(nb, to_format)
  `;

  await pyodide.runPythonAsync(pyCode);

  const outText = pyodide.globals.get("out_text");
  return outText;
}

// ファイル変換処理
async function convertWithJupytext(file, toFormat) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const textDecoder = new TextDecoder("utf-8");
  const content = textDecoder.decode(bytes);

  const fileName = file.name;

  const pyCode = `
from jupytext import reads, writes

content = ${JSON.stringify(content)}
filename = ${JSON.stringify(fileName)}
to_format = ${JSON.stringify(toFormat)}

if filename.endswith(".ipynb"):
    nb = reads(content, "ipynb")
else:
    nb = reads(content, None)

out_text = writes(nb, to_format)
  `;

  await pyodide.runPythonAsync(pyCode);

  const outText = pyodide.globals.get("out_text");
  return outText;
}

// ファイルダウンロード
function downloadFile(content, fileName) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ファイルを処理
function handleFile(file) {
  if (!file) return;

  hidePreview();
  showFileInfo(file);
}

// タブ切り替え関数
function switchInputMode(mode) {
  currentInputMode = mode;

  // タブボタンの状態を更新
  if (mode === 'file') {
    elements.tabFile.classList.add('active');
    elements.tabText.classList.remove('active');
    elements.fileUploadSection.classList.add('active');
    elements.textInputSection.classList.remove('active');
  } else {
    elements.tabText.classList.add('active');
    elements.tabFile.classList.remove('active');
    elements.textInputSection.classList.add('active');
    elements.fileUploadSection.classList.remove('active');
  }

  // プレビューをクリア
  hidePreview();
}

// テキスト文字数を更新
function updateCharCount() {
  const charCount = editor ? editor.getValue().length : 0;
  elements.textCharCount.textContent = `${charCount.toLocaleString()} 文字`;
}

// Ace Editorの初期化
function initAceEditor() {
  editor = ace.edit("text-input");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/markdown");
  editor.setOptions({
    fontSize: "14px",
    showPrintMargin: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    wrap: true
  });

  // エディターの内容が変更されたら文字数を更新
  editor.session.on('change', function() {
    updateCharCount();
  });
}

// フォーマットに基づいて言語モードを設定
function setEditorMode(format) {
  if (!editor) return;

  const modeMap = {
    'ipynb': 'ace/mode/json',
    'py': 'ace/mode/python',
    'md': 'ace/mode/markdown',
    'myst': 'ace/mode/markdown'
  };

  const mode = modeMap[format] || 'ace/mode/text';
  editor.session.setMode(mode);
}

// イベントリスナー

// タブ切り替え
elements.tabFile.addEventListener("click", () => {
  switchInputMode('file');
});

elements.tabText.addEventListener("click", () => {
  switchInputMode('text');
});

// テキストクリアボタン
elements.clearTextBtn.addEventListener("click", () => {
  if (editor) {
    editor.setValue('');
    editor.clearSelection();
  }
  updateCharCount();
  hidePreview();
});

// テキスト入力フォーマットの変更
elements.textInputFormat.addEventListener("change", () => {
  const format = elements.textInputFormat.value;
  setEditorMode(format);
});

// ファイル入力の変更
elements.fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// ドロップゾーンのクリック
elements.fileDropZone.addEventListener("click", () => {
  elements.fileInput.click();
});

// ドラッグ&ドロップ処理
elements.fileDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  elements.fileDropZone.classList.add("drag-over");
});

elements.fileDropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  elements.fileDropZone.classList.remove("drag-over");
});

elements.fileDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  elements.fileDropZone.classList.remove("drag-over");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    // ファイル入力に設定
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);
    elements.fileInput.files = dataTransfer.files;

    handleFile(files[0]);
  }
});

// ファイル削除ボタン
elements.removeFileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  clearFileInfo();
});

// 変換ボタン
elements.convertBtn.addEventListener("click", async () => {
  hidePreview();

  if (!jupytextReady) {
    showStatus("まだ初期化中です。少し待ってから再度お試しください。", "error");
    return;
  }

  const toFormat = elements.toFormat.value;

  // 入力モードに応じた検証
  if (currentInputMode === 'file') {
    if (!currentFile) {
      showStatus("ファイルを選択してください。", "error");
      return;
    }
  } else {
    const editorContent = editor ? editor.getValue().trim() : '';
    if (!editorContent) {
      showStatus("テキストを入力してください。", "error");
      return;
    }
  }

  showStatus("変換中...", "info");
  showProgress(0);
  elements.convertBtn.disabled = true;

  try {
    // プログレスバーのアニメーション
    showProgress(30);

    let outText;
    let downloadName;

    // タイムスタンプを生成（YYYYMMDD_HHMMSS形式）
    let timestamp = '';
    if (elements.addTimestamp.checked) {
      const now = new Date();
      timestamp = '_' + now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    }

    if (currentInputMode === 'file') {
      // ファイルモード
      outText = await convertWithJupytext(currentFile, toFormat);

      // 拡張子決定
      const baseName = currentFile.name.replace(/\.[^.]+$/, "");
      const ext = toFormat === "ipynb" ? "ipynb" : toFormat.split(":")[0];
      downloadName = `${baseName}${timestamp}.${ext}`;
    } else {
      // テキストモード
      const fromFormat = elements.textInputFormat.value;
      const textContent = editor.getValue();

      outText = await convertTextWithJupytext(textContent, fromFormat, toFormat);

      // ファイル名決定
      const ext = toFormat === "ipynb" ? "ipynb" : toFormat.split(":")[0];

      // マークダウンの # 見出しからファイル名を抽出
      let baseName = 'converted';
      const lines = textContent.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) {
          // # の後の文字列を取得し、ファイル名として使用可能な形式に変換
          const heading = trimmedLine.replace(/^#+\s*/, '').trim();
          if (heading) {
            // ファイル名として使用できない文字を削除または置換
            baseName = heading
              .replace(/[/\\?%*:|"<>]/g, '-') // 無効な文字をハイフンに
              .replace(/\s+/g, '_') // 空白をアンダースコアに
              .substring(0, 100); // 長すぎる場合は切り詰め
            break;
          }
        }
      }

      downloadName = `${baseName}${timestamp}.${ext}`;
    }

    showProgress(70);
    showProgress(90);

    // ダウンロード
    downloadFile(outText, downloadName);

    showProgress(100);

    showStatus("✅ 変換完了！ファイルをダウンロードしました。", "success");

    // プレビュー表示
    const previewText = outText.length > 5000
      ? outText.slice(0, 5000) + "\n\n... (プレビューは先頭5000文字まで)"
      : outText;

    showPreview(previewText);

    setTimeout(() => {
      hideProgress();
    }, 1000);

  } catch (e) {
    console.error(e);
    hideProgress();
    showStatus("❌ 変換に失敗しました。入力内容やコンソールを確認してください。", "error");
  } finally {
    elements.convertBtn.disabled = false;
  }
});

// コピーボタン
elements.copyBtn.addEventListener("click", async () => {
  const content = elements.previewContent.textContent;
  try {
    await navigator.clipboard.writeText(content);
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = "✓ コピーしました!";
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error("コピーに失敗しました:", err);
  }
});

// 初期化開始
initPyodideAndJupytext();

// Ace Editorの初期化（ページ読み込み時）
window.addEventListener('load', function() {
  initAceEditor();
});
