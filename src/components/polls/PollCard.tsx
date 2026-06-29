import { Link } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import Card from '../common/Card';
import type { EnrichedPoll } from '../../types/database';
import { daysUntil, formatDate } from '../../utils/date';

export default function PollCard({ poll, totalUsers }: { poll: EnrichedPoll; totalUsers: number }) {
  const dDay = daysUntil(poll.deadline_date);
  const closed = dDay < 0;
  const yes = poll.votes.filter((vote) => vote.vote === 'yes').length;
  const no = poll.votes.filter((vote) => vote.vote === 'no').length;

  return (
    <Link to={`/polls/${poll.id}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-indigo-100">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-extrabold text-slate-900">{poll.title}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">{poll.creator?.name ?? '알 수 없음'} 등록</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${closed ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-700'}`}>
            {closed ? '마감됨' : dDay === 0 ? 'D-Day' : `D-${dDay}`}
          </span>
        </div>
        <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{poll.content || '내용 없음'}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-500"><Clock size={14} /> 기한</p>
            <p className="mt-1 font-bold">{formatDate(poll.deadline_date)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-500"><CheckCircle2 size={14} /> 참여</p>
            <p className="mt-1 font-bold">{poll.votes.length}/{totalUsers}명</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-sm font-bold">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">찬성 {yes}</span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">반대 {no}</span>
        </div>
      </Card>
    </Link>
  );
}
