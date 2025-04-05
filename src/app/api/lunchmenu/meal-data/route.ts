import { NextRequest, NextResponse } from 'next/server';
import { startOfWeek, format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

type MealData = {
  MLSV_YMD: string;
  DDISH_NM: string | null;
};

async function fetchMealInfo(schoolCode: string, officeCode: string) {
  try {
    const API_KEY = process.env.NICE_API_KEY;

    const queryParams = new URLSearchParams({
      KEY: API_KEY,
      Type: 'json',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
    });

    const today = new Date();

    const monday = startOfWeek(today, { weekStartsOn: 1 });
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const formattedMonday = format(monday, 'yyyyMMdd');
    const formattedFriday = format(friday, 'yyyyMMdd');

    queryParams.append('MLSV_FROM_YMD', formattedMonday);
    queryParams.append('MLSV_TO_YMD', formattedFriday);

    const response = await fetch(
      `https://open.neis.go.kr/hub/mealServiceDietInfo?${queryParams.toString()}`,
    ).catch(() => {
      throw new Error('급식 API 서버에 접속할 수 없습니다.');
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.mealServiceDietInfo || !Array.isArray(data.mealServiceDietInfo)) {
      throw new Error('급식 데이터 형식이 올바르지 않습니다.');
    }

    const [
      {
        head: [
          ,
          {
            RESULT: { CODE, MESSAGE },
          },
        ],
      },
      { row },
    ] = data.mealServiceDietInfo;

    if (CODE === 'INFO-000') {
      return (row as MealData[]).map((meal) => ({
        mlsvYmd: meal.MLSV_YMD,
        formattedDate: format(
          parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()),
          'M월 d일 EEEE',
          { locale: ko },
        ),
        dishes: meal.DDISH_NM
          ? meal.DDISH_NM.split(/<br\/?>|\n/).map((dish) => dish.trim())
          : [],
      }));
    }
    throw new Error(`API 오류 발생: ${MESSAGE || '알 수 없는 오류'}`);
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
