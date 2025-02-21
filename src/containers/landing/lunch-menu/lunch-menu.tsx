'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import useLocalStorage from '@/hooks/useLocalStorage';

function SchoolLunchMenu() {
  const [schoolName, setSchoolName] = useState('');
  const [schoolList, setSchoolList] = useState([]);
  const [mealData, setMealData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useLocalStorage<{
    SD_SCHUL_CODE: string; // 학교 코드
    ATPT_OFCDC_SC_CODE: string; // 교육청 코드
    SCHUL_NM: string; // 학교명
    ORG_RDNMA?: string; // 주소 (없을 수도 있으므로 optional)
  } | null>('selectedSchool', null);

  const API_KEY = process.env.NEXT_PUBLIC_NICE_API_KEY; // 나이스 API 키

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${date}`;
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${schoolName}`,
      );
      const schoolData = response.data.schoolInfo?.[1]?.row;
      setSchoolList(schoolData || []);
    } catch (error) {
      setSchoolList([]);
    }
  };

  const fetchMealData = async (school: {
    SD_SCHUL_CODE: string;
    ATPT_OFCDC_SC_CODE: string;
    SCHUL_NM: string;
    ORG_RDNMA?: string;
  }) => {
    const today = getTodayDate();
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&MLSV_YMD=${today}`,
      );

      const mealInfo = response.data.mealServiceDietInfo?.[1]?.row?.[0];
      setMealData(mealInfo || { MLSV_YMD: today, DDISH_NM: null });
      setSelectedSchool(school);
      setSchoolName('');
      setSchoolList([]);
    } catch (error) {
      setMealData({ MLSV_YMD: today, DDISH_NM: null });
    }
  };

  useEffect(() => {
    if (selectedSchool) {
      fetchMealData(selectedSchool);
    }
  }, [selectedSchool]);

  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">학교 식단 조회</h1>
      <div className="flex gap-2 mb-4">
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="학교명을 입력하세요"
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>
      <div>
        {schoolList.length > 0 &&
          schoolList.map((school) => (
            <Card
              key={school.SD_SCHUL_CODE}
              className="mb-2 cursor-pointer"
              onClick={() => fetchMealData(school)}
            >
              <CardContent className="p-4">
                <p className="font-semibold">{school.SCHUL_NM}</p>
                <p className="text-sm text-gray-600">
                  {school.ORG_RDNMA || '주소 정보 없음'}
                </p>
              </CardContent>
            </Card>
          ))}

        {schoolList.length === 0 && selectedSchool && (
          <Card key={selectedSchool.SD_SCHUL_CODE} className="mb-2">
            <CardContent className="p-4">
              <p className="font-semibold">{selectedSchool.SCHUL_NM}</p>
              <p className="text-sm text-gray-600">
                {selectedSchool.ORG_RDNMA || '주소 정보 없음'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {mealData && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">
              {formatDate(mealData.MLSV_YMD)} 식단표
            </h2>
            <p>
              {mealData.DDISH_NM
                ? mealData.DDISH_NM.replace(/<br\/>/g, '\n')
                : '식단 정보를 찾을 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SchoolLunchMenu;
