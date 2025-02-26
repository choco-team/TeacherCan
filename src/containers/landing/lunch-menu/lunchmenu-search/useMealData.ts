import { useState, useEffect } from 'react';
import axios from 'axios';

interface School {
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
  SCHUL_NM: string;
  ORG_RDNMA?: string;
}

interface MealData {
  MLSV_YMD: string;
  DDISH_NM: string | null;
}

function useMealData(
  selectedSchool: School | null,
  selectedDays: number,
  setSchoolName,
) {
  const [mealData, setMealData] = useState<MealData[]>([]);

  const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY;

  const getFormattedDate = (offset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };

  const fetchMealData = async (school: School) => {
    setSchoolName(school.SCHUL_NM);
    const mealRequests = Array.from({ length: selectedDays }, (_, i) => {
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
      console.log('에러');
    }
  };

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool, selectedDays]);

  return { mealData, fetchMealData };
}

export default useMealData;
