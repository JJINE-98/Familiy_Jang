import { supabase } from './supabase';
import { createId, readData, timestamp, upsertById, writeData } from './mockStore';
import type { EnrichedEvent, EventInput, FamilyEvent, FamilyUser, UserGroup } from '../types/database';

const attachEventRelations = (
  events: FamilyEvent[],
  users: FamilyUser[],
  groups: UserGroup[],
): EnrichedEvent[] =>
  events.map((event) => ({
    ...event,
    creator: users.find((user) => user.id === event.created_by) ?? null,
    group: groups.find((group) => group.id === event.group_id) ?? null,
  }));

export const eventService = {
  async getEvents(): Promise<EnrichedEvent[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('events')
        .select('*, creator:users(*), group:user_groups(*)')
        .order('start_date');
      if (error) throw error;
      return data ?? [];
    }
    const data = readData();
    return attachEventRelations(data.events, data.users, data.groups);
  },

  async saveEvent(input: EventInput, eventId?: string): Promise<FamilyEvent> {
    if (supabase) {
      const payload = eventId ? { id: eventId, updated_at: new Date().toISOString(), ...input } : input;
      const { data, error } = await supabase.from('events').upsert(payload).select().single();
      if (error) throw error;
      return data;
    }
    const data = readData();
    const event: FamilyEvent = {
      id: eventId ?? createId(),
      created_at: data.events.find((item) => item.id === eventId)?.created_at ?? timestamp(),
      updated_at: timestamp(),
      ...input,
    };
    writeData({ ...data, events: upsertById(data.events, event) });
    return event;
  },

  async deleteEvent(eventId: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
      return;
    }
    const data = readData();
    writeData({ ...data, events: data.events.filter((event) => event.id !== eventId) });
  },
};
