import { useState, useEffect } from 'react';
import axios from 'axios';
import { School } from './lunchmenu.types';

type MealData = {
  MLSV_YMD: string;
  DDISH_NM: string | null;
  formattedDate: string;
};

function useMealData(selectedSchool: School | null) {
  const [mealData, setMealData] = useState<MealData[]>([]);
  // 급식 데이터를 가져오는 함수 (Next.js API 사용)
  const fetchMealData = async (school: School) => {
    const data = await axios('/api/lunchmenu/meal-data', {
      params: {
        ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
        SD_SCHUL_CODE: school.SD_SCHUL_CODE,
      },
    }).then((response) => response.data);

    setMealData(data);
  };

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool]);

  return { mealData, fetchMealData };
}

export default useMealData;

// TODO: 응답이 실패한 경우 케이스 대응
