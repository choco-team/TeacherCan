import { useState } from 'react';
import axios from 'axios';
import { School } from './lunchmenu.types';

function useSchoolSearch() {
  const [schoolList, setSchoolList] = useState<School[]>([]);

  const handleSearch = async (schoolName: string) => {
    if (!schoolName.trim()) return;

    try {
      const response = await axios.get(
        `/api/lunchmenu/school-search?SCHUL_NM=${schoolName}`,
      );
      setSchoolList(response.data);
    } catch (error) {
      setSchoolList([]);
    }
  };

  return { schoolList, handleSearch };
}

export default useSchoolSearch;
