import { AlertCircle, CalendarCheck, Clock3, Star } from 'lucide-react';
import Card from '../common/Card';

interface SummaryCardsProps {
  importantCount: number;
  todayCount: number;
  weekCount: number;
  urgentPollCount: number;
}

export default function SummaryCards({ importantCount, todayCount, weekCount, urgentPollCount }: SummaryCardsProps) {
  const cards = [
    { label: '다가오는 중요 일정', value: importantCount, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '오늘 일정', value: todayCount, icon: CalendarCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: '이번 주 일정', value: weekCount, icon: Clock3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '마감 임박 미참여 투표', value: urgentPollCount, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="flex items-center gap-4 p-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
            <card.icon size={21} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
