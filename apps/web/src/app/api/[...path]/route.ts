import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  const pathString = path.join('/');
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const targetUrl = `${API_BASE}/api/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const body = method === 'POST' ? await request.text() : undefined;
    
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

