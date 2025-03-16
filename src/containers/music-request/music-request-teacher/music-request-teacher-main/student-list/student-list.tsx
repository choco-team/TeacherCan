type Props = {
  students: string[];
};

export default function StudentList({ students }: Props) {
  const hasStudent = students.length > 0;

  return (
    <div className="h-full lg:h-[calc(100vh-200px)] overflow-scroll py-4">
      {hasStudent ? (
        <div className="bg-gray-100 flex flex-col gap-[1px]">
          {students.map((student, index) => (
            <div
              className="p-2 flex gap-2 bg-white text-gray-700"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              {student}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-12 justify-center items-center">
          <div className="text-center text-sm text-gray-500">
            <span>참여한 학생이 없어요.</span>
            <br />
            <span>방 정보에서 QR코드를 통해 학생을 초대해보세요.</span>
          </div>
        </div>
      )}
    </div>
  );
}
