'use client';

import { Utensils, PlusIcon } from 'lucide-react';
import { Button } from '@/components/button';
import React, { useState } from 'react';
import { Input } from '@/components/input';
import { CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import SectionTitle from '../components/section-title';
import { School } from './lunchmenu-search/lunchmenu.types';
import useSchoolSearch from './lunchmenu-search/useSchoolSearch';
import useMealData from './lunchmenu-search/useMealData';
import SchoolCard from './school-card/school-card';

function LunchMenu() {
  const [schoolName, setSchoolName] = useState<string>('');
  const { schoolList, handleSearch } = useSchoolSearch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>(
    'selectedSchool',
    null,
  );

  const { mealData } = useMealData(selectedSchool, setSchoolName);

  const formatDate = (dateStr: string): string => {
    return `${dateStr.substring(0, 4)}년 ${dateStr.substring(4, 6)}월 ${dateStr.substring(6, 8)}일`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionTitle
        Icon={Utensils}
        title="점심 메뉴"
        buttonSection={
          <Button
            size="xs"
            variant="primary-ghost"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon size={14} />
          </Button>
        }
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm lg:max-w-lg ">
          <DialogHeader>
            <DialogTitle className="m-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="학교명을 입력하세요"
                  className="flex-1"
                />
                <Button onClick={() => handleSearch(schoolName)}>검색</Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 mt-4 max-h-60 overflow-y-auto">
            {schoolList.map((school) => (
              <SchoolCard
                key={school.SD_SCHUL_CODE}
                school={school}
                onClick={() => {
                  setSelectedSchool(school);
                  setIsDialogOpen(false);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full overflow-auto">
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
    </div>
  );
}

export default LunchMenu;
