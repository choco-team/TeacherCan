'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Building2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Skeleton } from '@/components/skeleton';
import { SPACE_RESERVATION_WEEKDAY_LABEL } from '@/constants/space-reservation';
import {
  getMemberships,
  getMyWeekReservations,
} from '@/lib/space-reservation-repository';
import { MyWeekReservationItem } from '@/types/space-reservation';

type Props = {
  title?: string;
  hideWhenNoMembership?: boolean;
};

export default function SpaceReservationWeekSummary({
  title = '이번 주 내 예약',
  hideWhenNoMembership = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [items, setItems] = useState<MyWeekReservationItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const memberships = getMemberships();
        setHasMembership(memberships.length > 0);
        if (memberships.length === 0) {
          setItems([]);
          return;
        }
        const nextItems = await getMyWeekReservations(0);
        setItems(nextItems);
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  if (hideWhenNoMembership && !hasMembership) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2Icon size={16} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2Icon size={16} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-subtitle">
            이번 주에 잡아 둔 예약이 없어요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2Icon size={16} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/space-reservation/rooms/${item.roomId}`}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-text-title">
                {item.roomName}
              </span>
              <span className="text-xs text-text-subtitle">
                {SPACE_RESERVATION_WEEKDAY_LABEL[item.weekday]}요일{' '}
                {item.period}
                교시
                {item.purpose ? ` · ${item.purpose}` : ''}
              </span>
            </div>
            <span className="text-xs text-text-subtitle">
              {item.dateKey.slice(5).replace('-', '/')}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
