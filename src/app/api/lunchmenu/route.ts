import { NextRequest, NextResponse } from 'next/server';

async function fetchMealInfo(
  schoolCode: string,
  officeCode: string,
  date?: string,
) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY;

    const queryParams = new URLSearchParams({
      KEY: API_KEY,
      Type: 'json',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
    });

    if (date) {
      queryParams.append('MLSV_YMD', date);
    }

    const response = await fetch(
      `https://open.neis.go.kr/hub/mealServiceDietInfo?${queryParams.toString()}`,
    );

    const data = await response.json();

    if (data.RESULT?.CODE === 'INFO-000') {
      if (data.mealServiceDietInfo) {
        const [, mealInfo] = data.mealServiceDietInfo;
        return mealInfo.row.map((item) => ({
          MLSV_YMD: item.MLSV_YMD,
          DDISH_NM: item.DDISH_NM,
        }));
      }
      return [];
    }

    throw new Error(data.RESULT?.MESSAGE || '알 수 없는 오류가 발생했습니다.');
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const schoolCode = url.searchParams.get('SD_SCHUL_CODE');
  const officeCode = url.searchParams.get('ATPT_OFCDC_SC_CODE');
  const date = url.searchParams.get('date');

  if (!schoolCode || !officeCode) {
    return NextResponse.json(
      { error: '학교 코드와 교육청 코드가 필요합니다.' },
      { status: 400 },
    );
  }

  try {
    const mealData = await fetchMealInfo(schoolCode, officeCode, date);
    return NextResponse.json(mealData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || '급식 정보를 가져오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}
