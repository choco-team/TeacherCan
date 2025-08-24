'use client';

import { useState, useEffect } from 'react';

function ImageSkeleton() {
  return (
    <div className="mb-6">
      <div className="w-full h-64 bg-gray-200 rounded-sm shadow-md animate-pulse" />
      <div className="h-4 bg-gray-200 rounded mt-2 animate-pulse" />
    </div>
  );
}

export function ImageWithSkeleton({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  }, [src]);

  if (hasError) {
    return (
      <figure className="mb-6">
        <div className="w-full h-64 bg-gray-100 rounded-sm shadow-md flex items-center justify-center">
          <p className="text-gray-500">이미지를 불러올 수 없습니다</p>
        </div>
        {caption && (
          <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (isLoading) {
    return <ImageSkeleton />;
  }

  return (
    <figure className="mb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-sm shadow-md"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
