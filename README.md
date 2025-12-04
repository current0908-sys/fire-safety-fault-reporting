# 機電消防故障回報系統

一個現代化的機電消防設備故障回報與管理系統，使用 Next.js、TypeScript 和 SQLite 構建。

## 功能特色

- ✅ **故障報告**：快速提交故障報告，包含詳細資訊
- 📊 **統計儀表板**：即時查看故障統計數據
- 🔍 **篩選功能**：依狀態和優先級篩選故障報告
- 📝 **狀態管理**：更新故障處理狀態、指派處理人員、添加處理備註
- 🎨 **現代化 UI**：美觀且易用的使用者介面
- 💾 **本地資料庫**：使用 SQLite 儲存資料，無需額外設定

## 技術棧

- **前端框架**：Next.js 14 (React 18)
- **程式語言**：TypeScript
- **資料庫**：SQLite (better-sqlite3)
- **樣式**：Tailwind CSS
- **日期處理**：date-fns

## 安裝步驟

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

系統將在 [http://localhost:3000](http://localhost:3000) 啟動。

### 3. 建置生產版本

```bash
npm run build
npm start
```

## 使用說明

### 新增故障報告

1. 點擊「+ 新增故障報告」按鈕
2. 填寫以下資訊：
   - 報告人姓名（必填）
   - 聯絡電話（必填）
   - 故障位置（必填）
   - 設備類型（必填）
   - 優先級（必填）
   - 故障描述（必填）
3. 點擊「提交報告」

### 查看故障列表

- 主頁面顯示所有故障報告卡片
- 使用頂部的篩選器可以依狀態或優先級篩選
- 點擊故障卡片可查看詳細資訊

### 更新故障狀態

1. 點擊故障卡片打開詳情頁面
2. 在「更新狀態」區域：
   - 選擇新的狀態（待處理、處理中、已解決、已關閉）
   - 可選：指派處理人員
   - 可選：添加處理備註
3. 點擊「更新狀態」按鈕

## 資料庫結構

系統使用 SQLite 資料庫，資料庫檔案位於 `data/faults.db`。

### 故障表 (faults)

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵，自動遞增 |
| reporter_name | TEXT | 報告人姓名 |
| reporter_phone | TEXT | 聯絡電話 |
| location | TEXT | 故障位置 |
| equipment_type | TEXT | 設備類型 |
| fault_description | TEXT | 故障描述 |
| priority | TEXT | 優先級 (low/medium/high/urgent) |
| status | TEXT | 狀態 (pending/in_progress/resolved/closed) |
| created_at | DATETIME | 建立時間 |
| updated_at | DATETIME | 更新時間 |
| assigned_to | TEXT | 指派處理人員 |
| resolution_notes | TEXT | 處理備註 |

## API 端點

### GET /api/faults
獲取所有故障報告
- 查詢參數：
  - `status`: 篩選狀態
  - `priority`: 篩選優先級

### POST /api/faults
創建新故障報告
- 請求體：故障報告資料

### GET /api/faults/[id]
獲取單個故障詳情

### PATCH /api/faults/[id]
更新故障狀態
- 請求體：`{ status, assigned_to?, resolution_notes? }`

### DELETE /api/faults/[id]
刪除故障報告

### GET /api/statistics
獲取統計資訊

## 專案結構

```
.
├── app/
│   ├── api/              # API 路由
│   ├── globals.css       # 全域樣式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主頁面
├── components/           # React 組件
│   ├── FaultCard.tsx    # 故障卡片
│   ├── FaultDetail.tsx  # 故障詳情
│   ├── FaultForm.tsx    # 故障表單
│   ├── FaultList.tsx    # 故障列表
│   └── Statistics.tsx   # 統計組件
├── lib/
│   └── db.ts            # 資料庫操作
├── data/                # 資料庫檔案目錄
└── package.json
```

## 注意事項

- 資料庫檔案 (`data/faults.db`) 會在首次運行時自動創建
- 請確保有寫入 `data/` 目錄的權限
- 生產環境建議使用更強大的資料庫（如 PostgreSQL）

## 授權

MIT License





