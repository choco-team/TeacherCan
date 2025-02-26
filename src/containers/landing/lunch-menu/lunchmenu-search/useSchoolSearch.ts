import { useState } from 'react';
import axios from 'axios';
import { School, API_KEY } from './types';

function useSchoolSearch() {
  const [schoolList, setSchoolList] = useState<School[]>([]);

  const handleSearch = async (schoolName: string) => {
    if (!schoolName.trim()) return;

    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${schoolName}`,
      );

      const results: School[] = response.data.schoolInfo?.[1]?.row || [];
      setSchoolList(results);
    } catch (error) {
      setSchoolList([]);
    }
  };

  return { schoolList, handleSearch };
}

export default useSchoolSearch;
