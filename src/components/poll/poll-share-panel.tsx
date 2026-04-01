'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Link, Copy, Check, QrCode } from 'lucide-react';
import { Poll } from '@/types/quickpoll';

interface PollSharePanelProps {
  poll: Poll;
  isAdmin?: boolean;
}

export default function PollSharePanel({ poll, isAdmin }: PollSharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const voteUrl = `${baseUrl}/quickpoll?id=${poll.id}`;
  const adminUrl = `${baseUrl}/quickpoll?id=${poll.id}&secret=${poll.secretToken}`;

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">공유</h3>
      </div>

      {/* 참가자 링크 */}
      <div className="space-y-2">
        <p className="text-sm font-medium">참가자 투표 링크</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={voteUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm border rounded-lg bg-muted text-muted-foreground"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyLink(voteUrl)}
            className="gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? '복사됨' : '복사'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowQR(!showQR)}
            className="gap-2"
          >
            <QrCode className="w-4 h-4" />
            QR
          </Button>
        </div>
      </div>

      {/* QR 코드 */}
      {showQR && (
        <div className="flex justify-center p-4 bg-muted rounded-lg">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={voteUrl} size={160} level="M" />
          </div>
        </div>
      )}

      {/* 관리자 링크 */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t space-y-2">
          <p className="text-sm font-medium">관리자 링크</p>
          <p className="text-xs text-muted-foreground">
            이 링크로는 투표 관리 화면에 접근할 수 있습니다
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={adminUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-lg bg-muted text-muted-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyLink(adminUrl)}
              className="gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? '복사됨' : '복사'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
