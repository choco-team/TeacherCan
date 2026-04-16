export default function MusicRequestMaintenanceNotice() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-xl border border-orange-200 bg-orange-50 p-6 text-center dark:border-orange-900/60 dark:bg-orange-950/30">
        <h1 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
          음악신청 서비스 점검 안내
        </h1>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-orange-800 dark:text-orange-200">
          {`현재 음악신청 서비스에 일시적인 문제가 발생하여 운영이 잠시 중단되었습니다.
최대한 빠르게 확인하여 서비스를 재개하겠습니다.`}
        </p>
      </div>
    </section>
  );
}
