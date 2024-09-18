import { Heading1 } from '@/components/ui/heading';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/styles/utils';

function LogoTitle() {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <TeacherCanLogo
        width="200"
        height="200"
        className="animate-bounce-in-top"
      />
      <Heading1 className="relative text-5xl text-primary font-point">
        티처캔
        <Badge
          variant="secondary-outline"
          size="sm"
          className={cn(
            'absolute',
            '-right-12',
            'font-sans',
            'animate-pulse',
            'repeat-1',
            'duration-500',
            'delay-1000',
            'ease-in',
            'fill-mode-backwards',
          )}
        >
          New!
        </Badge>
      </Heading1>
    </div>
  );
}

export default LogoTitle;
