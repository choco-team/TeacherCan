import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const schoolName = searchParams.get('SCHUL_NM');

  if (!schoolName) {
    return NextResponse.json(
      { error: '학교 이름이 필요합니다.' },
      { status: 400 },
    );
  }

  try {
    const API_KEY = process.env.NICE_API_KEY;
    if (!API_KEY) throw new Error('API 키가 설정되지 않았습니다.');

    const response = await fetch(
      `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${schoolName}`,
    );

    const data = await response.json();
    const results = data.schoolInfo?.[1]?.row || [];

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || '학교 검색에 실패했습니다.' },
      { status: 500 },
    );
  }
}
