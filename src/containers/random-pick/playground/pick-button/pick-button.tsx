import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/button';
import { Form, FormControl, FormField } from '@/components/form';
import { getFormSchema } from '@/utils/getFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { cn } from '@/styles/utils';
import { useNavState } from '@/store/use-nav-store';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  openResult: () => void;
};

export default function PickButton({ openResult }: Props) {
  const { randomPick } = useRandomPickPlaygroundState();
  const winners = randomPick.pickList.filter((item) => item.isPicked);

  const {
    options: { isExcludingSelected },
  } = randomPick;

  const { runPick } = useRandomPickPlaygroundAction();

  const isNavOpen = useNavState();

  const restStudentNumbers = Array.from(
    {
      length: isExcludingSelected
        ? randomPick.pickList.length - winners.length
        : randomPick.pickList.length,
    },
    (_, index) => index + 1,
  );

  const formSchema = getFormSchema(
    isExcludingSelected
      ? randomPick.pickList.length - winners.length
      : randomPick.pickList.length,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
    },
  });

  const onSubmit = ({ number }: z.infer<typeof formSchema>) => {
    runPick(number);
    openResult();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-x-4 px-6 py-4 bg-primary-50  dark:bg-gray-900 rounded-3xl',
          'transition-[margin] duration-500',
          isNavOpen && 'lg:ms-[130px]',
        )}
      >
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <div
              className={cn(
                'flex items-center gap-x-2',
                randomPick.pickList.length === winners.length && 'hidden',
              )}
            >
              <FormControl>
                <Select
                  defaultValue={field.value.toString()}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="text-lg w-20 h-12">
                    <SelectValue placeholder="뽑을 인원" />
                  </SelectTrigger>
                  <SelectContent>
                    {restStudentNumbers.map((studentNumber) => (
                      <SelectItem
                        key={studentNumber}
                        value={studentNumber.toString()}
                      >
                        <span className="text-text-title">{studentNumber}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <span className="text-lg text-text-title">명</span>
            </div>
          )}
        />
        <Button
          type="submit"
          disabled={randomPick.pickList.length === winners.length}
          size="lg"
          className="self-center p-10 rounded-2xl text-3xl hover:scale-105 active:scale-95"
        >
          뽑기
        </Button>
      </form>
    </Form>
  );
}
