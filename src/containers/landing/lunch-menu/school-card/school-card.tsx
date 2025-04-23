import { Card, CardContent } from '@/components/card';
import { School } from '../lunchmenu-search/lunchmenu.types';

type SchoolCardProps = {
  school: School;
  onClick: () => void;
};

function SchoolCard({ school, onClick }: SchoolCardProps) {
  return (
    <Card
      key={school.SD_SCHUL_CODE}
      role="button"
      className="shadow-none dark:border-none bg dark:bg-bg-secondary hover:bg-primary-50 dark:hover:bg-gray-950"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <p className="font-semibold text-text-title">{school.SCHUL_NM}</p>
        <p className="text-sm text-text-description">
          {school.ORG_RDNMA || '주소 정보 없음'}
        </p>
      </CardContent>
    </Card>
  );
}

export default SchoolCard;
