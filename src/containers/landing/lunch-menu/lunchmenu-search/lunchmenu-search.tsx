import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import SchoolPopover from './school-popover/school-popover';

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

function LunchMenuSearch() {
  const [schoolName, setSchoolName] = useState<string>('');
  const [schoolList, setSchoolList] = useState<School[]>([]);
  const [mealData, setMealData] = useState<MealData[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>(
    'selectedSchool',
    null,
  );

  const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY;

  const getFormattedDate = (offset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0].replace(/-/g, '');
  };

  const handleSearch = async () => {
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

  const fetchMealData = async (school: School) => {
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
      console.error('식단 데이터 불러오기 실패:', error);
    }

    setSelectedSchool(school);
    setSchoolName('');
    setSchoolList([]);
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    setIsPopoverOpen(schoolList.length > 0);
  }, [schoolList]);

  useEffect(() => {
    if (selectedSchool) fetchMealData(selectedSchool);
  }, [selectedSchool, selectedDays]);

  const formatDate = (dateStr: string): string => {
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
        <select
          value={selectedDays.toString()}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </select>
        <Button onClick={handleSearch}>검색</Button>
      </div>
      <SchoolPopover
        schoolList={schoolList}
        fetchMealData={fetchMealData}
        isOpen={isPopoverOpen}
        setIsOpen={setIsPopoverOpen}
      />
      {mealData.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">급식 정보</h2>
            {mealData.map((meal) => (
              <div key={meal.MLSV_YMD} className="mt-2 border-b pb-2">
                <h3 className="font-semibold">{formatDate(meal.MLSV_YMD)}</h3>
                <p>
                  {meal.DDISH_NM
                    ? meal.DDISH_NM.replace(/<br\/>/g, '\n')
                    : '식단 정보를 찾을 수 없습니다.'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LunchMenuSearch;
