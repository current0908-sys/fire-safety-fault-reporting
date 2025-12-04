# 安裝指南

## 系統需求

- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器
- Windows / macOS / Linux 作業系統

## 安裝步驟

### 1. 檢查 Node.js 版本

打開終端機（命令提示字元），執行以下命令檢查 Node.js 版本：

```bash
node --version
```

如果版本低於 18.0，請前往 [Node.js 官網](https://nodejs.org/) 下載並安裝最新版本。

### 2. 安裝專案依賴

在專案根目錄下執行：

```bash
npm install
```

這會安裝以下套件：
- Next.js 14
- React 18
- TypeScript
- SQLite (better-sqlite3)
- Tailwind CSS
- 其他必要依賴

**安裝時間**：約 1-3 分鐘（視網路速度而定）

### 3. 驗證安裝

安裝完成後，檢查 `node_modules` 資料夾是否已建立：

```bash
# Windows (PowerShell)
dir node_modules

# macOS / Linux
ls node_modules
```

### 4. 啟動開發伺服器

執行以下命令啟動應用程式：

```bash
npm run dev
```

您應該會看到類似以下的訊息：

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### 5. 開啟瀏覽器

在瀏覽器中訪問：**http://localhost:3000**

資料庫會自動建立，無需手動設定！

## 常見問題

### Q: 安裝時出現錯誤 "node-gyp rebuild failed"

**解決方法**：
- Windows：安裝 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
- macOS：執行 `xcode-select --install`
- Linux：安裝 `build-essential`：`sudo apt-get install build-essential`

### Q: 安裝時出現 "permission denied" 錯誤

**解決方法**：
- Windows：以系統管理員身份執行 PowerShell
- macOS/Linux：使用 `sudo npm install`（不推薦）或使用 nvm 管理 Node.js

### Q: better-sqlite3 安裝失敗

**解決方法**：
```bash
# 清除快取後重新安裝
npm cache clean --force
npm install
```

### Q: 端口 3000 已被占用

**解決方法**：
```bash
# 使用其他端口啟動
PORT=3001 npm run dev
```

或在 `package.json` 中修改：
```json
"dev": "next dev -p 3001"
```

## 生產環境建置

### 建置專案

```bash
npm run build
```

### 啟動生產伺服器

```bash
npm start
```

## 專案結構

安裝完成後，專案結構如下：

```
機電消防/
├── app/              # Next.js 應用程式
├── components/       # React 組件
├── lib/             # 工具函數和資料庫
├── data/            # 資料庫檔案（自動建立）
├── node_modules/    # 依賴套件（安裝後產生）
├── package.json     # 專案配置
└── tsconfig.json    # TypeScript 配置
```

## 下一步

安裝完成後，請參考：
- `README.md` - 完整使用說明
- `QUICKSTART.md` - 快速開始指南

## 需要幫助？

如果遇到任何安裝問題，請檢查：
1. Node.js 版本是否符合需求
2. 網路連線是否正常
3. 終端機錯誤訊息





