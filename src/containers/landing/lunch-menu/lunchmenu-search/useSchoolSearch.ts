import { useState } from 'react';
import axios from 'axios';
import { School } from './lunchmenu.types';

function useSchoolSearch() {
  const [schoolList, setSchoolList] = useState<School[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (schoolName: string) => {
    if (!schoolName.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/lunchmenu/school-search?SCHUL_NM=${schoolName}`,
      );
      setSchoolList(response.data);
    } catch (error) {
      setSchoolList([]);
    }

    setIsLoading(false);
  };

  return { schoolList, isLoading, handleSearch };
}

export default useSchoolSearch;
