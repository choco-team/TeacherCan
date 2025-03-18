import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { LoaderCircle } from 'lucide-react';
import SchoolCard from '../school-card/school-card';
import { School } from './lunchmenu.types';

type SchoolSearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  isLoading: boolean;
  setSchoolName: (name: string) => void;
  schoolList: School[];
  onSelectSchool: (school: School) => void;
  handleSearch: (name: string) => void;
};

function SchoolSearchDialog({
  isOpen,
  onClose,
  schoolName,
  isLoading,
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
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch(schoolName);
              }}
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="학교명을 입력하세요"
                  className="flex-1"
                />
                <Button type="submit">검색</Button>
              </div>
            </form>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 max-h-60 min-h-60 overflow-y-auto">
          {/* TODO:(김홍동) 분기가 많아 컴포넌트 분리하기 */}
          {isLoading ? (
            <LoaderCircle
              size="24px"
              className="animate-spin h-full text-gray-800 mx-auto"
            />
          ) : schoolList === null ? null : schoolList.length > 0 ? (
            schoolList.map((school) => (
              <SchoolCard
                key={school.SD_SCHUL_CODE}
                school={school}
                onClick={() => onSelectSchool(school)}
              />
            ))
          ) : (
            <div className="h-full text-gray-800 flex items-center justify-center">
              <span>검색된 학교가 없습니다.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SchoolSearchDialog;
