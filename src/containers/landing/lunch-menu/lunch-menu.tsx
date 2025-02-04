'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';

function LunchMenu() {
  const [schoolName, setSchoolName] = useState('');
  const [schoolList, setSchoolList] = useState([]);
  const [mealData, setMealData] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const API_KEY = '20c508e0b2de4cc3a012ec9b61cafbbe'; // 나이스 API 키

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
      if (schoolData) {
        setSchoolList(schoolData);
        setSelectedSchool(null);
      } else {
        console.error('학교 정보를 찾을 수 없습니다.');
        setSchoolList([]);
      }
    } catch (error) {
      console.error('학교 검색 실패:', error);
      setSchoolList([]);
    }
  };

  const fetchMealData = async (
    schoolCode: string,
    eduOfficeCode: string,
    school,
  ) => {
    const today = getTodayDate();
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${eduOfficeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${today}`,
      );

      const mealInfo = response.data.mealServiceDietInfo?.[1]?.row?.[0];
      if (mealInfo) {
        setMealData(mealInfo);
        setSelectedSchool(school);
      } else {
        console.error('오늘의 식단 정보가 없습니다.');
        setMealData(null);
      }
    } catch (error) {
      console.error('식단 정보 조회 실패:', error);
      setMealData(null);
    }
  };

  const formatDate = (dateStr) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">학교 식단 조회</h1>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="학교명을 입력하세요"
        />
        <Button onClick={handleSearch}>검색</Button>
      </div>
      <div>
        {selectedSchool ? (
          <Card
            key={selectedSchool.SD_SCHUL_CODE}
            className="mb-2 cursor-pointer"
          >
            <CardContent className="p-4">
              <p className="font-semibold">{selectedSchool.SCHUL_NM}</p>
              <p className="text-sm text-gray-600">
                {selectedSchool.ORG_RDNMA || '주소 정보 없음'}
              </p>
            </CardContent>
          </Card>
        ) : (
          schoolList.map((school) => (
            <Card
              key={school.SD_SCHUL_CODE}
              className="mb-2 cursor-pointer"
              onClick={() =>
                fetchMealData(
                  school.SD_SCHUL_CODE,
                  school.ATPT_OFCDC_SC_CODE,
                  school,
                )
              }
            >
              <CardContent className="p-4">
                <p className="font-semibold">{school.SCHUL_NM}</p>
                <p className="text-sm text-gray-600">
                  {school.ORG_RDNMA || '주소 정보 없음'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {mealData && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">
              {formatDate(mealData.MLSV_YMD)} 식단표
            </h2>
            <p>{mealData.DDISH_NM.replace(/<br\/>/g, '\n')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LunchMenu;
