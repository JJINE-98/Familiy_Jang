import { supabase } from './supabase';
import { createId, readData, timestamp, upsertById, upsertVote, writeData } from './mockStore';
import type { EnrichedPoll, Poll, PollInput, PollVote, VoteValue } from '../types/database';

export const pollService = {
  async getPolls(): Promise<EnrichedPoll[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('polls')
        .select('*, creator:users(*), votes:poll_votes(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
    const data = readData();
    return data.polls.map((poll) => ({
      ...poll,
      creator: data.users.find((user) => user.id === poll.created_by) ?? null,
      votes: data.votes.filter((vote) => vote.poll_id === poll.id),
    }));
  },

  async getPoll(pollId: string): Promise<EnrichedPoll | null> {
    const polls = await this.getPolls();
    return polls.find((poll) => poll.id === pollId) ?? null;
  },

  async savePoll(input: PollInput, pollId?: string): Promise<Poll> {
    if (supabase) {
      const payload = pollId ? { id: pollId, updated_at: new Date().toISOString(), ...input } : input;
      const { data, error } = await supabase.from('polls').upsert(payload).select().single();
      if (error) throw error;
      return data;
    }
    const data = readData();
    const poll: Poll = {
      id: pollId ?? createId(),
      created_at: data.polls.find((item) => item.id === pollId)?.created_at ?? timestamp(),
      updated_at: timestamp(),
      ...input,
    };
    writeData({ ...data, polls: upsertById(data.polls, poll) });
    return poll;
  },

  async deletePoll(pollId: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('polls').delete().eq('id', pollId);
      if (error) throw error;
      return;
    }
    const data = readData();
    writeData({
      ...data,
      polls: data.polls.filter((poll) => poll.id !== pollId),
      votes: data.votes.filter((vote) => vote.poll_id !== pollId),
    });
  },

  async vote(pollId: string, userId: string, value: VoteValue): Promise<PollVote> {
    if (supabase) {
      const { data, error } = await supabase
        .from('poll_votes')
        .upsert({ poll_id: pollId, user_id: userId, vote: value, updated_at: new Date().toISOString() }, { onConflict: 'poll_id,user_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const data = readData();
    const existing = data.votes.find((vote) => vote.poll_id === pollId && vote.user_id === userId);
    const vote: PollVote = {
      id: existing?.id ?? createId(),
      poll_id: pollId,
      user_id: userId,
      vote: value,
      created_at: existing?.created_at ?? timestamp(),
      updated_at: timestamp(),
    };
    writeData({ ...data, votes: upsertVote(data.votes, vote) });
    return vote;
  },
};
