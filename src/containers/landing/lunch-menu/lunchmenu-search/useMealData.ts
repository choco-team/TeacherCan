import { useState, useEffect } from 'react';
import axios from 'axios';
import { School, API_KEY } from './lunchmenu.types';

type MealData = {
  MLSV_YMD: string;
  DDISH_NM: string | null;
};

function useMealData(
  selectedSchool: School | null,
  setSchoolName: (name: string) => void,
) {
  const [mealData, setMealData] = useState<MealData[]>([]);

  const getFormattedDate = (offset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };

  const fetchMealData = async (school: School) => {
    setSchoolName(school.SCHUL_NM);
    const mealRequests = Array.from({ length: 5 }, (_, i) => {
      const dateString = getFormattedDate(i);
      return axios
        .get(
          `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&MLSV_YMD=${dateString}`,
        )
        .then((response) => ({
          MLSV_YMD: dateString,
          DDISH_NM:
            response.data.mealServiceDietInfo?.[1]?.row?.[0]?.DDISH_NM || null,
        }))
        .catch(() => ({ MLSV_YMD: dateString, DDISH_NM: null }));
    });

    try {
      const mealResults = await Promise.all(mealRequests);
      setMealData(mealResults);
    } catch (error) {
      setMealData([]);
    }
  };

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool]);

  return { mealData, fetchMealData };
}

export default useMealData;
