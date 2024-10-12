'use client';

import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetSubTitle,
  SheetTitle,
} from '@/components/sheet';
import { Switch } from '@/components/switch';

export default function RandomPickSetting() {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>랜덤뽑기 설정</SheetTitle>
        <SheetDescription className="mt-4" />
      </SheetHeader>

      <div className="space-y-6 py-10">
        <div className="flex flex-col gap-y-4">
          <SheetSubTitle>번호/이름 입력</SheetSubTitle>
          <div className="flex items-center gap-2">
            <Label className="flex-1 flex items-center gap-x-1.5">
              <Checkbox />
              번호
            </Label>
            <Label className="flex-1 flex items-center gap-x-1.5">
              <Checkbox />
              이름
            </Label>
          </div>
        </div>
        <div>
          <Label className="flex items-center justify-between gap-x-2">
            <SheetSubTitle>결과 바로 보기</SheetSubTitle>
            <Switch checked onClick={() => {}} />
          </Label>
        </div>
        <div>
          <Label className="flex items-center justify-between gap-x-2">
            <SheetSubTitle>뽑힌 번호 제외</SheetSubTitle>
            <Switch checked onClick={() => {}} />
          </Label>
        </div>
        <div className="flex flex-col gap-y-4">
          <SheetSubTitle>뽑힌 순서 정렬</SheetSubTitle>
          <div className="max-sm:grid grid-cols-2 sm:flex items-center gap-2">
            <Label className="flex-1 flex items-center gap-x-1.5">
              <Checkbox />
              앞으로
            </Label>
            <Label className="flex-1 flex items-center gap-x-1.5">
              <Checkbox />
              뒤로
            </Label>
            <Label className="flex-1 flex items-center gap-x-1.5">
              <Checkbox />
              없음
            </Label>
          </div>
        </div>
        <div>
          <Button size="lg" variant="primary-outline" className="w-full">
            뽑기 초기화
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
