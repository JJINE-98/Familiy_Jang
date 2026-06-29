import { supabase } from './supabase';
import { createId, readData, timestamp, upsertById, writeData } from './mockStore';
import type { FamilyUser, GroupInput, UserGroup, UserInput } from '../types/database';

export const userService = {
  async getGroups(): Promise<UserGroup[]> {
    if (supabase) {
      const { data, error } = await supabase.from('user_groups').select('*').order('sort_order');
      if (error) throw error;
      return data ?? [];
    }
    return readData().groups.sort((a, b) => a.sort_order - b.sort_order);
  },

  async getUsers(includeInactive = false): Promise<FamilyUser[]> {
    if (supabase) {
      let query = supabase.from('users').select('*').order('name');
      if (!includeInactive) query = query.eq('active', true);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    }
    const users = readData().users;
    return includeInactive ? users : users.filter((user) => user.active);
  },

  async login(name: string, birthDate: string): Promise<FamilyUser | null> {
    const users = await this.getUsers();
    return users.find((user) => user.name === name && user.birth_date === birthDate) ?? null;
  },

  async saveGroup(input: GroupInput, groupId?: string): Promise<UserGroup> {
    if (supabase) {
      const payload = groupId ? { id: groupId, ...input } : input;
      const { data, error } = await supabase.from('user_groups').upsert(payload).select().single();
      if (error) throw error;
      return data;
    }
    const data = readData();
    const group: UserGroup = {
      id: groupId ?? createId(),
      created_at: data.groups.find((item) => item.id === groupId)?.created_at ?? timestamp(),
      ...input,
    };
    writeData({ ...data, groups: upsertById(data.groups, group) });
    return group;
  },

  async saveUser(input: UserInput, userId?: string): Promise<FamilyUser> {
    if (supabase) {
      const payload = userId ? { id: userId, ...input } : input;
      const { data, error } = await supabase.from('users').upsert(payload).select().single();
      if (error) throw error;
      return data;
    }
    const data = readData();
    const user: FamilyUser = {
      id: userId ?? createId(),
      created_at: data.users.find((item) => item.id === userId)?.created_at ?? timestamp(),
      ...input,
    };
    writeData({ ...data, users: upsertById(data.users, user) });
    return user;
  },
};
