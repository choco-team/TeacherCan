'use client';

import { Utensils, PlusIcon } from 'lucide-react';
import { Button } from '@/components/button';
import React, { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import SectionTitle from '../components/section-title';
import { School } from './lunchmenu-search/lunchmenu.types';
import useSchoolSearch from './lunchmenu-search/useSchoolSearch';
import useMealData from './lunchmenu-search/useMealData';
import SchoolSearchDialog from './lunchmenu-search/schoolSearchDialog';
import MealList from './mealInformation/mealList';

function LunchMenu() {
  const [schoolName, setSchoolName] = useState<string>('');
  const { schoolList, handleSearch } = useSchoolSearch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedSchool, setSelectedSchool] = useLocalStorage<School | null>(
    'selectedSchool',
    null,
  );

  const { mealData } = useMealData(selectedSchool, setSchoolName);

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
      <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full overflow-auto">
        {selectedSchool ? (
          <MealList mealData={mealData} />
        ) : (
          <div className="flex flex-col gap-4 h-full justify-center items-center">
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
