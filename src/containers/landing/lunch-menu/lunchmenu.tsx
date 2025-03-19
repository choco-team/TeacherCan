'use client';

import { Utensils, PlusIcon } from 'lucide-react';
import { Button } from '@/components/button';
import React, { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Skeleton } from '@/components/skeleton';
import SectionTitle from '../components/section-title';
import { School } from './lunchmenu-search/lunchmenu.types';
import useSchoolSearch from './lunchmenu-search/useSchoolSearch';
import useMealData from './lunchmenu-search/useMealData';
import SchoolSearchDialog from './lunchmenu-search/schoolSearchDialog';
import MealList from './mealInformation/mealList';

function LunchMenu() {
  const [schoolName, setSchoolName] = useState<string>('');
  const { schoolList, isLoading, handleSearch } = useSchoolSearch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>(
    'selectedSchool',
    {
      SD_SCHUL_CODE: null,
      ATPT_OFCDC_SC_CODE: null,
      SCHUL_NM: null,
      ORG_RDNMA: null,
    },
  );

  const { mealData } = useMealData(selectedSchool);

  return (
    <div className="flex flex-col gap-4 w-full ">
      <SectionTitle
        Icon={Utensils}
        title="점심 메뉴"
        buttonSection={
          <Button
            size="xs"
            variant="primary-ghost"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon size={14} />
          </Button>
        }
      />
      <div className="bg-white shadow-custom py-4 rounded-xl w-full overflow-auto">
        {/* TODO:(김홍동) 분기가 많아 컴포넌트 분리하기 */}
        {!selectedSchool ? (
          <div className="flex gap-2 px-4 h-[250px]">
            {Array.from({ length: 5 }).map((_, index) => (
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton className="flex-1" key={index} />
            ))}
          </div>
        ) : selectedSchool.SCHUL_NM !== null ? (
          <MealList mealData={mealData} />
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center min-h-[140px]">
            <div className="text-center text-sm text-gray-500">
              등록된 학교가 없어요. 학교를 등록해보세요.
            </div>
            <Button
              size="sm"
              variant="primary-outline"
              onClick={() => setIsDialogOpen(true)}
            >
              학교 등록하기
            </Button>
          </div>
        )}
      </div>

      <SchoolSearchDialog
        isOpen={isDialogOpen}
        isLoading={isLoading}
        onClose={() => setIsDialogOpen(false)}
        schoolName={schoolName}
        setSchoolName={setSchoolName}
        schoolList={schoolList}
        onSelectSchool={(school) => {
          setSelectedSchool(school);
          setIsDialogOpen(false);
        }}
        handleSearch={handleSearch}
      />
    </div>
  );
}

export default LunchMenu;
