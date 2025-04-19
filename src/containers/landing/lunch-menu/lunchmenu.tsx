'use client';

import { Utensils } from 'lucide-react';
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
import AllergyList from './allergy/allergy';

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

  const renderContent = () => {
    if (!selectedSchool) {
      return (
        <div className="flex gap-2 px-4 h-64 bg-bg-origin">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={`skeleton-${selectedSchool?.SD_SCHUL_CODE || 'none'}-position-${index * 20}%`}
              className="flex-1"
            />
          ))}
        </div>
      );
    }

    if (selectedSchool.SCHUL_NM === null) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center min-h-64 bg-bg-origin">
          <div className="text-center text-sm text-gray-500">
            학교를 등록하고 점심 식단을 확인해보세요.
          </div>
          <Button
            size="sm"
            variant="primary-outline"
            onClick={() => setIsDialogOpen(true)}
          >
            학교 등록
          </Button>
        </div>
      );
    }

    if (mealData.length > 0) {
      return <MealList mealData={mealData} />;
    }

    return (
      <div className="flex gap-2 px-4 h-64">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={`skeleton-${selectedSchool?.SD_SCHUL_CODE || 'none'}-position-${index * 20}%`}
            className="flex-1"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionTitle
        Icon={Utensils}
        title="점심 식단"
        buttonSection={
          selectedSchool?.SCHUL_NM ? (
            <div className="flex items-center gap-x-1">
              <span className="text-sm font-normal">
                {selectedSchool?.SCHUL_NM}
              </span>
              <Button
                size="sm"
                variant="primary-ghost"
                onClick={() => setIsDialogOpen(true)}
              >
                변경
              </Button>
            </div>
          ) : null
        }
      />
      <div className="bg-bg-origin shadow-custom dark:shadow-custom-dark py-4 rounded-2xl w-full overflow-auto">
        {renderContent()}
        {mealData.length > 0 && <AllergyList />}
      </div>

      <SchoolSearchDialog
        isOpen={isDialogOpen}
        isLoading={isLoading}
        onClose={() => setIsDialogOpen(false)}
        schoolName={schoolName}
        setSchoolName={setSchoolName}
        schoolList={schoolList}
        selectedSchool={selectedSchool}
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
