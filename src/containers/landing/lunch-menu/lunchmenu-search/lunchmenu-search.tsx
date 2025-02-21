import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import SchoolCard from './school-card/school-card';

function LunchMenuSearch() {
  const [schoolName, setSchoolName] = useState('');
  const [schoolList, setSchoolList] = useState([]);
  const [mealData, setMealData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useLocalStorage<{
    SD_SCHUL_CODE: string;
    ATPT_OFCDC_SC_CODE: string;
    SCHUL_NM: string;
    ORG_RDNMA?: string;
  } | null>('selectedSchool', null);

  const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0].replace(/-/g, '');
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${schoolName}`,
      );
      setSchoolList(response.data.schoolInfo?.[1]?.row || []);
    } catch (error) {
      setSchoolList([]);
    }
  };

  const fetchMealData = async (school) => {
    const today = getTodayDate();
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&MLSV_YMD=${today}`,
      );

      setMealData(
        response.data.mealServiceDietInfo?.[1]?.row?.[0] || {
          MLSV_YMD: today,
          DDISH_NM: null,
        },
      );
      setSelectedSchool(school);
      setSchoolName('');
      setSchoolList([]);
    } catch (error) {
      setMealData({ MLSV_YMD: today, DDISH_NM: null });
    }
  };

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool]);

  const formatDate = (dateStr) => {
    return `${dateStr.substring(0, 4)}년 ${dateStr.substring(4, 6)}월 ${dateStr.substring(6, 8)}일`;
  };

  return (
    <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full h-64 overflow-auto">
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="학교명을 입력하세요"
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
        {schoolList.length > 0 &&
          schoolList.map((school) => (
            <SchoolCard
              key={school.SD_SCHUL_CODE}
              school={school}
              onClick={() => fetchMealData(school)}
            />
          ))}
        {schoolList.length === 0 && selectedSchool && (
          <SchoolCard
            school={selectedSchool}
            onClick={() => fetchMealData(selectedSchool)}
          />
        )}
      </div>
      {mealData && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">
              {formatDate(mealData.MLSV_YMD)} 식단표
            </h2>
            <p>
              {mealData.DDISH_NM
                ? mealData.DDISH_NM.replace(/<br\/>/g, '\n')
                : '식단 정보를 찾을 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LunchMenuSearch;
