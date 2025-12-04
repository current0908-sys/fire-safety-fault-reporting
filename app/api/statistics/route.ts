import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/db';

// GET - 获取统计信息
export async function GET() {
  try {
    const stats = getStatistics();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: '获取统计信息失败' },
      { status: 500 }
    );
  }
}









