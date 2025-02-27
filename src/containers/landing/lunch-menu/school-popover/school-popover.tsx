import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { ScrollArea } from '@/components/scroll-area';
import { Button } from '@/components/button';
import SchoolCard from '../school-card/school-card';
import { School } from '../lunchmenu-search/lunchmenu.types';

function SchoolPopover({ schoolList, fetchMealData, isOpen, setIsOpen }) {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="primary-ghost" />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <ScrollArea className="h-48">
          {schoolList.length > 0 ? (
            schoolList.map((school: School) => (
              <SchoolCard
                key={school.SD_SCHUL_CODE}
                school={school}
                onClick={() => {
                  fetchMealData(school);
                  setIsOpen(false);
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">검색된 학교가 없습니다.</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default SchoolPopover;
