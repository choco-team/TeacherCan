// ExcelUploader.tsx

'use client';

import { Button } from '@/components/button';
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { ExcelUploaderProps, Student } from '@/types/evaluation-prepare-types';

export default function ExcelUploader({ onDataImported }: ExcelUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadByExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryString = event.target?.result as string;
        const workbook = XLSX.read(binaryString, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 엑셀 데이터를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // 데이터 형식 변환 (필요에 따라 맵핑 조정)
        const students: Student[] = jsonData.map((row) => ({
          name: row['성명'] || row['학생명'] || row['이름'] || null,
          number: row['순번'] || row['출석번호'] || row['번호'] || null,
        }));

        // 부모 컴포넌트에 데이터 전달
        onDataImported(students);
      } catch (error) {
        console.error('엑셀 파일 처리 중 오류 발생:', error);
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
      />

      <Button
        variant="gray-outline"
        className="flex items-center gap-x-1.5"
        onClick={handleUploadByExcel}
      >
        엑셀로 추가
      </Button>
    </>
  );
}
