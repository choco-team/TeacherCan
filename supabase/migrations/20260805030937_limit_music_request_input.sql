-- 1) 기존 위반 데이터 정리
UPDATE public.musics
SET "studentName" = left("studentName", 17) || '...'
WHERE char_length("studentName") > 20;

UPDATE public.musics
SET "studentName" = '익명'
WHERE btrim("studentName") = '';

-- 2) 입력 제약 추가
ALTER TABLE public.musics ALTER COLUMN "studentName" SET NOT NULL;

ALTER TABLE public.musics
  ADD CONSTRAINT musics_student_name_length CHECK (char_length("studentName") <= 20);

ALTER TABLE public.musics
  ADD CONSTRAINT musics_student_name_trimmed
  CHECK ("studentName" = btrim("studentName") AND "studentName" <> '');

ALTER TABLE public.musics
  ADD CONSTRAINT musics_title_length CHECK (char_length(title) <= 200);

ALTER TABLE public.musics
  ADD CONSTRAINT musics_music_id_format CHECK ("musicId" ~ '^[A-Za-z0-9_-]{11}$');