import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'web-portal',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
