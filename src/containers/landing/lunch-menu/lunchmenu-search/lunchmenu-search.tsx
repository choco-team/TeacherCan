import React, { useState, useEffect } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import useSchoolSearch from './useSchoolSearch';
import useMealData from './useMealData';
import SchoolPopover from '../school-popover/school-popover';

interface School {
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
  SCHUL_NM: string;
  ORG_RDNMA?: string;
}

function LunchMenuSearch() {
  const [schoolName, setSchoolName] = useState<string>('');
  const { schoolList, isLoading, handleSearch } = useSchoolSearch();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useLocalStorage<number>(
    'selectedDays',
    1,
  );
  const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>(
    'selectedSchool',
    null,
  );

  const { mealData } = useMealData(selectedSchool, selectedDays, setSchoolName);

  useEffect(() => {
    setIsPopoverOpen(schoolList.length > 0);
  }, [schoolList]);

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
        fetchMealData={setSelectedSchool}
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
