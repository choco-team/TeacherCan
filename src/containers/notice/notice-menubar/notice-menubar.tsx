import { SparklesIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { Badge } from '@/components/badge';

export default function NoticeMenubar() {
  return (
    <menu className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-end px-10 py-4 w-full bg-popover text-popover-foreground fill-popover-foreground shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)]">
      <Popover>
        <PopoverTrigger className="flex items-center gap-x-1 font-medium">
          <SparklesIcon className="size-5" />
          알림장 문구 추천
          <Badge variant="primary-outline" size="sm">
            New
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="me-6 mb-6" asChild>
          {/* TODO: 알림장 문구 추천 기능 내장 */}
        </PopoverContent>
      </Popover>
    </menu>
  );
}
