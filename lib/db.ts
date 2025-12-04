import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'faults.db');
const dbDir = path.dirname(dbPath);

// 确保数据目录存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// 初始化数据库表
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS faults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_name TEXT NOT NULL,
      reporter_phone TEXT NOT NULL,
      location TEXT NOT NULL,
      equipment_type TEXT NOT NULL,
      fault_description TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      assigned_to TEXT,
      resolution_notes TEXT
    )
  `);

  // 创建索引以提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_status ON faults(status);
    CREATE INDEX IF NOT EXISTS idx_created_at ON faults(created_at);
    CREATE INDEX IF NOT EXISTS idx_priority ON faults(priority);
  `);
}

// 故障状态类型
export type FaultStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type FaultPriority = 'low' | 'medium' | 'high' | 'urgent';

// 故障接口
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

// 创建故障报告
export function createFault(fault: Omit<Fault, 'id' | 'created_at' | 'updated_at'>): Fault {
  const stmt = db.prepare(`
    INSERT INTO faults (
      reporter_name, reporter_phone, location, equipment_type,
      fault_description, priority, status, assigned_to, resolution_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    fault.reporter_name,
    fault.reporter_phone,
    fault.location,
    fault.equipment_type,
    fault.fault_description,
    fault.priority,
    fault.status,
    fault.assigned_to || null,
    fault.resolution_notes || null
  );

  return getFaultById(result.lastInsertRowid as number)!;
}

// 获取所有故障
export function getAllFaults(status?: FaultStatus, priority?: FaultPriority): Fault[] {
  let query = 'SELECT * FROM faults';
  const conditions: string[] = [];
  const params: any[] = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params) as Fault[];
}

// 根据ID获取故障
export function getFaultById(id: number): Fault | null {
  const stmt = db.prepare('SELECT * FROM faults WHERE id = ?');
  return stmt.get(id) as Fault | null;
}

// 更新故障状态
export function updateFaultStatus(
  id: number,
  status: FaultStatus,
  assigned_to?: string,
  resolution_notes?: string
): Fault | null {
  const stmt = db.prepare(`
    UPDATE faults 
    SET status = ?, 
        assigned_to = COALESCE(?, assigned_to),
        resolution_notes = COALESCE(?, resolution_notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(status, assigned_to || null, resolution_notes || null, id);
  return getFaultById(id);
}

// 删除故障
export function deleteFault(id: number): boolean {
  const stmt = db.prepare('DELETE FROM faults WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// 获取统计信息
export function getStatistics() {
  const total = db.prepare('SELECT COUNT(*) as count FROM faults').get() as { count: number };
  const pending = db.prepare("SELECT COUNT(*) as count FROM faults WHERE status = 'pending'").get() as { count: number };
  const inProgress = db.prepare("SELECT COUNT(*) as count FROM faults WHERE status = 'in_progress'").get() as { count: number };
  const resolved = db.prepare("SELECT COUNT(*) as count FROM faults WHERE status = 'resolved'").get() as { count: number };

  return {
    total: total.count,
    pending: pending.count,
    inProgress: inProgress.count,
    resolved: resolved.count,
  };
}

// 初始化数据库
initDatabase();

export default db;





