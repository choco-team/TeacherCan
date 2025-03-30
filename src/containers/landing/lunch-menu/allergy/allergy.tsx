import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/dialog';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import useLocalStorage from '@/hooks/useLocalStorage';

type AllergyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AllergyDialog({ isOpen, onClose }: AllergyDialogProps) {
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useLocalStorage<string[]>('allergies', []);
  const [safeAllergies, setSafeAllergies] = useState<string[]>(allergies ?? []);

  useEffect(() => {
    setSafeAllergies(allergies ?? []);
  }, [allergies]);

  const handleAddAllergy = () => {
    const trimmedAllergy = allergyInput.trim();
    if (trimmedAllergy && !safeAllergies.includes(trimmedAllergy)) {
      setAllergies([...safeAllergies, trimmedAllergy]);
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(safeAllergies.filter((a) => a !== allergy));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-2 pt-4">
          <Input
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="알러지 번호 입력 (예: 12)"
          />
          <Button onClick={handleAddAllergy}>추가</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {safeAllergies.length > 0 ? (
            safeAllergies.map((allergy) => (
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
