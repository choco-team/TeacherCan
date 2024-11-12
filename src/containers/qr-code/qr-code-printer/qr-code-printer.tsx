'use client';

import { FormEvent, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { PrinterCheckIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/dialog';
import { Button } from '@/components/button';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Label } from '@/components/label';
import { QR_CODE_PRINT_GRID_OPTIONS } from './qr-code-printer.constants';
import type { QRCode } from '../qr-code.type';

type Props = {
  qrCode: QRCode;
};

function QRCodePrinter({ qrCode }: Props) {
  const [grid, setGrid] = useState<(typeof QR_CODE_PRINT_GRID_OPTIONS)[number]>(
    QR_CODE_PRINT_GRID_OPTIONS[0],
  );

  const printRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({ contentRef: printRef });

  const handleChange =
    (gridOption: (typeof QR_CODE_PRINT_GRID_OPTIONS)[number]) => () => {
      setGrid(gridOption);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!qrCode.value}
          variant="gray-outline"
          className="flex items-center gap-x-1.5"
        >
          <PrinterCheckIcon className="size-5" />
          코드 인쇄
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>인쇄하기</DialogTitle>
          <DialogDescription>
            한 페이지에 인쇄할 QR코드 개수를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <RadioGroup className="flex items-stretch justify-evenly gap-6 pt-2 pb-6">
            {QR_CODE_PRINT_GRID_OPTIONS.map(({ row, column }) => (
              <Label
                key={`${row}*${column}`}
                className="group basis-24 flex flex-col items-center gap-y-1 p-2 outline outline-border has-[:checked]:outline-2 has-[:checked]:outline-primary rounded-md cursor-pointer"
              >
                <RadioGroupItem
                  value={`${row}*${column}`}
                  checked={row === grid.row && column === grid.column}
                  hidden
                  onClick={handleChange({ row, column })}
                />

                <div className="flex items-center gap-x-2 text-lg group-has-[:checked]:text-primary">
                  {`${row} × ${column}`}
                </div>

                <div className="flex-grow flex flex-col items-stretch gap-0.5 w-full">
                  {Array.from({ length: row }).map((_, rowIndex) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={rowIndex}
                      className="flex gap-0.5"
                    >
                      {Array.from({ length: column }).map((__, colIndex) => (
                        <span
                          // eslint-disable-next-line react/no-array-index-key
                          key={colIndex}
                          className="flex-1 aspect-square bg-gray-300 group-has-[:checked]:bg-primary-300"
                        />
                      ))}
                    </span>
                  ))}
                </div>
              </Label>
            ))}
          </RadioGroup>

          <div
            ref={printRef}
            className="hidden print:block w-screen h-screen overflow-hidden"
            style={{ margin: 0, padding: 30 }}
          >
            <div
              className="grid gap-8 w-full h-full"
              style={{
                gridTemplateRows: `repeat(${grid.row}, 1fr)`,
                gridTemplateColumns: `repeat(${grid.column}, 1fr)`,
              }}
            >
              {Array.from({ length: grid.row * grid.column }).map(
                (_, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="flex flex-col items-center gap-y-1"
                  >
                    <QRCodeSVG value={qrCode.value} className="size-5/6" />
                    <span
                      className="text-center font-semibold leading-tight"
                      style={{ fontSize: 24 / (grid.column / 2) }}
                    >
                      {qrCode.name}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <DialogFooter className="justify-self-center">
            <DialogClose asChild>
              <Button type="submit">인쇄</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodePrinter;
