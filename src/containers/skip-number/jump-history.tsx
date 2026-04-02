'use client';

import React from 'react';

import type { Jump } from './types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';

interface JumpHistoryProps {
  jumps: Jump[];
  startNumber: number;
}

export function JumpHistory({ jumps, startNumber }: JumpHistoryProps) {
  return (
    <Card className="shadow-lg border-2 border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary">📝 뛰어세기 결과</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-wrap items-center gap-2 text-2xl font-bold"
          style={{ fontFamily: "'Jua', sans-serif" }}
        >
          <span
            className="px-3 py-1 rounded-xl bg-accent text-accent-foreground"
            key="start"
          >
            {startNumber}
          </span>

          {jumps.map((jump) => (
            <React.Fragment key={jump.index}>
              <span className="text-muted-foreground text-lg">→</span>
              <span
                className="px-3 py-1 rounded-xl bg-primary/10 text-primary"
                key={`val-${jump.index}`}
              >
                {jump.to}
              </span>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
