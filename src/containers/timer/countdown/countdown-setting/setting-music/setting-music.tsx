// 승민쌤

export default function SettingMusic() {
  // 설정 창이 닫혀있는 경우 해당컴포넌트가 언마운트 되기 때문에 배경음이 들리지 않습니다.
  // 때문에 CountdownProvider에서 제공하는 useCountdownState의 isActive 상태를 활용하여
  // CountdownMusicProvider(구현 필요)에서 카운트 다운 뮤직을 관리합니다.

  return (
    <div>
      <span>배경 음악</span>
      {/* 아래에 요구사항에 맞는 기능을 구현하세요. */}
    </div>
  );
}
