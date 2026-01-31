import Link from 'next/link';
import { Heading1 } from '@/components/heading';

export function ClockMainContainer() {
  return (
    <section className="mx-auto flex w-full max-w-screen-sm flex-col justify-center px-4">
      <div className="flex flex-col gap-2">
        <Heading1>시계</Heading1>
        <p className="text-sm text-text-subtitle">
          한국 표준시(KST, UTC+9) 기준으로 현재 시간을 표시합니다.
        </p>
      </div>
      <div className="mt-8 grid gap-4">
        <Link
          href="/clock/analog"
          className="group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="text-xs font-medium text-text-subtitle">Analog</div>
          <div className="mt-1 text-lg font-semibold text-text-title">
            아날로그 시계
          </div>
          <p className="mt-2 text-sm text-text-subtitle">
            클래식한 다이얼 디자인으로 시간을 확인합니다.
          </p>
        </Link>
        <Link
          href="/clock/digital"
          className="group rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="text-xs font-medium text-text-subtitle">Digital</div>
          <div className="mt-1 text-lg font-semibold text-text-title">
            디지털 시계
          </div>
          <p className="mt-2 text-sm text-text-subtitle">
            읽기 쉬운 숫자 디스플레이로 시간을 확인합니다.
          </p>
        </Link>
      </div>
    </section>
  );
}
