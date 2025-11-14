// グローバル変数
let pyodide = null;
let jupytextReady = false;
let currentFile = null;
let currentInputMode = 'file'; // 'file' or 'text'
let editor = null; // Ace Editor インスタンス
let currentLanguage = 'ja'; // デフォルト言語は日本語

// 翻訳データ
const translations = {
  ja: {
    // Hero section
    heroTitle: '📓 Jupytext Web Converter',
    heroSubtitle: 'ブラウザだけで動く Jupytext コンバータ(GitHub Pages 対応)。',
    heroSubtitle2: ' などを滑らかに往復変換します。',
    tagBeta: 'Web · Pyodide',
    tagFormat: 'ipynb ⇆ py ⇆ md',
    highlightPyodide: 'Pyodide 上でネイティブに動作',
    highlightDrag: 'ドラッグ＆ドロップですぐ変換',
    highlightLocal: 'ローカルのみで完結・安全',

    // Input section
    inputMethodTitle: '入力方法を選択',
    inputMethodDesc: 'ファイルまたはテキストから変換できます。',
    tabFile: '📁 ファイルアップロード',
    tabText: '📝 テキスト入力',

    // File upload
    labelFile: '📁 入力ファイル',
    uploadDrag: 'ファイルをドラッグ＆ドロップ',
    uploadClick: 'または クリックしてファイルを選択',
    removeFile: '✕ 削除',

    // Text input
    labelTextInput: '📝 テキストを入力',
    textCharCount: '文字',
    clearText: '✕ クリア',
    labelInputFormat: '📋 入力フォーマット',

    // Format options
    formatIpynb: '📓 ipynb (Jupyter Notebook)',
    formatPy: '🐍 py (Python)',
    formatMd: '📝 md (Markdown)',
    formatMyst: '📝 myst (MyST Markdown)',
    formatPyPercent: '🐍 py:percent (Python with %% cells)',
    formatPyLight: '🐍 py:light (Python light format)',

    // Convert section
    labelToFormat: '🔄 変換先フォーマット',
    labelTimestamp: '🕐 ファイル名にタイムスタンプを追加',
    btnConvert: '🚀 変換する',
    btnLoading: '⏳ Pyodide 読み込み中...',

    // Preview section
    previewEyebrow: 'ライブプレビュー',
    previewTitle: '変換結果を即チェック',
    previewCopy: '📋 コピー',
    previewHeader: '📋 プレビュー',
    previewPlaceholder: 'ここに変換結果が表示されます。',
    previewHint: 'ファイルをアップロードして開始しましょう。',

    // Status messages
    statusPyodideLoading: 'Pyodide を読み込み中...',
    statusInstalling: 'jupytext と依存パッケージをインストール中...',
    statusReady: '準備完了！ファイルを選んで変換できます。',
    statusInitError: '初期化に失敗しました。コンソールを確認してください。',
    statusConverting: '変換中...',
    statusSelectFile: 'ファイルを選択してください。',
    statusInputText: 'テキストを入力してください。',
    statusSuccess: '✅ 変換完了！ファイルをダウンロードしました。',
    statusError: '❌ 変換に失敗しました。入力内容やコンソールを確認してください。',
    statusWait: 'まだ初期化中です。少し待ってから再度お試しください。',
    copySuccess: '✓ コピーしました!',
    copyError: 'コピーに失敗しました:',

    // Footer
    footerPowered: 'Powered by Pyodide × Jupytext',
    footerSecure: 'データはすべてブラウザ内で完結します。'
  },
  en: {
    // Hero section
    heroTitle: '📓 Jupytext Web Converter',
    heroSubtitle: 'Browser-based Jupytext converter (GitHub Pages compatible).',
    heroSubtitle2: ' and more seamlessly.',
    tagBeta: 'Web · Pyodide',
    tagFormat: 'ipynb ⇆ py ⇆ md',
    highlightPyodide: 'Native on Pyodide',
    highlightDrag: 'Quick convert via drag & drop',
    highlightLocal: 'Secure & local processing',

    // Input section
    inputMethodTitle: 'Choose Input Method',
    inputMethodDesc: 'Convert from file or text.',
    tabFile: '📁 File Upload',
    tabText: '📝 Text Input',

    // File upload
    labelFile: '📁 Input File',
    uploadDrag: 'Drag & drop file here',
    uploadClick: 'or Click to select file',
    removeFile: '✕ Remove',

    // Text input
    labelTextInput: '📝 Input Text',
    textCharCount: 'chars',
    clearText: '✕ Clear',
    labelInputFormat: '📋 Input Format',

    // Format options
    formatIpynb: '📓 ipynb (Jupyter Notebook)',
    formatPy: '🐍 py (Python)',
    formatMd: '📝 md (Markdown)',
    formatMyst: '📝 myst (MyST Markdown)',
    formatPyPercent: '🐍 py:percent (Python with %% cells)',
    formatPyLight: '🐍 py:light (Python light format)',

    // Convert section
    labelToFormat: '🔄 Target Format',
    labelTimestamp: '🕐 Add timestamp to filename',
    btnConvert: '🚀 Convert',
    btnLoading: '⏳ Loading Pyodide...',

    // Preview section
    previewEyebrow: 'Live Preview',
    previewTitle: 'Check Result Instantly',
    previewCopy: '📋 Copy',
    previewHeader: '📋 Preview',
    previewPlaceholder: 'Conversion result will be displayed here.',
    previewHint: 'Upload a file to get started.',

    // Status messages
    statusPyodideLoading: 'Loading Pyodide...',
    statusInstalling: 'Installing jupytext and dependencies...',
    statusReady: 'Ready! Select a file to convert.',
    statusInitError: 'Initialization failed. Please check console.',
    statusConverting: 'Converting...',
    statusSelectFile: 'Please select a file.',
    statusInputText: 'Please input text.',
    statusSuccess: '✅ Conversion complete! File downloaded.',
    statusError: '❌ Conversion failed. Please check your input or console.',
    statusWait: 'Still initializing. Please wait and try again.',
    copySuccess: '✓ Copied!',
    copyError: 'Copy failed:',

    // Footer
    footerPowered: 'Powered by Pyodide × Jupytext',
    footerSecure: 'All data is processed locally in your browser.'
  }
};

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

// 言語切り替え関数
function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  updateUILanguage();
}

// UIの言語を更新
function updateUILanguage() {
  const t = translations[currentLanguage];

  // Hero section
  document.querySelector('h1').textContent = t.heroTitle;
  document.querySelector('.subtitle').innerHTML = t.heroSubtitle + '<br /><code>.ipynb</code>, <code>.py</code>, <code>.md</code>' + t.heroSubtitle2;
  document.querySelector('.tag.beta').textContent = t.tagBeta;
  document.querySelector('.tag.format').textContent = t.tagFormat;

  const highlights = document.querySelectorAll('.highlight small');
  highlights[0].textContent = t.highlightPyodide;
  highlights[1].textContent = t.highlightDrag;
  highlights[2].textContent = t.highlightLocal;

  // Input section
  document.querySelector('.panel-primary h2').textContent = t.inputMethodTitle;
  document.querySelector('.panel-lead').textContent = t.inputMethodDesc;
  elements.tabFile.textContent = t.tabFile;
  elements.tabText.textContent = t.tabText;

  // File upload
  document.querySelector('label[for="file"]').textContent = t.labelFile;
  document.querySelector('.upload-text').textContent = t.uploadDrag;
  document.querySelector('.upload-hint').textContent = t.uploadClick;
  elements.removeFileBtn.textContent = t.removeFile;

  // Text input
  document.querySelector('label[for="text-input"]').textContent = t.labelTextInput;
  elements.clearTextBtn.textContent = t.clearText;
  document.querySelector('label[for="text-input-format"]').textContent = t.labelInputFormat;

  // Format options
  const textInputFormatOptions = elements.textInputFormat.querySelectorAll('option');
  textInputFormatOptions[0].textContent = t.formatIpynb;
  textInputFormatOptions[1].textContent = t.formatPy;
  textInputFormatOptions[2].textContent = t.formatMd;
  textInputFormatOptions[3].textContent = t.formatMyst;

  const toFormatOptions = elements.toFormat.querySelectorAll('option');
  toFormatOptions[0].textContent = t.formatIpynb;
  toFormatOptions[1].textContent = t.formatPyPercent;
  toFormatOptions[2].textContent = t.formatPyLight;
  toFormatOptions[3].textContent = t.formatMd;
  toFormatOptions[4].textContent = t.formatMyst;

  // Convert section
  document.querySelector('label[for="to-format"]').textContent = t.labelToFormat;
  document.querySelector('label[for="add-timestamp"] span').textContent = t.labelTimestamp;

  // Convert button
  if (jupytextReady) {
    elements.convertBtn.textContent = t.btnConvert;
  } else {
    elements.convertBtn.textContent = t.btnLoading;
  }

  // Preview section
  document.querySelector('.eyebrow').textContent = t.previewEyebrow;
  document.querySelector('.panel-preview h2').textContent = t.previewTitle;
  elements.copyBtn.textContent = t.previewCopy;
  document.querySelector('.preview-title').textContent = t.previewHeader;
  document.querySelector('#preview-placeholder p').textContent = t.previewPlaceholder;
  document.querySelector('#preview-placeholder span').textContent = t.previewHint;

  // Footer
  document.querySelector('.footer-text').textContent = t.footerPowered;
  document.querySelector('.footer-subtext').textContent = t.footerSecure;

  // Update character count
  updateCharCount();
}

// 初期言語設定を読み込み
function initLanguage() {
  const savedLang = localStorage.getItem('language');
  if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
  }
  updateUILanguage();

  // 言語ボタンの状態を更新
  updateLanguageButtons();
}

// 言語ボタンの状態を更新
function updateLanguageButtons() {
  const jaBtn = document.getElementById('lang-ja');
  const enBtn = document.getElementById('lang-en');

  if (!jaBtn || !enBtn) return;

  if (currentLanguage === 'ja') {
    jaBtn.classList.add('active');
    enBtn.classList.remove('active');
  } else {
    enBtn.classList.add('active');
    jaBtn.classList.remove('active');
  }
}

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
    const t = translations[currentLanguage];
    showStatus(t.statusPyodideLoading, "info");
    showProgress(10);

    pyodide = await loadPyodide();
    showProgress(40);

    showStatus(t.statusInstalling, "info");
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
      showStatus(t.statusReady, "success");
      elements.convertBtn.textContent = t.btnConvert;
      elements.convertBtn.disabled = false;
    }, 500);
  } catch (e) {
    console.error(e);
    hideProgress();
    const t = translations[currentLanguage];
    showStatus(t.statusInitError, "error");
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
  const t = translations[currentLanguage];
  elements.textCharCount.textContent = `${charCount.toLocaleString()} ${t.textCharCount}`;
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

  const t = translations[currentLanguage];

  if (!jupytextReady) {
    showStatus(t.statusWait, "error");
    return;
  }

  const toFormat = elements.toFormat.value;

  // 入力モードに応じた検証
  if (currentInputMode === 'file') {
    if (!currentFile) {
      showStatus(t.statusSelectFile, "error");
      return;
    }
  } else {
    const editorContent = editor ? editor.getValue().trim() : '';
    if (!editorContent) {
      showStatus(t.statusInputText, "error");
      return;
    }
  }

  showStatus(t.statusConverting, "info");
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

    showStatus(t.statusSuccess, "success");

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
    showStatus(t.statusError, "error");
  } finally {
    elements.convertBtn.disabled = false;
  }
});

// コピーボタン
elements.copyBtn.addEventListener("click", async () => {
  const content = elements.previewContent.textContent;
  const t = translations[currentLanguage];
  try {
    await navigator.clipboard.writeText(content);
    const originalText = elements.copyBtn.textContent;
    elements.copyBtn.textContent = t.copySuccess;
    setTimeout(() => {
      elements.copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    console.error(t.copyError, err);
  }
});

// 初期化開始
window.addEventListener('DOMContentLoaded', function() {
  // 言語設定を初期化
  initLanguage();

  // 言語切り替えボタンのイベントリスナーを設定
  const jaBtn = document.getElementById('lang-ja');
  const enBtn = document.getElementById('lang-en');

  if (jaBtn) {
    jaBtn.addEventListener('click', () => switchLanguage('ja'));
  }
  if (enBtn) {
    enBtn.addEventListener('click', () => switchLanguage('en'));
  }

  // Pyodide初期化
  initPyodideAndJupytext();
});

// Ace Editorの初期化（ページ読み込み時）
window.addEventListener('load', function() {
  initAceEditor();
});
