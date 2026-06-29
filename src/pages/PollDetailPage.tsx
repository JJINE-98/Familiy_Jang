import { ArrowLeft, Check, Trash2, X } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { AuthContext } from '../App';
import { pollService } from '../services/pollService';
import { userService } from '../services/userService';
import type { EnrichedPoll, FamilyUser } from '../types/database';
import { daysUntil, formatDate } from '../utils/date';

export default function PollDetailPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [poll, setPoll] = useState<EnrichedPoll | null>(null);
  const [users, setUsers] = useState<FamilyUser[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = async () => {
    if (!pollId) return;
    const [pollData, userData] = await Promise.all([pollService.getPoll(pollId), userService.getUsers()]);
    setPoll(pollData);
    setUsers(userData);
  };

  useEffect(() => {
    load();
  }, [pollId]);

  const stats = useMemo(() => {
    const votes = poll?.votes ?? [];
    return {
      yes: votes.filter((vote) => vote.vote === 'yes'),
      no: votes.filter((vote) => vote.vote === 'no'),
      mine: votes.find((vote) => vote.user_id === currentUser?.id),
      votedUserIds: new Set(votes.map((vote) => vote.user_id)),
    };
  }, [poll, currentUser]);

  if (!poll) {
    return <EmptyState title="투표를 찾을 수 없어요" description="목록으로 돌아가 다른 투표를 확인해주세요." action={<Link to="/polls"><Button>투표 목록</Button></Link>} />;
  }

  const closed = daysUntil(poll.deadline_date) < 0;
  const canManage = currentUser?.is_admin || currentUser?.id === poll.created_by;
  const votedUsers = users.filter((user) => stats.votedUserIds.has(user.id));
  const notVotedUsers = users.filter((user) => !stats.votedUserIds.has(user.id));
  const findName = (userId: string) => users.find((user) => user.id === userId)?.name ?? '알 수 없음';

  const submitVote = async (value: 'yes' | 'no') => {
    if (!currentUser || closed) return;
    await pollService.vote(poll.id, currentUser.id, value);
    await load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link to="/polls"><Button variant="ghost" icon={<ArrowLeft size={16} />}>목록</Button></Link>
        {canManage && <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setConfirmDelete(true)}>삭제</Button>}
      </div>
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{poll.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{poll.creator?.name ?? '알 수 없음'} 등록 · {formatDate(poll.deadline_date)} 마감</p>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${closed ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-700'}`}>
            {closed ? '마감됨' : '진행중'}
          </span>
        </div>
        {poll.content && <p className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{poll.content}</p>}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">찬성</p><p className="text-2xl font-extrabold">{stats.yes.length}</p></div>
          <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-bold text-rose-700">반대</p><p className="text-2xl font-extrabold">{stats.no.length}</p></div>
          <div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">참여</p><p className="text-2xl font-extrabold">{poll.votes.length}/{users.length}</p></div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-extrabold">내 선택</h2>
        {closed ? (
          <p className="text-sm font-semibold text-slate-500">마감된 투표라 선택을 변경할 수 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button variant={stats.mine?.vote === 'yes' ? 'primary' : 'secondary'} icon={<Check size={16} />} onClick={() => submitVote('yes')}>찬성</Button>
            <Button variant={stats.mine?.vote === 'no' ? 'danger' : 'secondary'} icon={<X size={16} />} onClick={() => submitVote('no')}>반대</Button>
          </div>
        )}
        {stats.mine && <p className="mt-3 text-sm font-semibold text-slate-600">현재 선택: {stats.mine.vote === 'yes' ? '찬성' : '반대'}</p>}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-extrabold">참여자</h2>
          <div className="flex flex-wrap gap-2">
            {votedUsers.map((user) => <span key={user.id} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{user.name}</span>)}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-extrabold">미참여자</h2>
          <div className="flex flex-wrap gap-2">
            {notVotedUsers.map((user) => <span key={user.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{user.name}</span>)}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-extrabold">{poll.is_anonymous ? '선택 결과' : '찬반 명단'}</h2>
        {poll.is_anonymous ? (
          <p className="text-sm text-slate-600">익명 투표라 누가 찬성/반대했는지는 숨겨집니다.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div><p className="mb-2 font-bold text-emerald-700">찬성자</p>{stats.yes.map((vote) => <p key={vote.id} className="text-sm">{findName(vote.user_id)}</p>)}</div>
            <div><p className="mb-2 font-bold text-rose-700">반대자</p>{stats.no.map((vote) => <p key={vote.id} className="text-sm">{findName(vote.user_id)}</p>)}</div>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={confirmDelete}
        title="투표를 삭제할까요?"
        message="투표와 참여 기록이 함께 삭제됩니다."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await pollService.deletePoll(poll.id);
          navigate('/polls');
        }}
      />
    </div>
  );
}
