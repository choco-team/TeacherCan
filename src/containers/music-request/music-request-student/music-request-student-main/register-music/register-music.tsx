import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import RegisterGuide from './register-guide/register-guide';
import Register from './register/register';
import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../../music-request-student-provider/music-request-student-provider.hooks';

type Props = {
  roomId: string;
};

export default function RegisterMusic({ roomId }: Props) {
  const { studentName, alertOpen, alertMessage } =
    useMusicRequestStudentState();
  const { settingAlertOpen } = useMusicRequestStudentAction();

  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={settingAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="hidden">title</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tabs defaultValue="register" className="flex flex-col w-full h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">요청하기</TabsTrigger>
          <TabsTrigger value="guide">요청방법</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <Register roomId={roomId} studentName={studentName} />
        </TabsContent>
        <TabsContent value="guide">
          <RegisterGuide />
        </TabsContent>
      </Tabs>
    </>
  );
}
