import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import SchoolCard from '../school-card/school-card';
import { School } from './lunchmenu.types';

type SchoolSearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  schoolList: School[];
  onSelectSchool: (school: School) => void;
  handleSearch: (name: string) => void;
};

function SchoolSearchDialog({
  isOpen,
  onClose,
  schoolName,
  setSchoolName,
  schoolList,
  onSelectSchool,
  handleSearch,
}: SchoolSearchDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="text-sm text-gray-500 mb-2 block">
              학교명을 검색하세요
            </span>
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
              onClick={() => onSelectSchool(school)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SchoolSearchDialog;
