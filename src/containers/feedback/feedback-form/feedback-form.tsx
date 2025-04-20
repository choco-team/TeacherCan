import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Input } from '@/components/input';
import { MENU_PATH_DATA } from '@/constants/route';
import { useFeedbackForm } from './feedback-form.hooks';

const typeItems = ['버그', '개선', '제안', '응원', '기타'];
const pageItems = [
  '홈',
  ...Object.values(MENU_PATH_DATA).map(({ title }) => title),
  '기타',
];

export default function FeedbackForm() {
  const { form, isPending, onSubmit } = useFeedbackForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                유형 <span className="text-red">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="피드백 유형을 선택해주세요." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
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
              <FormLabel>
                페이지 <span className="text-red">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="페이지를 선택해주세요." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pageItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
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
              <FormLabel>
                내용 <span className="text-red">*</span>
              </FormLabel>
              <Textarea
                placeholder="피드백 내용을 입력해주세요."
                value={field.value}
                onChange={field.onChange}
                className="min-h-60 resize-y"
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <Input
                placeholder="이메일을 입력해주세요."
                onChange={field.onChange}
              />
              <FormDescription>
                이메일을 입력하시면 추후 피드백 반영 결과나 관련 소식을 받아보실
                수 있어요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isPending={isPending} className="mt-4" type="submit">
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
