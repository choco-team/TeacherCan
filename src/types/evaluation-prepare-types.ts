export interface ExcelUploaderProps {
  onDataImported: (data: Student[]) => void;
}

// 인터페이스 정의 - 디자인 패턴에 따라 옮겨야 함.
export interface Student {
  name: string | null;
  number: number | null;
}
