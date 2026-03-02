import Link from 'next/link';
import { Heading1, Heading3 } from '@/components/heading';
import { HELP_ROUTE } from '@/constants/route';

export default function LegalContainer() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 md:py-14">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <Heading1>약관/정책</Heading1>
        <p className="mt-2 text-sm md:text-base text-text-subtitle">
          확인하려는 약관 또는 정책을 선택해주세요.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <Heading3>제공 중인 문서</Heading3>
        <div className="grid gap-3">
          <Link
            href={HELP_ROUTE.PRIVACY_POLICY}
            className="group border border-gray-200 dark:border-gray-800 px-4 py-4 transition hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-950/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base text-text-title">
                개인정보처리방침
              </span>
              <span className="text-xs text-text-subtitle group-hover:text-text-title">
                자세히 보기
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
