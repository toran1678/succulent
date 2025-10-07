# 아띠아 다육 홍보 웹사이트

아띠아 다육의 다육 식물 판매를 위한 반응형 홍보 웹사이트입니다.

## 📁 파일 구조

```
succulent/
├── index.html          # 메인 홈페이지
├── gallery.html        # 다육 식물 갤러리 페이지
├── css/
│   └── style.css      # 전체 스타일시트
├── js/
│   └── script.js      # JavaScript 기능
├── images/            # 이미지 폴더
└── README.md          # 프로젝트 설명
```

## ✨ 주요 기능

### 메인 페이지 (index.html)
- 🏠 인사말 및 소개
- 💡 특징 섹션 (건강한 다육, 다양한 품종, 안전한 포장)
- 📞 연락처 정보 (전화번호, 문의하기, 유튜브 채널)
- 📱 모바일 하단 네비게이션

### 갤러리 페이지 (gallery.html)
- 🔍 실시간 검색 기능
- 🌱 식물 카드 (이름, 종자, 가격)
- 📄 페이지네이션 (페이지당 9개 표시)
- 🎨 반응형 그리드 레이아웃

## 🎨 디자인 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 최적화
- **모던한 UI**: SVG 아이콘 및 그라데이션 효과
- **부드러운 애니메이션**: 스크롤 및 호버 효과
- **직관적인 네비게이션**: 하단 고정 모바일 메뉴

## 🛠️ 커스터마이징

### 식물 데이터 수정
`js/script.js` 파일의 `plantsData` 배열을 수정하세요:

```javascript
const plantsData = [
    { 
        id: 1, 
        name: '식물 이름', 
        species: '학명', 
        price: 가격, 
        image: '이미지 경로',
        icon: '아이콘명'
    },
    // ...
];
```

### 연락처 정보 수정
`index.html`에서 전화번호와 유튜브 링크를 수정하세요.

### 색상 변경
`css/style.css`의 CSS 변수를 수정하세요:

```css
:root {
    --primary-color: #2d8659;
    --secondary-color: #5fb88e;
    --accent-color: #f4a261;
}
```

## 📱 반응형 브레이크포인트

- **모바일**: ~ 480px
- **태블릿**: 481px ~ 768px
- **데스크톱**: 769px ~

## 🚀 사용 방법

1. `index.html` 파일을 브라우저에서 열기
2. 연락처 정보 수정 (전화번호, 유튜브 링크)
3. `images/` 폴더에 식물 이미지 추가
4. `js/script.js`에서 식물 데이터 업데이트

## 📞 연락처

- 전화: 010-0000-0000
- 유튜브: [@Attiasucculents](https://youtube.com/@Attiasucculents)

---

© 2025 아띠아 다육. All rights reserved.
