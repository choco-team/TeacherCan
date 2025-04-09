import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/tooltip';
import { Badge } from '@/components/badge';
import { ALLERGY_MAP } from '../allergy/allergy.constant';

type Props = {
  checked: boolean;
  allergyId: number;
};

function MealAllergy({ checked, allergyId }: Props) {
  const allergyName = ALLERGY_MAP.get(allergyId);

  return checked ? (
    <Tooltip key={allergyId} delayDuration={0}>
      <TooltipTrigger className="text-primary font-bold">
        <Badge
          size="sm"
          variant="primary-outline"
          className="p-0.5 border-none"
        >
          {allergyId}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{allergyName}</TooltipContent>
    </Tooltip>
  ) : null;
}

export default MealAllergy;
