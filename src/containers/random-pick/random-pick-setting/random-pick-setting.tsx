import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import SettingPickType from './setting-pick-type/setting-pick-type';
import {
  InnerPickListType,
  PickType,
} from '../random-pick-provider/random-pick-provider';

type Props = {
  updateRandomPickList: (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => void;
};

export default function RandomPickSetting({ updateRandomPickList }: Props) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-text-title">랜덤뽑기 만들기</CardTitle>
        </CardHeader>

        <CardContent className="pt-4 w-full">
          <SettingPickType updateRandomPickList={updateRandomPickList} />
        </CardContent>
      </Card>
    </div>
  );
}
