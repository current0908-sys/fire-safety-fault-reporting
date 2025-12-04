// lib/db.ts
// 用記憶體模擬資料庫，方便在 Vercel 部署（沒有真正的 SQLite 檔案）

// 故障狀態型別
export type FaultStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

// 故障優先順序
export type FaultPriority = 'low' | 'medium' | 'high' | 'urgent';

// 故障資料介面
export interface Fault {
  id: number;
  reporter_name: string;
  reporter_phone: string;
  location: string;
  equipment_type: string;
  fault_description: string;
  priority: FaultPriority;
  status: FaultStatus;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  resolution_notes: string | null;
}

// 🔹 用陣列當成「假資料庫」
let faults: Fault[] = [];
let nextId = 1;

// 初始化（現在什麼都不用做，保留函式讓其他檔案可以呼叫）
export function initDatabase() {
  // 原本是建立 SQLite 資料表，現在改成什麼都不做
}

// 建立故障資料
export function createFault(
  fault: Omit<Fault, 'id' | 'created_at' | 'updated_at'>
): Fault {
  const now = new Date().toISOString();

  const newFault: Fault = {
    id: nextId++,
    reporter_name: fault.reporter_name,
    reporter_phone: fault.reporter_phone,
    location: fault.location,
    equipment_type: fault.equipment_type,
    fault_description: fault.fault_description,
    priority: fault.priority,
    status: fault.status,
    assigned_to: fault.assigned_to ?? null,
    resolution_notes: fault.resolution_notes ?? null,
    created_at: now,
    updated_at: now,
  };

  faults.push(newFault);
  return newFault;
}

// 取得所有故障（可依狀態 / 優先順序篩選）
export function getAllFaults(
  status?: FaultStatus,
  priority?: FaultPriority
): Fault[] {
  return faults
    .filter((f) => (status ? f.status === status : true))
    .filter((f) => (priority ? f.priority === priority : true))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

// 依 ID 取得單筆故障
export function getFaultById(id: number): Fault | null {
  return faults.find((f) => f.id === id) ?? null;
}

// 更新故障狀態 / 指派 / 備註
export function updateFaultStatus(
  id: number,
  status: FaultStatus,
  assigned_to?: string,
  resolution_notes?: string
): Fault | null {
  const fault = faults.find((f) => f.id === id);
  if (!fault) return null;

  fault.status = status;
  fault.assigned_to = assigned_to ?? fault.assigned_to;
  fault.resolution_notes = resolution_notes ?? fault.resolution_notes;
  fault.updated_at = new Date().toISOString();

  return fault;
}

// 刪除故障
export function deleteFault(id: number): boolean {
  const before = faults.length;
  faults = faults.filter((f) => f.id !== id);
  return faults.length < before;
}

// 統計資訊
export function getStatistics() {
  const total = faults.length;
  const pending = faults.filter((f) => f.status === 'pending').length;
  const inProgress = faults.filter((f) => f.status === 'in_progress').length;
  const resolved = faults.filter((f) => f.status === 'resolved').length;
  const closed = faults.filter((f) => f.status === 'closed').length;

  return {
    total,
    pending,
    inProgress,
    resolved,
    closed,
  };
}

// 保留 default export，若其他地方有用到
const db = {
  initDatabase,
  createFault,
  getAllFaults,
  getFaultById,
  updateFaultStatus,
  deleteFault,
  getStatistics,
};

export default db;
