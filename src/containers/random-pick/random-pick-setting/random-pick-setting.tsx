import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import SettingPickType from './setting-pick-type/setting-pick-type';

type Props = {
  startPlay: () => void;
};

export default function RandomPickSetting({ startPlay }: Props) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>랜덤뽑기 만들기</CardTitle>
        </CardHeader>

        <CardContent className="pt-4 w-full">
          <SettingPickType startPlay={startPlay} />
        </CardContent>
      </Card>
    </div>
  );
}
