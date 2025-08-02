'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heading2 } from '@/components/heading';
import { Badge } from '@/components/badge';
import { Announcement } from '../announcement-list.types';

type Props = Announcement;

export default function AnnouncementItem({
  id,
  title,
  date,
  coverImageUrl,
  tags,
  summary,
}: Props) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link key={id} href={`/announcement/${id}`}>
      <div className="relative w-full aspect-video rounded-sm">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-sm" />
        )}
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className={`object-cover rounded-sm transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
          />
        )}
      </div>
      <div className="mt-4 flex flex-col gap-y-2 justify-between">
        <Heading2>{title}</Heading2>
        <div className="text-text-title line-clamp-2">{summary}</div>
        <div className="flex gap-x-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="gray" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {format(new Date(date), 'yy년 MMM dd일 iiii', {
            locale: ko,
          })}
        </p>
      </div>
    </Link>
  );
}
