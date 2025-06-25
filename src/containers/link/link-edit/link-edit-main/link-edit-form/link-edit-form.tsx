import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { useCreateLink } from '@/hooks/apis/link/use-create-link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useLinkEditAction,
  useLinkEditState,
} from '../../link-edit-provider/link-edit-provider.hooks';

const LINK_ERROR_MESSAGE = {
  EMPTY_INPUT: '정보를 입력해 주세요.',
  API_ERROR: '방입장에 실패 했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  linkInput: z.string().nonempty({ message: LINK_ERROR_MESSAGE.EMPTY_INPUT }),
  descriptionInput: z.string(),
});

export default function LinkEditForm() {
  const { linkCode } = useLinkEditState();
  const { settingLinks } = useLinkEditAction();
  const { mutate: createLinkCode } = useCreateLink();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkInput: '',
      descriptionInput: '',
    },
    reValidateMode: 'onSubmit',
  });

  const handleSubmit = (formData: { link: string; description: string }) => {
    createLinkCode(
      { code: linkCode, ...formData },
      {
        onSuccess: (data) => {
          settingLinks((prev) => [...prev, data.data]);
        },
        onError: (data) => {
          form.setError('linkInput', {
            message: data.message ? data.message : LINK_ERROR_MESSAGE.API_ERROR,
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ linkInput, descriptionInput }) =>
          handleSubmit({ link: linkInput, description: descriptionInput }),
        )}
        className="flex flex-col gap-y-2"
      >
        <FormField
          control={form.control}
          name="linkInput"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormControl>
                  <div className="space-y-2">
                    <Label className="text-text-title" required>
                      링크
                    </Label>
                    <Input
                      type="text"
                      {...field}
                      placeholder="www.teachercan.com"
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionInput"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormControl>
                  <div className="space-y-2">
                    <Label className="text-text-title">설명</Label>
                    <Input type="text" {...field} placeholder="티쳐캔 페이지" />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary" className="w-[120px]">
          등록하기
        </Button>
      </form>
    </Form>
  );
  // <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
  //   <div className="space-y-2">
  //     <Label className="text-text-title" required>
  //       URL 링크
  //     </Label>
  //     <Input
  //       name="link"
  //       required
  //       value={link}
  //       onChange={(e) => setLink(e.target.value)}
  //       placeholder="https://www.teachercan.com"
  //     />
  //   </div>

  //   <div className="space-y-2">
  //     <Label className="text-text-title">설명</Label>
  //     <Input
  //       name="description"
  //       value={description}
  //       onChange={(e) => setDescription(e.target.value)}
  //       placeholder="티처캔 페이지"
  //       maxLength={30}
  //     />
  //   </div>

  //   <Button type="submit">등록하기</Button>
  // </form>
}
