import React, { useState, useEffect } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import axios from 'axios';
import useSchoolSearch from './useSchoolSearch';
import SchoolPopover from '../school-popover/school-popover';

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
  const { schoolList, isLoading, handleSearch } = useSchoolSearch(); // ✅ 새 훅 사용
  const [mealData, setMealData] = useState<MealData[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useLocalStorage<number>(
    'selectedDays',
    1,
  );
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
      return;
    }

    setSelectedSchool(school);
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
    <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full h-auto overflow-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="학교명을 입력하세요"
        />
        <select
          value={(selectedDays ?? 1).toString()}
          onChange={(e) => setSelectedDays(Number(e.target.value))}
          className="p-2"
        >
          {[1, 2, 3, 4, 5].map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </select>
        <Button onClick={() => handleSearch(schoolName)} disabled={isLoading}>
          {isLoading ? '검색 중...' : '검색'}
        </Button>
      </div>
      <SchoolPopover
        schoolList={schoolList}
        fetchMealData={fetchMealData}
        isOpen={isPopoverOpen}
        setIsOpen={setIsPopoverOpen}
      />
      {mealData.length > 0 && (
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-4">
            {mealData.map((meal) => (
              <div
                key={meal.MLSV_YMD}
                className="min-w-[100px] border p-2 rounded-lg shadow-sm bg-primary-50"
              >
                <h4 className="font-semibold text-center">
                  {formatDate(meal.MLSV_YMD)}
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {meal.DDISH_NM
                    ? meal.DDISH_NM.replace(/<br\/>/g, '\n')
                    : '식단 정보 없음'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </div>
  );
}

export default LunchMenuSearch;
