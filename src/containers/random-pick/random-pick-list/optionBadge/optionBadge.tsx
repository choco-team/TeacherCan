import { Badge } from '@/components/badge';

export default function OptionBadge({ option }: { option: boolean }) {
  const variant = option ? 'primary' : 'gray';
  const text = option ? 'ON' : 'OFF';

  return <Badge variant={variant}>{text}</Badge>;
}
