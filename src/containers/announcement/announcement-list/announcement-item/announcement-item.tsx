'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  id: string;
  title: string;
  date: string;
  coverImageUrl: string;
};

export default function AnnouncementNoteItem({
  id,
  title,
  date,
  coverImageUrl,
}: Props) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link key={id} href={`/announcement/${id}`}>
      <div className="relative w-full aspect-video rounded-sm">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm" />
        )}
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className={`object-cover rounded-sm transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <div className="mt-2 flex justify-between">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          {format(new Date(date), 'yy년 MMM dd일 iiii', {
            locale: ko,
          })}
        </p>
      </div>
    </Link>
  );
}
