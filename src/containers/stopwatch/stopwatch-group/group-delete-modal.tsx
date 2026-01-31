import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';

interface GroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function GroupDeleteModal({
  isOpen,
  onClose,
  onComplete,
}: GroupDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>스톱워치 그룹 삭제하기</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          선택한 스톱워치 그룹을 삭제하시겠습니까?
          <br />
          삭제된 스톱워치 그룹은 복구할 수 없습니다.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="gray-ghost"
            size="sm"
            onClick={onClose}
            className="w-[120px]"
          >
            취소
          </Button>
          <Button
            variant="red"
            size="sm"
            className="w-[120px]"
            onClick={onComplete}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
