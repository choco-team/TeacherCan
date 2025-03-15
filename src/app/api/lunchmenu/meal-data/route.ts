import { NextRequest, NextResponse } from 'next/server';
import { startOfWeek, format } from 'date-fns';

async function fetchMealInfo(schoolCode: string, officeCode: string) {
  try {
    const API_KEY = process.env.NICE_API_KEY;

    const queryParams = new URLSearchParams({
      KEY: API_KEY,
      Type: 'json',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
    });

    // 기준 날짜 (오늘)
    const today = new Date();

    // 주의 시작 (월요일) 및 끝 (금요일) 가져오기
    const monday = startOfWeek(today, { weekStartsOn: 1 }); // 월요일 시작
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4); // 월요일 기준 4일 후가 금요일

    const formattedMonday = format(monday, 'yyyyMMdd');
    const formattedFriday = format(friday, 'yyyyMMdd');

    queryParams.append('MLSV_FROM_YMD', formattedMonday);
    queryParams.append('MLSV_TO_YMD', formattedFriday);

    const response = await fetch(
      `https://open.neis.go.kr/hub/mealServiceDietInfo?${queryParams.toString()}`,
    );

    const data = await response.json();

    const [
      {
        head: [
          ,
          {
            RESULT: { CODE },
          },
        ],
      },
      { row },
    ] = data.mealServiceDietInfo;

    // TODO: 응답이 실패한 경우 케이스 대응
    // TODO: 이쁘게 데이터를 잘 만들어서 내려주기 + 타입까지 같이 세팅해줘서 내려주기
    // '오늘'은 다른색으로
    // 디자인 수정

    if (CODE === 'INFO-000') {
      if (data.mealServiceDietInfo) {
        return row;
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

  if (!schoolCode || !officeCode) {
    return NextResponse.json(
      { error: '학교 코드와 교육청 코드가 필요합니다.' },
      { status: 400 },
    );
  }

  try {
    const mealData = await fetchMealInfo(schoolCode, officeCode);

    return NextResponse.json(mealData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || '급식 정보를 가져오는 데 실패했습니다.' },
      { status: 500 },
    );
  }
}
