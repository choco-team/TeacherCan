import { useEffect, useState } from 'react';
import { firebaseDB } from '@/services/firebase';
import { onValue, ref } from 'firebase/database';
import { useMusicRequestTeacherState } from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';

export default function StudentList() {
  const { params } = useMusicRequestTeacherState();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/students`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const studentArray = Object.keys(value);
        setStudents(studentArray);
      } else {
        setStudents([]);
      }
    });
    return () => unsubscribe();
  }, [params.roomId]);

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
      ) : null}
    </div>
  );
}
