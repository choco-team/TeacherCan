'use client';

import React, { useState } from 'react';
import TeamSetup from './team-setup/team-setup';
import TeamResult from './team-result/team-result';

export default function RandomTeamContainer() {
  const [students, setStudents] = useState<string[]>([]);
  const [groupCount, setGroupCount] = useState<number | null>(null);

  const handleProceed = (payload: {
    students: string[];
    groupCount: number;
  }) => {
    setStudents(payload.students);
    setGroupCount(payload.groupCount);
  };

  return (
    <div>
      <TeamSetup onProceed={handleProceed} />
      {students.length > 0 && groupCount && (
        <TeamResult students={students} groupCount={groupCount} />
      )}
    </div>
  );
}
