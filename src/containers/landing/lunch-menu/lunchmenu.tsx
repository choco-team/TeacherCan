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
import AllergyDialog from './allergy/allergy';

const allergyList = [
  { id: 1, name: '난류' },
  { id: 2, name: '우유' },
  { id: 3, name: '메밀' },
  { id: 4, name: '땅콩' },
  { id: 5, name: '대두' },
  { id: 6, name: '밀' },
  { id: 7, name: '고등어' },
  { id: 8, name: '게' },
  { id: 9, name: '새우' },
  { id: 10, name: '돼지고기' },
  { id: 11, name: '복숭아' },
  { id: 12, name: '토마토' },
  { id: 13, name: '아황산류' },
  { id: 14, name: '호두' },
  { id: 15, name: '닭고기' },
  { id: 16, name: '쇠고기' },
  { id: 17, name: '오징어' },
  { id: 18, name: '조개류(굴, 전복, 홍합 포함)' },
  { id: 19, name: '잣' },
];

function LunchMenu() {
  const [schoolName, setSchoolName] = useState<string>('');
  const { schoolList, isLoading, handleSearch } = useSchoolSearch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAllergyDialogOpen, setIsAllergyDialogOpen] = useState(false);

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
        <div className="flex gap-2 px-4 h-[250px]">
          {Array.from({ length: 5 }).map(() => (
            <Skeleton className="flex-1" />
          ))}
        </div>
      );
    }

    if (selectedSchool.SCHUL_NM === null) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center min-h-[140px]">
          <div className="text-center text-sm text-gray-500">
            등록된 학교가 없어요. 학교를 등록해보세요.
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
      <div className="flex gap-2 px-4 h-[250px]">
        {Array.from({ length: 5 }).map(() => (
          <Skeleton className="flex-1" />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full ">
      <SectionTitle
        Icon={Utensils}
        title="점심 메뉴"
        buttonSection={
          <div className="flex gap-2">
            <Button
              size="md"
              variant="primary-ghost"
              onClick={() => setIsDialogOpen(true)}
            >
              학교 등록
            </Button>
            <Button
              size="md"
              variant="primary-ghost"
              onClick={() => setIsAllergyDialogOpen(true)}
            >
              알러지 등록
            </Button>
          </div>
        }
      />
      <div className="bg-white shadow-custom py-4 rounded-xl w-full overflow-auto">
        {renderContent()}
        <div className="mt-4 p-4">
          <h3 className="text-sm font-semibold">알러지 정보</h3>
          <ul className="flex flex-wrap gap-2 mt-2">
            {allergyList.map((allergy) => (
              <li
                key={allergy.id}
                className="text-sm px-2 py-1 bg-white rounded-md shadow"
              >
                {allergy.id}. {allergy.name}
              </li>
            ))}
          </ul>
        </div>
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
      <AllergyDialog
        isOpen={isAllergyDialogOpen}
        onClose={() => setIsAllergyDialogOpen(false)}
      />
    </div>
  );
}

export default LunchMenu;
