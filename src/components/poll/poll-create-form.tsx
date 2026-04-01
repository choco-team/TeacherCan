'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Card } from '@/components/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import {
  Plus,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  History,
  GripVertical,
  Eye,
} from 'lucide-react';
import { useCreatePoll } from '@/hooks/apis/quickpoll/use-create-poll';
import { useRouter } from 'next/navigation';
import PollImageUpload from '@/components/poll/poll-image-upload';
import PollVotingView from '@/components/poll/poll-voting-view';
import { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ADMIN_HISTORY_KEY = 'quickpoll-admin-history';

interface AdminHistoryItem {
  id: string;
  title: string;
  secretToken: string;
  createdAt: string;
}

const optionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '선택지를 입력해주세요'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

const pollFormSchema = z.object({
  title: z.string().min(1, '투표 제목을 입력해주세요'),
  description: z.string().optional(),
  maxVotesPerPerson: z.number().min(1).max(10),
  options: z.array(optionSchema).min(2, '최소 2개 이상의 선택지가 필요합니다'),
});

type PollFormData = z.infer<typeof pollFormSchema>;
type OptionData = PollFormData['options'][number];

// ─── 드래그 가능한 선택지 아이템 ───
function SortableOptionItem({
  option,
  index,
  form,
  expandedOptions,
  onToggleField,
  onRemove,
  canRemove,
}: {
  option: OptionData;
  index: number;
  form: any;
  expandedOptions: Record<number, { description: boolean; image: boolean }>;
  onToggleField: (index: number, field: 'description' | 'image') => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-2 pb-4"
    >
      <div className="flex gap-2 items-start">
        {/* 드래그 핸들 */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-2.5 p-1 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          aria-label="드래그하여 순서 변경"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <FormField
          control={form.control}
          name={`options.${index}.title`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder={`선택지 ${index + 1}`}
                  className="border-0 border-b px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary"
                  {...field}
                  onPaste={(e) => {
                    const text = e.clipboardData.getData('text');
                    // 개행 또는 콤마로 분리된 항목 감지
                    const lines = text
                      .split(/[\n,]/)
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0);
                    if (lines.length > 1) {
                      e.preventDefault();
                      const currentOptions: OptionData[] =
                        form.getValues('options');
                      // 현재 인덱스에 첫번째 항목 적용
                      const newOptions = [...currentOptions];
                      newOptions[index] = {
                        ...newOptions[index],
                        title: lines[0],
                      };
                      // 나머지 항목 추가
                      lines.slice(1).forEach((line) => {
                        newOptions.push({
                          id: crypto.randomUUID(),
                          title: line,
                          description: '',
                          imageUrl: '',
                        });
                      });
                      form.setValue('options', newOptions);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="gray-ghost"
            onClick={() => onToggleField(index, 'description')}
            className={`px-2 ${
              expandedOptions[index]?.description
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground'
            }`}
            title="설명 추가"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="gray-ghost"
            onClick={() => onToggleField(index, 'image')}
            className={`px-2 ${
              expandedOptions[index]?.image
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground'
            }`}
            title="이미지 추가"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          {canRemove && (
            <Button
              type="button"
              size="sm"
              variant="gray-ghost"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive px-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 설명 필드 */}
      {expandedOptions[index]?.description && (
        <FormField
          control={form.control}
          name={`options.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="이 선택지에 대한 설명 (선택)"
                  className="text-sm border-muted focus-visible:ring-1"
                  rows={2}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {/* 이미지 필드 */}
      {expandedOptions[index]?.image && (
        <div className="pt-2">
          <PollImageUpload
            value={form.watch(`options.${index}.imageUrl`)}
            onChange={(url) => form.setValue(`options.${index}.imageUrl`, url)}
          />
        </div>
      )}
    </div>
  );
}

export default function PollCreateForm() {
  const [showDescription, setShowDescription] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState<
    Record<number, { description: boolean; image: boolean }>
  >({});
  const { create, loading } = useCreatePoll();
  const router = useRouter();
  const [myPolls, setMyPolls] = useState<AdminHistoryItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const stored = localStorage.getItem(ADMIN_HISTORY_KEY);
    if (stored) {
      try {
        const parsed: AdminHistoryItem[] = JSON.parse(stored);
        const validPolls = parsed.filter(
          (p) => now - new Date(p.createdAt).getTime() < SEVEN_DAYS,
        );
        if (parsed.length !== validPolls.length) {
          localStorage.setItem(ADMIN_HISTORY_KEY, JSON.stringify(validPolls));
        }
        setMyPolls(validPolls);
      } catch (e) {
        console.error('Failed to parse admin history', e);
      }
    }
  }, []);

  const form = useForm<PollFormData>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: '',
      description: '',
      maxVotesPerPerson: 1,
      options: [
        { id: crypto.randomUUID(), title: '', description: '', imageUrl: '' },
        { id: crypto.randomUUID(), title: '', description: '', imageUrl: '' },
      ],
    },
  });

  const onSubmit = async (data: PollFormData) => {
    const poll = await create({
      title: data.title,
      description: data.description,
      maxVotesPerPerson: data.maxVotesPerPerson,
      options: data.options.map(({ id, ...rest }) => rest) as any,
    });

    if (poll) {
      const newItem: AdminHistoryItem = {
        id: poll.id,
        title: poll.title,
        secretToken: poll.secretToken || '',
        createdAt: poll.createdAt,
      };
      const updatedPolls = [newItem, ...myPolls];
      localStorage.setItem(ADMIN_HISTORY_KEY, JSON.stringify(updatedPolls));
      setMyPolls(updatedPolls);

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const adminUrl = `${baseUrl}/quickpoll?id=${poll.id}&secret=${poll.secretToken}`;
      router.push(adminUrl);
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = myPolls.filter((p) => p.id !== id);
    localStorage.setItem(ADMIN_HISTORY_KEY, JSON.stringify(updated));
    setMyPolls(updated);
  };

  const handleAddOption = () => {
    const currentOptions = form.getValues('options');
    form.setValue('options', [
      ...currentOptions,
      { id: crypto.randomUUID(), title: '', description: '', imageUrl: '' },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = form.getValues('options');
    if (currentOptions.length > 2) {
      form.setValue(
        'options',
        currentOptions.filter((_, i) => i !== index),
      );
      // expandedOptions 인덱스 재정렬
      setExpandedOptions((prev) => {
        const next: typeof prev = {};
        Object.entries(prev).forEach(([k, v]) => {
          const n = parseInt(k);
          if (n < index) next[n] = v;
          else if (n > index) next[n - 1] = v;
        });
        return next;
      });
    }
  };

  const toggleOptionField = (index: number, field: 'description' | 'image') => {
    setExpandedOptions((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: !prev[index]?.[field],
      },
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const currentOptions = form.getValues('options');
    const oldIndex = currentOptions.findIndex((o) => o.id === active.id);
    const newIndex = currentOptions.findIndex((o) => o.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      form.setValue('options', arrayMove(currentOptions, oldIndex, newIndex));
      // expandedOptions도 함께 재정렬
      setExpandedOptions((prev) => {
        const entries = Object.entries(prev).map(([k, v]) => [parseInt(k), v]);
        const reordered: typeof prev = {};
        // arrayMove 결과 인덱스 매핑
        const movedIndices = arrayMove(
          Array.from({ length: currentOptions.length }, (_, i) => i),
          oldIndex,
          newIndex,
        );
        movedIndices.forEach((origIdx, newIdx) => {
          const entry = entries.find(([k]) => k === origIdx);
          if (entry) reordered[newIdx] = entry[1] as any;
        });
        return reordered;
      });
    }
  };

  const options = form.watch('options');
  const title = form.watch('title');
  const description = form.watch('description');
  const maxVotesPerPerson = form.watch('maxVotesPerPerson');
  const [previewOpen, setPreviewOpen] = useState(false);

  // 미리보기용 mock Poll 객체
  const previewPoll = {
    id: 'preview',
    title: title || '(제목 없음)',
    description: description,
    status: 'active' as const,
    maxVotesPerPerson: maxVotesPerPerson,
    options: options
      .filter((o) => o.title.trim())
      .map((o, i) => ({
        id: `preview-opt-${i}`,
        title: o.title,
        description: o.description,
        imageUrl: o.imageUrl,
        voteCount: 0,
      })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="gray-outline" className="gap-2">
              <History className="w-4 h-4" />
              기존 투표 확인하기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>내가 만든 투표 목록</DialogTitle>
              <DialogDescription className="text-destructive font-semibold">
                아래 데이터는 7일간만 저장됩니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
              {myPolls.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  최근 7일 내 생성한 투표가 없습니다.
                </p>
              ) : (
                myPolls.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/quickpoll?id=${p.id}&secret=${p.secretToken}`,
                        )
                      }
                    >
                      <p className="font-semibold text-sm hover:underline">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="gray-ghost"
                      size="sm"
                      onClick={() => handleDeleteHistory(p.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2 ml-2"
                    >
                      삭제
                    </Button>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              7일이 지나거나 삭제 버튼을 누르면 이 기기에서 내역이 사라집니다.
            </p>
          </DialogContent>
        </Dialog>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 투표 기본 정보 */}
          <div className="space-y-4">
            {/* 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="투표 제목을 입력하세요"
                      className="text-xl font-semibold border-0 px-0 rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 토글 및 입력 */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="gray-ghost"
                  size="sm"
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-muted-foreground hover:text-foreground gap-2 px-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">설명</span>
                  {showDescription ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {showDescription && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="투표에 대한 설명을 입력하세요 (선택)"
                          className="text-sm border-muted focus-visible:ring-1"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* 선택 가능 개수 */}
            <FormField
              control={form.control}
              name="maxVotesPerPerson"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm text-muted-foreground">
                      선택 가능한 개수
                    </FormLabel>
                    <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                      <Button
                        type="button"
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => {
                          const current = parseInt(
                            field.value?.toString() || '1',
                          );
                          if (current > 1) field.onChange(current - 1);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        −
                      </Button>
                      <span className="w-6 text-center font-semibold">
                        {field.value}
                      </span>
                      <Button
                        type="button"
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => {
                          const current = parseInt(
                            field.value?.toString() || '1',
                          );
                          if (current < 10) field.onChange(current + 1);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* 선택지 (DnD) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground">
                선택지
              </h3>
              <p className="text-xs text-muted-foreground">
                ✦ 여러 항목을 한 번에 붙여넣기 가능 (개행/콤마 구분)
              </p>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={options.map((o) => o.id)}
                strategy={verticalListSortingStrategy}
              >
                {options.map((option, index) => (
                  <SortableOptionItem
                    key={option.id}
                    option={option}
                    index={index}
                    form={form}
                    expandedOptions={expandedOptions}
                    onToggleField={toggleOptionField}
                    onRemove={handleRemoveOption}
                    canRemove={options.length > 2}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* 선택지 추가 */}
            <Button
              type="button"
              variant="gray-outline"
              onClick={handleAddOption}
              className="w-full gap-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
              선택지 추가
            </Button>
          </div>

          {/* 에러 메시지 */}
          {form.formState.errors.options && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              {form.formState.errors.options.message}
            </div>
          )}

          {/* 미리보기 + 제출 */}
          <div className="flex gap-3">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="gray-outline"
                  className="gap-2 shrink-0 py-6"
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="px-6 pt-6 pb-0">
                  <DialogTitle className="text-base">투표 화면 미리보기</DialogTitle>
                  <DialogDescription className="text-xs">
                    실제 참가자에게 보이는 화면입니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="pb-4">
                  <PollVotingView poll={previewPoll} />
                </div>
              </DialogContent>
            </Dialog>

            <Button
              type="submit"
              className="flex-1 font-semibold py-6"
              disabled={loading}
            >
              {loading ? '생성 중...' : '투표 생성'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
