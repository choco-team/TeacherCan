import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/dialog';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useAllergy } from './allergyContext';

type AllergyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AllergyDialog({ isOpen, onClose }: AllergyDialogProps) {
  const [allergyInput, setAllergyInput] = useState('');
  const { allergies, setAllergies } = useAllergy();

  const handleAddAllergy = () => {
    const trimmedAllergy = allergyInput.trim();
    const allergyArray = trimmedAllergy.split(',').map((item) => item.trim());
    const newAllergies = allergyArray.filter(
      (allergy) => allergy && !allergies.includes(allergy),
    );

    if (newAllergies.length > 0) {
      const updatedAllergies = [...allergies, ...newAllergies];
      setAllergies(updatedAllergies);
      localStorage.setItem('allergies', JSON.stringify(updatedAllergies));
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    const updatedAllergies = allergies.filter((a) => a !== allergy);
    setAllergies(updatedAllergies);
    localStorage.setItem('allergies', JSON.stringify(updatedAllergies));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-2 pt-4">
          <Input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="알러지 번호 입력 (예: 12, 3, 4)"
          />
          <Button onClick={handleAddAllergy}>추가</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {allergies.length > 0 ? (
            allergies.map((allergy) => (
              <div
                key={allergy}
                className="relative bg-primary-100 text-gray-700 rounded-4 flex items-center justify-center px-4 py-2"
              >
                <span
                  className="text-xl cursor-pointer"
                  onClick={() => handleRemoveAllergy(allergy)}
                >
                  {allergy}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-2">등록된 알러지가 없습니다.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AllergyDialog;
