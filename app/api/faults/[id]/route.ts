import { NextRequest, NextResponse } from 'next/server';
import { getFaultById, updateFaultStatus, deleteFault, FaultStatus } from '@/lib/db';

// GET - 获取单个故障详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的故障ID' },
        { status: 400 }
      );
    }

    const fault = getFaultById(id);
    if (!fault) {
      return NextResponse.json(
        { success: false, error: '故障不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fault });
  } catch (error) {
    console.error('Error fetching fault:', error);
    return NextResponse.json(
      { success: false, error: '获取故障详情失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新故障状态
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的故障ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, assigned_to, resolution_notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: '状态字段是必填的' },
        { status: 400 }
      );
    }

    const fault = updateFaultStatus(
      id,
      status as FaultStatus,
      assigned_to,
      resolution_notes
    );

    if (!fault) {
      return NextResponse.json(
        { success: false, error: '故障不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fault });
  } catch (error) {
    console.error('Error updating fault:', error);
    return NextResponse.json(
      { success: false, error: '更新故障状态失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除故障
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的故障ID' },
        { status: 400 }
      );
    }

    const deleted = deleteFault(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '故障不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: '故障已删除' });
  } catch (error) {
    console.error('Error deleting fault:', error);
    return NextResponse.json(
      { success: false, error: '删除故障失败' },
      { status: 500 }
    );
  }
}





