---
name: commit-and-push
description: >-
  Analyzes the git diff first, splits changes into conventional commits by
  feature, confirms with the user, then pushes. Use when the user asks to
  commit, push, 커밋, 푸시, 커밋하고 푸시, or to follow the project commit-and-push
  workflow.
---

# Commit and push

이 프로젝트에서 커밋하거나 푸시하라고 하면 이 스킬을 따른다. 푸시는 사용자 확인 후에만 한다.

## 사용자가 정한 규칙 (그대로 따른다)

커밋은 일단 기본 규칙을 따릅니다. feat, refactor, fix 등등.. 과 같은 규칙을 따릅니다. 커밋을 하나로만 하지 않습니다. diff를 확인하고 변경된 내용을 파악을 우선적으로 합니다. 파악된 내용을 바탕으로 기능을 나누어 각각 커밋을 진행합니다. 하나일 수도 있고 그 이상일수도 있습니다. 그건 diff에 따라 달라지죠. 이후 커밋을 모두 마무리가 되면 사용자에게 묻습니다. 이러이러한 커밋이 생성이 되었는데 이대로 진행을 할 것인지요.

그렇다고 하면 진행이되고 아니라고하면 수정할 곳을 제안을 받습니다.

모든 커밋이 진행이 되면 push를 진행합니다.

## 워크플로

다음 순서를 건너뛰지 않는다.

### 1. Diff를 먼저 파악한다

병렬로 실행한다.

- `git status`
- `git diff` (unstaged)
- `git diff --cached` (staged)
- `git log -12 --oneline` (이 저장소의 커밋 메시지 스타일)
- `git branch -vv` (추적 원격, ahead/behind)

변경된 파일·hunk를 읽고, 기능·의도 단위로 묶는다. 파일을 대충 묶지 말고 “왜 바뀌었는지”로 나눈다. 시크릿(`.env`, 자격 증명, 키)은 커밋하지 않고 사용자에게 알린다.

### 2. 기능 단위로 커밋을 나눈다

기본은 **커밋을 하나로 몰지 않는 것**이다. Diff가 한 기능이면 커밋은 하나여도 된다. 서로 다른 기능이면 커밋을 분리한다.

나누는 기준 예시:

- 서로 다른 메뉴/도메인 (예: 투표 vs 공간예약)
- 성격이 다른 작업 (`feat` vs `fix` vs `chore` vs `refactor`)
- 함께 리vert 하거나 리뷰해야 하는 단위

같은 기능의 API·상수·UI는 한 커밋에 둔다. 무관한 포맷팅·설정·스킬 파일은 분리한다.

각 커밋은 관련 파일만 `git add` 한 뒤 바로 `git commit` 한다. 한 파일에 두 기능이 섞여 있으면 `git add -p`로 hunk를 나눈다.

### 3. 커밋 메시지 규칙

이 프로젝트의 컨벤션을 따른다.

```text
<타입>: <한글 요약>

- <왜 이 변경이 필요한지 한 줄>
- <필요하면 한 줄 더>
```

타입: `feat` `fix` `docs` `style` `refactor` `test` `chore` `perf` `ci` `build` `revert`

- 제목은 명령문, 한글. 예: `feat: 공간예약 주간 그리드를 추가`
- 본문은 “무엇을”이 아니라 **왜**. 한글 명령문, 완전한 문장.
- 최근 `git log` 스타일을 맞춘다.
- 메시지는 HEREDOC으로 전달한다. `-m` 여러 개나 대화형 git(`-i`)은 쓰지 않는다.

```bash
git commit -m "$(cat <<'EOF'
feat: 투표 선택지 상한을 30개로 늘린다.

최대 선택 개수가 커져 버튼 그리드 대신 셀렉트를 쓴다.

EOF
)"
```

### 4. 커밋이 끝나면 사용자에게 확인한다

푸시하지 말고, 생성된 커밋을 보여 준 뒤 묻는다.

```markdown
다음 커밋이 생성되었습니다.

1. `<short-sha>` `<subject>`
2. `<short-sha>` `<subject>`

이대로 원격에 push할까요? 메시지, 분할, 제외할 파일이 있으면 알려주세요.
```

- **동의** → 5번으로 간다.
- **거절/수정 요청** → 푸시하지 않는다. 제안을 반영해 커밋을 고친 뒤, 다시 확인한다.

아직 푸시하지 않았고 사용자가 재분할·메시지 수정을 요청하면 `git reset --soft`로 방금 만든 커밋만 되돌린 뒤 다시 커밋한다. `git reset --hard`, `push --force`, 훅 생략(`--no-verify`)은 사용자가 분명히 요청하기 전에는 하지 않는다. `git commit --amend`는 사용자 규칙의 amend 조건을 만족할 때만 쓴다.

### 5. 확인 후에만 push 한다

```bash
git status
git push -u origin HEAD
```

이미 upstream이 있으면 `git push`만 한다. `main`/`master`에 force push하지 않는다. 푸시 후 원격 URL이나 PR이 있으면 알려 준다.

## 안전 규칙

- `git config`를 바꾸지 않는다.
- 훅을 건너뛰지 않는다.
- 빈 커밋을 만들지 않는다.
- 사용자가 커밋/푸시를 요청하지 않았으면 이 스킬로 커밋하지 않는다.
- 대화형 git 명령(`git add -i`, `git rebase -i`)은 쓰지 않는다.
- `git add -p`는 비대화형 입력을 구성할 수 있을 때만 쓴다. 불가능하면 사용자에게 파일 단위 분할을 제안한다.
