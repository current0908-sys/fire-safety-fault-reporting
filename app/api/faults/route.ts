import { NextRequest, NextResponse } from 'next/server';
import { createFault, getAllFaults, Fault, FaultStatus, FaultPriority } from '@/lib/db';

// GET - 获取所有故障
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as FaultStatus | null;
    const priority = searchParams.get('priority') as FaultPriority | null;

    const faults = getAllFaults(
      status || undefined,
      priority || undefined
    );

    return NextResponse.json({ success: true, data: faults });
  } catch (error) {
    console.error('Error fetching faults:', error);
    return NextResponse.json(
      { success: false, error: '获取故障列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建新故障报告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reporter_name,
      reporter_phone,
      location,
      equipment_type,
      fault_description,
      priority = 'medium',
    } = body;

    // 验证必填字段
    if (!reporter_name || !reporter_phone || !location || !equipment_type || !fault_description) {
      return NextResponse.json(
        { success: false, error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    const fault = createFault({
      reporter_name,
      reporter_phone,
      location,
      equipment_type,
      fault_description,
      priority: priority || 'medium',
      status: 'pending',
      assigned_to: null,
      resolution_notes: null,
    });

    return NextResponse.json({ success: true, data: fault }, { status: 201 });
  } catch (error) {
    console.error('Error creating fault:', error);
    return NextResponse.json(
      { success: false, error: '创建故障报告失败' },
      { status: 500 }
    );
  }
}





