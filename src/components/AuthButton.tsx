'use client';

import { loginWithKakao } from '@/utils/kakaoAuth';
import { useAuthState, useAuthStore } from '@/store/use-auth-store';
import { useSessionCheck } from '@/hooks/use-session';
import { LogoutDialog } from '@/components/logout-dialog';

function AuthButton() {
  const isAuthenticated = useAuthState();
  const { logout } = useAuthStore();
  useSessionCheck(); // ✅ 세션 유지 체크

  return (
    <div>
      {isAuthenticated ? (
        <LogoutDialog onLogout={logout} />
      ) : (
        <button
          type="button"
          onClick={loginWithKakao}
          className="w-full cursor-pointer bg-[#FEE500] text-black py-1 px-2 rounded-md flex items-center justify-center shadow-md hover:bg-[#FDD835] transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
            alt="카카오톡 로고"
            className="w-6 h-6 mr-2"
          />
          카카오 로그인
        </button>
      )}
    </div>
  );
}

export default AuthButton;
