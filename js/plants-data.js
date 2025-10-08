// 식물 데이터
// stock: 'in-stock'(판매중), 'low-stock'(소량 남음), 'out-of-stock'(품절), 'coming-soon'(재입고 예정)
// images: 배열로 여러 이미지 지원 (빈 배열일 경우 기본 아이콘 표시)

const plantsData = [
    { 
        id: 1, 
        name: '에케베리아 라울', 
        description: '벨벳처럼 부드러운 분홍빛 잎', 
        price: 15000, 
        images: ['images/plants/image.png', 'images/plants/image2.png'], // 여러 이미지 추가 가능
        tags: ['인기', '추천'], 
        stock: 'in-stock' 
    },
    { 
        id: 2, 
        name: '하월시아 쿠페리', 
        description: '투명한 창문 같은 잎이 매력적', 
        price: 12000, 
        images: [], 
        tags: ['추천'], 
        stock: 'low-stock' 
    },
    { 
        id: 3, 
        name: '세덤 모르가니아눔', 
        description: '늘어지는 줄기가 아름다운 다육이', 
        price: 8000, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 4, 
        name: '크라슐라 오바타', 
        description: '행운을 가져다주는 염전나무', 
        price: 10000, 
        images: [], 
        tags: ['인기'], 
        stock: 'out-of-stock' 
    },
    { 
        id: 5, 
        name: '알로에 베라', 
        description: '건강에 좋은 다육식물', 
        price: 9000, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 6, 
        name: '그라프토페탈룸', 
        description: '연한 보라빛이 매력적인 다육이', 
        price: 11000, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 7, 
        name: '에케베리아 퍼플딜라이트', 
        description: '진한 보라색 장미 모양 다육이', 
        price: 18000, 
        images: [], 
        tags: ['인기', '추천'], 
        stock: 'low-stock' 
    },
    { 
        id: 8, 
        name: '세덤 루브로틴크툼', 
        description: '젤리빈처럼 통통한 잎', 
        price: 7000, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 9, 
        name: '하월시아 옵투사', 
        description: '물방울 같은 통통한 잎', 
        price: 13000, 
        images: [], 
        tags: ['추천'], 
        stock: 'in-stock' 
    },
    { 
        id: 10, 
        name: '크라슐라 페레그리나', 
        description: '쌓인 동전처럼 독특한 모양', 
        price: 9500, 
        images: [], 
        tags: [], 
        stock: 'coming-soon' 
    },
    { 
        id: 11, 
        name: '에케베리아 블랙프린스', 
        description: '검은 장미 같은 고급스러운 다육이', 
        price: 16000, 
        images: [], 
        tags: ['인기'], 
        stock: 'in-stock' 
    },
    { 
        id: 12, 
        name: '세덤 버리토', 
        description: '부리또처럼 통통한 잎이 귀여운', 
        price: 8500, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 13, 
        name: '그라프토베리아', 
        description: '파스텔톤의 로제트형 다육이', 
        price: 14000, 
        images: [], 
        tags: ['추천'], 
        stock: 'low-stock' 
    },
    { 
        id: 14, 
        name: '하월시아 리미폴리아', 
        description: '독특한 무늬가 있는 하월시아', 
        price: 11500, 
        images: [], 
        tags: [], 
        stock: 'in-stock' 
    },
    { 
        id: 15, 
        name: '알로에 노비리스', 
        description: '작고 귀여운 알로에', 
        price: 10500, 
        images: [], 
        tags: [], 
        stock: 'out-of-stock' 
    },
];

