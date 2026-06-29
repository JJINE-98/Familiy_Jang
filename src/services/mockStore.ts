import type { AppData, FamilyEvent, FamilyUser, GroupInput, PollVote, UserGroup } from '../types/database';

const STORAGE_KEY = 'family-app-fallback-data';
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

const createSeedData = (): AppData => {
  const groups: UserGroup[] = [
    { id: 'group-parents', name: '부모님', color: '#818CF8', sort_order: 1, created_at: now() },
    { id: 'group-first', name: '첫째네', color: '#34D399', sort_order: 2, created_at: now() },
    { id: 'group-second', name: '둘째네', color: '#F59E0B', sort_order: 3, created_at: now() },
  ];
  const users: FamilyUser[] = [
    { id: 'user-admin', group_id: groups[0].id, name: '장민수', birth_date: '1965-05-12', is_admin: true, active: true, created_at: now() },
    { id: 'user-1', group_id: groups[0].id, name: '김영희', birth_date: '1968-09-03', is_admin: false, active: true, created_at: now() },
    { id: 'user-2', group_id: groups[1].id, name: '장하나', birth_date: '1992-02-18', is_admin: false, active: true, created_at: now() },
    { id: 'user-3', group_id: groups[2].id, name: '장도윤', birth_date: '1995-11-25', is_admin: false, active: true, created_at: now() },
  ];
  const today = new Date();
  const date = (offset: number) => {
    const target = new Date(today);
    target.setDate(today.getDate() + offset);
    return target.toISOString().slice(0, 10);
  };
  const events: FamilyEvent[] = [
    { id: id(), title: '가족 저녁 모임', memo: '장소는 단체방에서 다시 정하기', event_type: 'schedule', start_date: date(2), end_date: null, repeat_type: 'none', is_important: true, group_id: groups[0].id, created_by: users[0].id, created_at: now(), updated_at: now() },
    { id: id(), title: '부모님 결혼기념일', memo: '꽃 예약 확인', event_type: 'anniversary', start_date: '2020-10-08', end_date: null, repeat_type: 'yearly', is_important: true, group_id: groups[0].id, created_by: users[1].id, created_at: now(), updated_at: now() },
  ];
  return {
    groups,
    users,
    events,
    polls: [
      { id: 'poll-1', title: '추석 모임 날짜 정하기', content: '토요일 저녁에 모이는 안에 찬성하시나요?', deadline_date: date(3), is_anonymous: false, created_by: users[2].id, created_at: now(), updated_at: now() },
    ],
    votes: [{ id: id(), poll_id: 'poll-1', user_id: users[0].id, vote: 'yes', created_at: now(), updated_at: now() }],
  };
};

export const readData = (): AppData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as AppData;
};

export const writeData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const upsertById = <T extends { id: string }>(items: T[], item: T) => {
  const exists = items.some((current) => current.id === item.id);
  return exists ? items.map((current) => (current.id === item.id ? item : current)) : [item, ...items];
};

export const createId = id;
export const timestamp = now;

export const makeGroup = (input: GroupInput): UserGroup => ({
  id: createId(),
  created_at: timestamp(),
  ...input,
});

export const upsertVote = (votes: PollVote[], vote: PollVote) => {
  const others = votes.filter((current) => !(current.poll_id === vote.poll_id && current.user_id === vote.user_id));
  return [vote, ...others];
};
