import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import PollCard from '../components/polls/PollCard';
import PollForm from '../components/polls/PollForm';
import { pollService } from '../services/pollService';
import { userService } from '../services/userService';
import type { EnrichedPoll, FamilyUser, PollInput } from '../types/database';

export default function PollListPage() {
  const [polls, setPolls] = useState<EnrichedPoll[]>([]);
  const [users, setUsers] = useState<FamilyUser[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [pollData, userData] = await Promise.all([pollService.getPolls(), userService.getUsers()]);
    setPolls(pollData);
    setUsers(userData);
  };

  useEffect(() => {
    load();
  }, []);

  const savePoll = async (input: PollInput) => {
    await pollService.savePoll(input);
    setOpen(false);
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">가족 투표</h1>
          <p className="mt-1 text-sm text-slate-500">날짜, 장소, 준비물을 가볍게 정해보세요.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>투표 등록</Button>
      </div>
      {polls.length === 0 ? (
        <EmptyState title="아직 투표가 없어요" description="첫 투표를 만들어 가족 의견을 모아보세요." action={<Button onClick={() => setOpen(true)}>투표 등록</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {polls.map((poll) => <PollCard key={poll.id} poll={poll} totalUsers={users.length} />)}
        </div>
      )}
      <Modal title="투표 등록" isOpen={open} onClose={() => setOpen(false)}>
        <PollForm onCancel={() => setOpen(false)} onSave={savePoll} />
      </Modal>
    </div>
  );
}
