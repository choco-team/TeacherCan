import { getHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TEACHER_GREETINGS = {
  morning: '좋은 아침이에요. 오늘도 힘찬 하루 보내세요.',
  lunch: '바쁜 하루 속에서도 잠시 쉬어가세요. 점심 맛있게 드세요.',
  afternoon: '나른해지기 쉬운 오후네요. 커피 한 잔과 함께 기운을 내 보세요.',
  beforeLeave: '이제 곧 퇴근 시간이 다가오고 있어요. 조금만 더 힘내요.',
  evening: '저녁 식사 맛있게 드시고, 오늘 하루도 수고 많으셨어요.',
  night: '편안한 밤 보내시고, 내일도 기분 좋은 하루 맞이하세요.',
};

export default function Welcome() {
  const currentHour = getHours(toZonedTime(new Date(), 'Asia/Seoul'));

  function getTeacherGreeting() {
    if (currentHour >= 5 && currentHour < 12) {
      return TEACHER_GREETINGS.morning;
    }
    if (currentHour >= 12 && currentHour < 14) {
      return TEACHER_GREETINGS.lunch;
    }
    if (currentHour >= 14 && currentHour < 16) {
      return TEACHER_GREETINGS.afternoon;
    }
    if (currentHour >= 16 && currentHour < 18) {
      return TEACHER_GREETINGS.beforeLeave;
    }
    if (currentHour >= 18 && currentHour < 20) {
      return TEACHER_GREETINGS.evening;
    }
    return TEACHER_GREETINGS.night;
  }
  return (
    <div className="text-center w-full">
      <h2 className="text-2xl lg:text-2.5xl font-semibold text-text-title">
        {getTeacherGreeting()}
      </h2>
    </div>
  );
}
