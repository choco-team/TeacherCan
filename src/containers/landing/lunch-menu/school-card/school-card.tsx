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
      className="mb-2 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <p className="font-semibold">{school.SCHUL_NM}</p>
        <p className="text-sm text-gray-600">
          {school.ORG_RDNMA || '주소 정보 없음'}
        </p>
      </CardContent>
    </Card>
  );
}

export default SchoolCard;
