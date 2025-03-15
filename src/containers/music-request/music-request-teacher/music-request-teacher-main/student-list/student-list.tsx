import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
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

  return (
    <div className="rounded m-2 p-2">
      {students &&
        students.map((student) => <div key={nanoid()}>{student}</div>)}
    </div>
  );
}
