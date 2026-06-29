export type EventType = 'schedule' | 'anniversary' | 'birthday';
export type RepeatType = 'none' | 'yearly' | 'monthly';
export type VoteValue = 'yes' | 'no';

export interface UserGroup {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface FamilyUser {
  id: string;
  group_id: string | null;
  name: string;
  birth_date: string;
  is_admin: boolean;
  active: boolean;
  created_at: string;
}

export interface FamilyEvent {
  id: string;
  title: string;
  memo: string | null;
  event_type: EventType;
  start_date: string;
  end_date: string | null;
  repeat_type: RepeatType;
  is_important: boolean;
  group_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  content: string | null;
  deadline_date: string;
  is_anonymous: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  vote: VoteValue;
  created_at: string;
  updated_at: string;
}

export interface EnrichedEvent extends FamilyEvent {
  group?: UserGroup | null;
  creator?: FamilyUser | null;
}

export interface EnrichedPoll extends Poll {
  creator?: FamilyUser | null;
  votes: PollVote[];
}

export interface AppData {
  groups: UserGroup[];
  users: FamilyUser[];
  events: FamilyEvent[];
  polls: Poll[];
  votes: PollVote[];
}

export type EventInput = Omit<FamilyEvent, 'id' | 'created_at' | 'updated_at'>;
export type PollInput = Omit<Poll, 'id' | 'created_at' | 'updated_at'>;
export type UserInput = Omit<FamilyUser, 'id' | 'created_at'>;
export type GroupInput = Omit<UserGroup, 'id' | 'created_at'>;
