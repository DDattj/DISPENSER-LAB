# DesignProject;

DPS-main/
│
├── index.html            # [뼈대] 메인 HTML 구조 및 외부 파일 연결
│
├── css/                  # 🎨 [디자인]
│   ├── main.css          # 메인 레이아웃 (배너, 탭, 카드 그리드, 푸터 등)
│   ├── modal.css         # 모달 전용 디자인 (상세보기 모달, 작성/수정 모달)
│   └── components.css    # 재사용 부품 디자인 (버튼, 태그 칩, 뱃지, 로딩 스피너)
│
└── js/                   # ⚙️ [기능 및 연동]
    ├── config.js         # Firebase 연동 및 라이브러리(Quill, Flatpickr) 설정
    ├── ui.js             # 화면 렌더링 (갤러리, 카테고리 보드, 타임라인)
    └── app.js            # 클릭 이벤트, 모달 제어, CRUD(저장/수정/삭제) 동작
