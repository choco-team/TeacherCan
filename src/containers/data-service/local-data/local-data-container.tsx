'use client';

import { useCallback, useEffect, useState } from 'react';
import { Heading1, Heading2 } from '@/components/heading';
import { Button } from '@/components/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import {
  LOCAL_STORAGE_GROUPS,
  LOCAL_STORAGE_KEY_META,
} from '@/constants/localStorageGroups';
import { getPathDisplayTitle } from '@/constants/route';
import { ALLERGY_MAP } from '@/containers/landing/lunch-menu/allergy/allergy.constant';
import { cn } from '@/styles/utils';

/** 객체/배열 항목을 [object Object] 없이 짧은 읽기 쉬운 문자열로 변환 */
function itemToReadable(item: unknown): string {
  if (item === null || item === undefined) return '(없음)';
  if (typeof item === 'string') return item.slice(0, 50);
  if (typeof item === 'number' || typeof item === 'boolean')
    return String(item);
  if (typeof item !== 'object') return String(item);
  const o = item as Record<string, unknown>;
  const pick =
    o.name ??
    o.title ??
    o.label ??
    o.value ??
    (typeof o.id === 'string' ? o.id : null);
  if (pick != null && typeof pick === 'string') return pick.slice(0, 40);
  if (typeof pick === 'number') return String(pick);
  const keys = Object.keys(o);
  if (keys.length === 0) return '(빈 항목)';
  const first = o[keys[0]];
  if (typeof first === 'string') return `${keys[0]}: ${first.slice(0, 30)}`;
  if (typeof first === 'number' || typeof first === 'boolean')
    return `${keys[0]}: ${first}`;
  return `항목 (${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '…' : ''})`;
}

type DisplayValue = { summary: string; detail?: string };

/** localStorage 값을 고객이 이해하기 쉬운 형태로 풀어서 설명 (실제 저장 데이터 기준, "예:" 없음) */
function getValueDisplay(key: string): DisplayValue {
  if (typeof window === 'undefined') return { summary: '—' };
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { summary: '저장된 데이터 없음' };
    const trimmed = raw.trim();
    if (trimmed === '') return { summary: '저장된 데이터 없음' };

    if (key === 'teacher-can:clock-memo') {
      return {
        summary: '시계 메모',
        detail: trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed,
      };
    }

    if (trimmed === 'true') return { summary: '켜짐' };
    if (trimmed === 'false') return { summary: '꺼짐' };
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return { summary: `숫자: ${trimmed}` };

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (key === 'recently-visited' && Array.isArray(parsed)) {
        const list = parsed as { pathname?: string }[];
        if (list.length === 0) return { summary: '저장된 데이터 없음' };
        const pathNames = list
          .slice(0, 3)
          .map((item) => getPathDisplayTitle(item.pathname ?? ''))
          .join(', ');
        const rest = list.length > 3 ? ` 외 ${list.length - 3}개` : '';
        return {
          summary: `최근 방문 ${list.length}곳`,
          detail: `${pathNames}${rest}`,
        };
      }

      if (
        key === 'selectedSchool' &&
        parsed !== null &&
        typeof parsed === 'object'
      ) {
        const o = parsed as Record<string, unknown>;
        const name = (o.SCHUL_NM ?? o.schoolName ?? o.name ?? o.title) as
          | string
          | null
          | undefined;
        if (name == null || name === '')
          return { summary: '저장된 데이터 없음' };
        return {
          summary: '선택한 급식 학교',
          detail: String(name),
        };
      }

      if (key === 'schedule' && Array.isArray(parsed)) {
        const arr = parsed as { name?: string; title?: string }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const titles = arr
          .slice(0, 3)
          .map((s) => s?.name ?? s?.title ?? '(제목 없음)')
          .join(', ');
        const rest = arr.length > 3 ? ` 외 ${arr.length - 3}개` : '';
        return {
          summary: `일정 ${arr.length}개`,
          detail: `${titles}${rest}`,
        };
      }

      if (key === 'allergies' && Array.isArray(parsed)) {
        const arr = parsed as number[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const names = arr
          .map((id) => ALLERGY_MAP.get(Number(id)) ?? `(${id}번)`)
          .join(', ');
        return {
          summary: `알레르기 ${arr.length}종`,
          detail: names,
        };
      }

      if (key === 'student-data' && Array.isArray(parsed)) {
        const arr = parsed as { name?: string }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const names = arr
          .slice(0, 5)
          .map((s) => s?.name ?? '(이름 없음)')
          .join(', ');
        const rest = arr.length > 5 ? ` 외 ${arr.length - 5}명` : '';
        return {
          summary: `학생 ${arr.length}명`,
          detail: `${names}${rest}`,
        };
      }

      if (key === 'timer-alarm-sound') {
        const s = typeof parsed === 'string' ? parsed : '';
        if (!s) return { summary: '저장된 데이터 없음' };
        return {
          summary: '알람 소리',
          detail: s,
        };
      }

      if (
        key === 'clock-memo' &&
        parsed !== null &&
        typeof parsed === 'object'
      ) {
        const o = parsed as { text?: string; timeTag?: string };
        const text = o?.text?.trim?.() ?? '';
        if (!text) return { summary: '저장된 데이터 없음' };
        const timeTag = o?.timeTag?.trim?.();
        const detail = timeTag ? `[${timeTag}] ${text}` : text;
        return {
          summary: '시계 메모 (설정)',
          detail: detail.length > 80 ? `${detail.slice(0, 80)}…` : detail,
        };
      }

      if (key === 'qrcodes' && Array.isArray(parsed)) {
        const arr = parsed as { title?: string }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const titles = arr
          .slice(0, 3)
          .map((q) => q?.title ?? '(제목 없음)')
          .join(', ');
        const rest = arr.length > 3 ? ` 외 ${arr.length - 3}개` : '';
        return {
          summary: `QR코드 ${arr.length}개`,
          detail: `${titles}${rest}`,
        };
      }

      if (key === 'stopwatch-data' && Array.isArray(parsed)) {
        const arr = parsed as { title?: string }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const titles = arr.map((g) => g?.title ?? '(그룹)').join(', ');
        return {
          summary: `그룹 ${arr.length}개`,
          detail: titles,
        };
      }

      if (key === 'stopwatch-group-grid-columns') {
        const n = typeof parsed === 'number' ? parsed : Number(parsed);
        if (!Number.isFinite(n)) return { summary: '저장된 데이터 없음' };
        return {
          summary: '그리드 열 수',
          detail: `${n} 열`,
        };
      }

      if (key === 'random-pick-list' && Array.isArray(parsed)) {
        const arr = parsed as {
          title?: string;
          pickType?: string;
          options?: {
            isExcludingSelected?: boolean;
            isHideResult?: boolean;
            isMixingAnimation?: boolean;
          };
        }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const parts = arr.slice(0, 5).map((p) => {
          const title = p?.title ?? '(제목 없음)';
          const type = p?.pickType ?? '';
          const opt = p?.options;
          const optStr =
            opt != null
              ? [
                  opt.isExcludingSelected ? '뽑은 것 제외' : null,
                  opt.isHideResult ? '결과 숨김' : null,
                  opt.isMixingAnimation ? '섞기 애니' : null,
                ]
                  .filter(Boolean)
                  .join(', ') || '—'
              : '—';
          return `${title} (${type}) · ${optStr}`;
        });
        const rest = arr.length > 5 ? ` 외 ${arr.length - 5}개` : '';
        return {
          summary: `뽑기 목록 ${arr.length}개`,
          detail: `${parts.join(' / ')}${rest}`,
        };
      }

      if (key === 'roomIds' && Array.isArray(parsed)) {
        const arr = parsed as string[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        return {
          summary: `방 ${arr.length}개`,
          detail: undefined,
        };
      }

      if (key === 'routines' && Array.isArray(parsed)) {
        const arr = parsed as { name?: string }[];
        if (arr.length === 0) return { summary: '저장된 데이터 없음' };
        const titles = arr.map((r) => r?.name ?? '(제목 없음)').join(', ');
        return {
          summary: `루틴 ${arr.length}개`,
          detail: titles,
        };
      }

      if (
        key === 'random-team-settings' &&
        parsed !== null &&
        typeof parsed === 'object'
      ) {
        const o = parsed as {
          students?: unknown[];
          teamCount?: number;
        };
        const studentsCount = Array.isArray(o.students) ? o.students.length : 0;
        const teamCount =
          typeof o.teamCount === 'number' ? o.teamCount : undefined;

        if (!studentsCount && !teamCount) {
          return { summary: '저장된 데이터 없음' };
        }

        const summaryParts: string[] = [];
        if (studentsCount) summaryParts.push(`학생 ${studentsCount}명`);
        if (teamCount != null) summaryParts.push(`모둠 ${teamCount}개`);

        return {
          summary: summaryParts.join(' · '),
        };
      }

      if (key === 'random-team-auto-run') {
        const v = parsed === true || parsed === 'true';
        return {
          summary: v ? '자동 실행 켜짐' : '자동 실행 꺼짐',
        };
      }

      if (Array.isArray(parsed)) {
        const labels = parsed.slice(0, 4).map((item) => itemToReadable(item));
        const detail =
          labels.join(', ') +
          (parsed.length > 4 ? ` 외 ${parsed.length - 4}개` : '');
        return {
          summary: `목록 ${parsed.length}개`,
          detail: parsed.length > 0 ? detail : undefined,
        };
      }

      if (parsed !== null && typeof parsed === 'object') {
        const o = parsed as Record<string, unknown>;
        const keys = Object.keys(o);
        const parts = keys
          .slice(0, 5)
          .map((k) => `${k}: ${itemToReadable(o[k])}`);
        return {
          summary: `설정 ${keys.length}개`,
          detail:
            parts.join(' · ').slice(0, 120) + (keys.length > 5 ? '…' : ''),
        };
      }
    } catch {
      // JSON 아님 → 일반 문자열
    }

    return {
      summary: raw.length > 40 ? `텍스트 ${raw.length}자` : raw,
      detail: raw.length > 40 ? `${raw.slice(0, 80)}…` : undefined,
    };
  } catch {
    return { summary: '—' };
  }
}

function getKeyLabel(key: string): string {
  return LOCAL_STORAGE_KEY_META[key]?.label ?? key;
}

function getKeyDescription(key: string): string {
  return (
    LOCAL_STORAGE_KEY_META[key]?.description ??
    '이 기기에서 저장된 데이터입니다.'
  );
}

type DeleteTarget =
  | { type: 'key'; key: string }
  | { type: 'group'; groupId: string }
  | { type: 'all' };

export default function LocalDataContainer() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleDeleteKey = (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
    refresh();
  };

  const handleDeleteGroup = (groupId: string) => {
    if (typeof window === 'undefined') return;
    const group = LOCAL_STORAGE_GROUPS.find((g) => g.id === groupId);
    if (group) {
      group.keys.forEach((key) => window.localStorage.removeItem(key));
      refresh();
    }
  };

  const handleDeleteAll = () => {
    if (typeof window === 'undefined') return;
    LOCAL_STORAGE_GROUPS.forEach((group) => {
      group.keys.forEach((key) => window.localStorage.removeItem(key));
    });
    refresh();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'key') handleDeleteKey(deleteTarget.key);
    else if (deleteTarget.type === 'group')
      handleDeleteGroup(deleteTarget.groupId);
    else if (deleteTarget.type === 'all') handleDeleteAll();
    setDeleteTarget(null);
  };

  const confirmMessage = (() => {
    if (!deleteTarget) return '';
    if (deleteTarget.type === 'key')
      return `"${getKeyLabel(deleteTarget.key)}" 데이터를 삭제하시겠습니까?`;
    if (deleteTarget.type === 'group')
      return '이 그룹의 모든 로컬 데이터를 삭제하시겠습니까?';
    if (deleteTarget.type === 'all')
      return '모든 로컬 데이터를 삭제하시겠습니까? 앱에 저장된 설정·데이터가 모두 제거됩니다.';
    return '';
  })();

  return (
    <div
      key={refreshKey}
      className="max-w-screen-sm w-full mx-auto items-start"
    >
      <Heading1 className="font-semibold mb-2">로컬 데이터 관리</Heading1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        기능별로 이 기기에 저장된 데이터를 확인하고 삭제할 수 있습니다.
      </p>

      <div className="flex flex-col gap-8">
        {LOCAL_STORAGE_GROUPS.map((group) => (
          <section
            key={group.id}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <Heading2 className="text-base font-semibold">
                {group.label}
              </Heading2>
              <Button
                variant="gray-outline"
                size="sm"
                onClick={() =>
                  setDeleteTarget({ type: 'group', groupId: group.id })
                }
              >
                이 그룹 전체 삭제
              </Button>
            </div>
            <ul className="space-y-3">
              {group.keys.map((key) => {
                const display: DisplayValue = isReady
                  ? getValueDisplay(key)
                  : { summary: '—', detail: undefined };
                const { summary, detail } = display;
                const label = getKeyLabel(key);
                const description = getKeyDescription(key);
                return (
                  <li
                    key={key}
                    className={cn(
                      'rounded-lg border border-gray-100 dark:border-gray-800',
                      'bg-gray-50/50 dark:bg-gray-900/30 p-3',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {description}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {summary}
                        </p>
                        {detail && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {detail}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="gray-ghost"
                        size="xs"
                        onClick={() => setDeleteTarget({ type: 'key', key })}
                        className="shrink-0"
                      >
                        삭제
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="red"
            size="md"
            onClick={() => setDeleteTarget({ type: 'all' })}
          >
            모든 로컬 데이터 삭제
          </Button>
        </section>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>{confirmMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red text-red-foreground hover:bg-red/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
