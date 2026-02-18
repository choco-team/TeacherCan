import Link from 'next/link';
import { Heading1, Heading2, Heading3 } from '@/components/heading';
import { ArrowLeft } from 'lucide-react';

const EFFECTIVE_DATE = '2026년 2월 18일';

const ARTICLE_ONE_TEXT = [
  '티처캔(TeacherCan)은 교실 수업 운영을 지원하는 웹 서비스로서, 이용자의',
  '개인정보를 최소한으로 수집하고 안전하게 처리하기 위해 「개인정보 보호법」 등',
  '관련 법령을 준수합니다. 본 개인정보처리방침은 서비스 이용 과정에서 처리되는',
  '개인정보의 항목, 이용 목적 및 보호 조치를 안내하기 위하여 마련되었습니다.',
  '티처캔은 교실 현장에서의 학생 개인정보 보호를 위해 서버 저장 최소화 및 로컬',
  '기반 활용을 원칙으로 하는 서비스입니다.',
].join(' ');

const ARTICLE_TWO_TEXT =
  '본 서비스는 초등학생 등 14세 미만 아동의 개인정보 보호를 위해 학생의 직접적인 개인정보 수집을 최소화하고 가명 정보 활용을 권장합니다.';

const ARTICLE_TWO_ITEMS = [
  '티처캔은 학생 회원가입 기능을 제공하지 않으며, 학생이 별도의 계정을 생성하지 않고 서비스를 이용할 수 있도록 설계되어 있습니다.',
  '학생은 교사가 안내한 방식에 따라 교실 활동에 참여하는 형태로 서비스를 이용합니다.',
  '음악 신청 기능 등에서 학생이 입력하는 정보는 닉네임 등 가명 정보 사용을 권장하며, 실명 등 민감한 개인정보 입력을 요구하지 않습니다.',
  '티처캔은 학생으로부터 이메일, 전화번호, 주소 등 개인 식별이 가능한 정보를 요구하거나 수집하지 않습니다.',
];

const ARTICLE_THREE_INTRO =
  '티처캔은 서비스 제공에 필요한 최소한의 정보만 처리합니다.';

const ARTICLE_THREE_SECTIONS = [
  {
    title: '음악 신청 기능 이용 시',
    description:
      '학생이 음악 신청 기능을 사용할 때 입력하는 닉네임이 서버에 저장됩니다.',
    bullets: [
      '수집 항목: 닉네임(자유 입력)',
      '이용 목적: 음악 신청 목록 표시 및 관리',
      '특징: 실명 입력 요구 없음, 가명 사용 권장',
    ],
    note: '※ 닉네임은 개인 식별 목적이 아닌 교실 활동 표시용 정보입니다.',
  },
  {
    title: '학생 명단 관리 기능',
    description:
      '교사가 사용하는 학생 명단 데이터는 교사의 기기(브라우저 로컬 저장소 등)에 저장되며 서버로 전송되지 않습니다.',
    bullets: [
      '저장 위치: 교사의 로컬 환경',
      '서버 저장 여부: 저장하지 않음',
      '이용 목적: 랜덤 뽑기, 모둠 구성 등 교실 활동 기능 제공',
    ],
    note: '즉, 학생 명단 정보는 티처캔 서버에서 수집하거나 보관하지 않습니다.',
  },
  {
    title: '자동 수집 정보',
    description:
      '티처캔은 웹 서비스 호스팅을 위해 Vercel 플랫폼을 이용하고 있으며, 서비스 이용 과정에서 다음과 같은 정보가 자동으로 생성·수집될 수 있습니다.',
    bullets: [
      '접속 로그 및 요청 기록',
      'IP 주소',
      '브라우저 종류 및 설정',
      '기기 정보 (운영체제, 화면 크기 등)',
      '접속 시간 및 이용 기록',
      '페이지 요청 정보 (URL, 응답 시간 등)',
    ],
    note: [
      '이는 서비스 운영, 보안 유지 및 장애 대응을 위한 기술적 목적에 한하여 사용됩니다.',
      '※ 이러한 정보는 웹 서비스 이용 시 서버에서 자동으로 생성되는 기술적 정보이며, 이용자를 식별하기 위한 목적으로 사용되지 않습니다.',
    ].join(' '),
  },
];

const ARTICLE_FOUR_ITEMS = [
  '음악 신청 닉네임 정보: 서비스 운영에 필요한 기간 동안 보관 후 삭제',
  '로컬 저장 학생 명단: 교사의 기기에서 직접 삭제 가능',
];

const ARTICLE_FOUR_NOTE = [
  '티처캔은 개인정보 보유 기간 최소화를 원칙으로 합니다.',
].join(' ');

const ARTICLE_FIVE_TEXT = [
  '티처캔은 서비스 운영을 위한 기술적 인프라 제공을 위해 다음과 같이 개인정보',
  '처리 업무를 위탁하고 있습니다. Vercel은 서버 및 네트워크 환경 제공 역할만',
  '수행하며, 이용자의 개인정보를 독자적으로 이용하지 않습니다.',
].join(' ');

const ARTICLE_SIX_TEXT =
  '이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제를 요청할 수 있는 권리를 가집니다.';

const ARTICLE_SIX_ITEMS = [
  '티처캔은 회원가입 기능이 없으며, 이용자가 별도의 계정을 생성하지 않고 서비스를 이용할 수 있도록 설계되어 있습니다.',
  '음악 신청 기능에서 입력된 닉네임 정보의 삭제를 원하는 경우, 서비스 운영자에게 요청할 수 있습니다.',
  '교사는 로컬 환경에 저장된 학생 명단 데이터를 직접 수정하거나 삭제할 수 있습니다.',
  '티처캔은 이용자의 권리 행사 요청이 있을 경우 지체 없이 필요한 조치를 취합니다.',
];

const ARTICLE_SEVEN_TEXT =
  '티처캔은 개인정보 처리 목적이 달성된 경우 지체 없이 해당 정보를 파기합니다.';

const ARTICLE_SEVEN_ITEMS = [
  '파기 절차: 서버에 저장된 닉네임 정보는 서비스 운영 목적이 종료되거나 삭제 요청이 있을 경우 즉시 삭제됩니다.',
  '파기 방법: 전자적 파일 형태로 저장된 개인정보는 복구할 수 없는 방법으로 영구 삭제합니다. 로컬에 저장된 학생 명단 정보는 교사의 기기에서 직접 삭제할 수 있습니다.',
];

const ARTICLE_EIGHT_ITEMS = [
  '최소한의 정보만 수집하는 구조 적용',
  '로컬 저장 우선 설계',
  'HTTPS 기반 보안 통신 적용',
  '접근 권한 최소화',
];

const ARTICLE_NINE_TEXT = [
  '개인정보 처리에 관한 업무를 총괄하고 관련 문의를 처리하기 위하여 개인정보',
  '보호책임자를 지정합니다.',
].join(' ');

const ARTICLE_NINE_CONTACT = [
  '정: 김홍동 / nlom00@gmail.com',
  '부: 정승민 / dndls321@gmail.com',
];

const ARTICLE_NINE_NOTE =
  '개인정보 침해에 대한 상담은 개인정보침해신고센터(국번없이 118)를 통해 받을 수 있습니다.';

const ARTICLE_TEN_TEXT = [
  '티처캔에서 처리되는 학생 관련 정보는 닉네임 등 가명 정보 중심으로 구성됩니다.',
  '가명 정보의 해석 및 활용은 교사의 교육 활동 범위 내에서 이루어지며, 티처캔은',
  '해당 정보를 독자적으로 분석하거나 활용하지 않습니다.',
].join(' ');

const ARTICLE_ELEVEN_TEXT = [
  '티처캔은 교사가 주도적으로 학생 데이터를 관리하는 서비스입니다. 교사는 학생',
  '개인정보 보호를 위해 다음 사항을 준수해야 합니다.',
].join(' ');

const ARTICLE_ELEVEN_ITEMS = [
  '학생의 실명, 연락처 등 민감한 개인정보를 입력하지 않도록 주의해야 합니다.',
  '교사는 학생 명단 데이터를 안전하게 관리하고 불필요한 정보는 삭제해야 합니다.',
  '교사는 학생 개인정보 보호를 위한 책임을 가지며, 서비스 이용 과정에서 발생하는 개인정보 관리에 유의해야 합니다.',
  '티처캔은 교사의 교육 활동을 지원하는 기술적 도구를 제공하는 플랫폼이며, 학생 정보의 활용 및 관리 책임은 교사에게 있습니다.',
];

const ARTICLE_TWELVE_TEXT =
  '본 개인정보처리방침은 법령 및 서비스 정책 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.';

export default function PrivacyPolicyContainer() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10 md:pb-14">
      <Link
        href="/legal"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-text-title hover:bg-gray-50 dark:hover:bg-gray-950/40 mb-10"
        aria-label="이전 페이지로 이동"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <Heading1>티처캔(TeacherCan) 개인정보처리방침</Heading1>
        </div>
        <p className="mt-2 text-sm md:text-base text-text-subtitle">
          시행일자: {EFFECTIVE_DATE}
        </p>
      </div>

      <div className="mt-8 space-y-10">
        <section className="space-y-4">
          <Heading2>제1조 (총칙)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_ONE_TEXT}
          </p>
        </section>

        <section className="space-y-4">
          <Heading2>제2조 (14세 미만 아동의 개인정보 보호)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_TWO_TEXT}
          </p>
          <ol className="list-decimal pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_TWO_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <Heading2>제3조 (개인정보의 수집 항목 및 이용 목적)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_THREE_INTRO}
          </p>
          <ol className="list-decimal pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-4">
            {ARTICLE_THREE_SECTIONS.map((section) => (
              <li key={section.title} className="space-y-2">
                <Heading3 className="text-sm md:text-base">
                  {section.title}
                </Heading3>
                <p>{section.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p>{section.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <Heading2>제4조 (개인정보의 보유 및 이용 기간)</Heading2>
          <ul className="list-disc pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_FOUR_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_FOUR_NOTE}
          </p>
        </section>

        <section className="space-y-4">
          <Heading2>제5조 (개인정보 처리 위탁)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_FIVE_TEXT}
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full border-collapse text-sm md:text-base text-text-subtitle">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr className="text-left">
                  <th className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 font-semibold">
                    수탁업체
                  </th>
                  <th className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 font-semibold">
                    위탁 업무 내용
                  </th>
                  <th className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 font-semibold">
                    보유 및 이용 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-gray-950/40">
                  <td className="px-4 py-3">Vercel Inc.</td>
                  <td className="px-4 py-3">웹 서비스 호스팅 및 인프라 제공</td>
                  <td className="px-4 py-3">서비스 운영 기간 동안</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <Heading2>제6조 (정보주체의 권리·의무 및 행사 방법)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_SIX_TEXT}
          </p>
          <ol className="list-decimal pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_SIX_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <Heading2>제7조 (개인정보의 파기 절차 및 방법)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_SEVEN_TEXT}
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_SEVEN_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <Heading2>제8조 (개인정보의 안전성 확보 조치)</Heading2>
          <ul className="list-disc pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_EIGHT_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <Heading2>제9조 (개인정보 보호책임자)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_NINE_TEXT}
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_NINE_CONTACT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_NINE_NOTE}
          </p>
        </section>

        <section className="space-y-4">
          <Heading2>제10조 (가명정보의 처리에 관한 사항)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_TEN_TEXT}
          </p>
        </section>

        <section className="space-y-4">
          <Heading2>제11조 (사용자의 의무 및 책임)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_ELEVEN_TEXT}
          </p>
          <ol className="list-decimal pl-5 text-sm md:text-base text-text-subtitle leading-7 space-y-2">
            {ARTICLE_ELEVEN_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-4">
          <Heading2>제12조 (개인정보처리방침의 변경)</Heading2>
          <p className="text-sm md:text-base text-text-subtitle leading-7">
            {ARTICLE_TWELVE_TEXT}
          </p>
        </section>
      </div>
    </div>
  );
}
