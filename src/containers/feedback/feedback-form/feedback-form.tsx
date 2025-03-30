import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { Button } from '@/components/button';
import { Textarea } from '@/components/textarea';
import { LoaderCircle } from 'lucide-react';
import { useFeedbackForm } from './feedback-form.hooks';

export default function FeedbackForm() {
  const { form, isValid, isPending, onSubmit } = useFeedbackForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                유형 <span className="text-red">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="피드백 유형을 선택해주세요." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="버그">버그</SelectItem>
                  <SelectItem value="개선">개선</SelectItem>
                  <SelectItem value="제안">제안</SelectItem>
                  <SelectItem value="응원">응원</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                페이지 <span className="text-red">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="페이지를 선택해주세요." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="홈">홈</SelectItem>
                  <SelectItem value="타이머">타이머</SelectItem>
                  <SelectItem value="QR코드">QR코드</SelectItem>
                  <SelectItem value="랜덤뽑기">랜덤뽑기</SelectItem>
                  <SelectItem value="음악신청">음악신청</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                내용 <span className="text-red">*</span>
              </FormLabel>
              <Textarea
                placeholder="피드백 내용을 입력해주세요."
                value={field.value}
                onChange={field.onChange}
                className="h-40"
              />
            </FormItem>
          )}
        />
        <Button className="mt-4" disabled={!isValid} type="submit">
          {isPending ? (
            <LoaderCircle size="18px" className="animate-spin text-white" />
          ) : (
            '보내기'
          )}
        </Button>
      </form>
    </Form>
  );
}
