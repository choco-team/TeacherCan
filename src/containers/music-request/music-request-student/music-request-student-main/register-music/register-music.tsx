import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import MusicRegister from '@/containers/music-request/music-register/music-register';
import RegisterGuide from '../register-guide/register-guide';
import { useMusicRequestStudentState } from '../../music-request-student-provider/music-request-student-provider.hooks';

type Props = {
  roomId: string;
};

export default function RegisterMusic({ roomId }: Props) {
  const { studentName } = useMusicRequestStudentState();

  return (
    <Tabs defaultValue="register" className="flex flex-col w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">요청하기</TabsTrigger>
        <TabsTrigger value="guide">요청방법</TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <MusicRegister roomId={roomId} studentName={studentName} />
      </TabsContent>
      <TabsContent value="guide">
        <RegisterGuide />
      </TabsContent>
    </Tabs>
  );
}
