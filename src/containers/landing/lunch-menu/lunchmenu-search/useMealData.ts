import { useState, useEffect } from 'react';
import axios from 'axios';
import { School } from './lunchmenu.types';

type MealData = {
  mlsvYmd: string;
  dishes: string[];
  formattedDate: string;
};

function useMealData(selectedSchool: School | null) {
  const [mealData, setMealData] = useState<MealData[]>([]);

  const fetchMealData = async (school: School) => {
    if (!school || !school.SCHUL_NM) {
      return;
    }

    const data = await axios('/api/lunchmenu/meal-data', {
      params: {
        ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
        SD_SCHUL_CODE: school.SD_SCHUL_CODE,
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching meal data:', error);
        return [];
      });

    setMealData(data);
  };

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool]);

  return { mealData, fetchMealData };
}

export default useMealData;
