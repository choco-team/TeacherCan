import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';

type Props = {
  title: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  buttonSection?: ReactNode;
};

export default function SectionTitle({ title, Icon, buttonSection }: Props) {
  return (
    <div className="flex items-center justify-between text-gray-500 font-medium">
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span className="text-sm">{title}</span>
      </div>
      {buttonSection}
    </div>
  );
}
