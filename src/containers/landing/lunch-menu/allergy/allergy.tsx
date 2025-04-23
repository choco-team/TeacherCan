'use client';

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';
import { useAllergy } from './allergyContext';
import { ALLERGY_LIST } from './allergy.constant';

function AllergyList() {
  const { allergies, setAllergies } = useAllergy();

  return (
    <div className="flex flex-col px-4 pt-8">
      <h3 className="text-sm font-semibold">알러지 정보</h3>
      <p className="mt-1 text-sm text-text-description">
        알러지를 선택하면 식단에서 확인할 수 있어요.
      </p>
      <ToggleGroup
        type="multiple"
        value={allergies.map(String)}
        onValueChange={(value) => setAllergies(value.map(Number))}
        asChild
      >
        <ul className="flex flex-wrap gap-x-1 gap-y-1.5 mt-4">
          {ALLERGY_LIST.map(({ id, name }) => (
            <ToggleGroupItem
              key={id}
              value={id.toString()}
              size="xs"
              className="font-normal text-text-subtitle data-[state=on]:bg-primary-100 data-[state=on]:font-medium"
            >
              {id}. {name}
            </ToggleGroupItem>
          ))}
        </ul>
      </ToggleGroup>
    </div>
  );
}

export default AllergyList;
