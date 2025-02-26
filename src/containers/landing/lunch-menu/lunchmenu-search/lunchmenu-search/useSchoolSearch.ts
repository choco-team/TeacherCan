import { useState } from 'react';
import axios from 'axios';

interface School {
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
  SCHUL_NM: string;
  ORG_RDNMA?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY;

function useSchoolSearch() {
  const [schoolList, setSchoolList] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (schoolName: string) => {
    if (!schoolName.trim()) return;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${schoolName}`,
      );

      const results: School[] = response.data.schoolInfo?.[1]?.row || [];
      setSchoolList(results);
    } catch (error) {
      setSchoolList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { schoolList, isLoading, handleSearch };
}

export default useSchoolSearch;
