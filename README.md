# Code & Bug Frontend

> Code & Bug는 공연·전시·스포츠 등 좌석 예매형 행사의 대규모 동시접속 트래픽을 안정적으로 처리하는 B2B SaaS 티켓팅 플랫폼의 프론트엔드 레포지토리입니다.

---

## 기술 스택

- React v19
- React Router v7
- @tanstack/react-query v5
- Tailwind v4 + Shadcn

---

## 프로젝트 구조

```sh
src/
├─ pages/        # 라우트 별 페이지 컴포넌트
├─ components/   # 재사용 가능한 UI 컴포넌트
├─ layouts/      # 공통 레이아웃 컴포넌트
├─ routes/       # 라우터 정의
├─ services/     # API 연동 및 비즈니스 로직
├─ lib/          # 유틸리티 함수 모음
└─ assets/       # 이미지 등 정적 파일
```

---

## 시작

```bash
# Node 22 이상, pnpm 10 필요
pnpm install
pnpm dev               # http://localhost:3001
```

### 빌드

```bash
pnpm build
```
