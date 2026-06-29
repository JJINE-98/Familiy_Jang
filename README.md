# Familiy_Jang

Vite + React + TypeScript 기반 가족 일정/기념일/투표 웹앱입니다.

## 실행

```bash
npm install
npm run dev
```

현재 Supabase 환경변수가 없으면 브라우저 `localStorage` 샘플 모드로 실행됩니다.
샘플 로그인:

- 이름: `장민수`
- 생년월일: `1965-05-12`

## 환경변수

`.env.example`을 참고해 `.env`를 만듭니다.

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_BASE_PATH=/Familiy_Jang/
```

`VITE_APP_BASE_PATH`는 GitHub Pages 저장소명 경로에 맞춰 사용합니다.

## 주요 구조

```txt
src/
  components/
    layout/
    calendar/
    events/
    polls/
    users/
    common/
  pages/
  services/
  types/
  utils/
```

## Supabase 테이블

앱은 다음 테이블을 기준으로 동작합니다.

- `user_groups`
- `users`
- `events`
- `polls`
- `poll_votes`

`poll_votes`는 사용자별 중복 투표 방지를 위해 `(poll_id, user_id)` unique 제약을 두는 것을 권장합니다.
