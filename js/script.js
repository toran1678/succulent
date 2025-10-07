// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initScrollAnimations();
    initActiveNavHighlight();
    
    // 갤러리 페이지에서만 식물 갤러리 초기화
    if (document.getElementById('plantsGrid')) {
        initPlantsGallery();
    }
});

// ====== 식물 갤러리 시스템 ======

// 식물 데이터 (실제로는 서버나 별도 파일에서 가져올 수 있습니다)
const plantsData = [
    { id: 1, name: '에케베리아 라울', description: '벨벳처럼 부드러운 분홍빛 잎', price: 15000, image: 'images/image.png', icon: 'leaf', tags: ['인기', '추천'] },
    { id: 2, name: '하월시아 쿠페리', description: '투명한 창문 같은 잎이 매력적', price: 12000, image: '', icon: 'leaf', tags: ['추천'] },
    { id: 3, name: '세덤 모르가니아눔', description: '늘어지는 줄기가 아름다운 다육이', price: 8000, image: '', icon: 'leaf', tags: [] },
    { id: 4, name: '크라슐라 오바타', description: '행운을 가져다주는 염전나무', price: 10000, image: '', icon: 'leaf', tags: ['인기'] },
    { id: 5, name: '알로에 베라', description: '건강에 좋은 다육식물', price: 9000, image: '', icon: 'leaf', tags: [] },
    { id: 6, name: '그라프토페탈룸', description: '연한 보라빛이 매력적인 다육이', price: 11000, image: '', icon: 'leaf', tags: [] },
    { id: 7, name: '에케베리아 퍼플딜라이트', description: '진한 보라색 장미 모양 다육이', price: 18000, image: '', icon: 'leaf', tags: ['인기', '추천'] },
    { id: 8, name: '세덤 루브로틴크툼', description: '젤리빈처럼 통통한 잎', price: 7000, image: '', icon: 'leaf', tags: [] },
    { id: 9, name: '하월시아 옵투사', description: '물방울 같은 통통한 잎', price: 13000, image: '', icon: 'leaf', tags: ['추천'] },
    { id: 10, name: '크라슐라 페레그리나', description: '쌓인 동전처럼 독특한 모양', price: 9500, image: '', icon: 'leaf', tags: [] },
    { id: 11, name: '에케베리아 블랙프린스', description: '검은 장미 같은 고급스러운 다육이', price: 16000, image: '', icon: 'leaf', tags: ['인기'] },
    { id: 12, name: '세덤 버리토', description: '부리또처럼 통통한 잎이 귀여운', price: 8500, image: '', icon: 'leaf', tags: [] },
    { id: 13, name: '그라프토베리아', description: '파스텔톤의 로제트형 다육이', price: 14000, image: '', icon: 'leaf', tags: ['추천'] },
    { id: 14, name: '하월시아 리미폴리아', description: '독특한 무늬가 있는 하월시아', price: 11500, image: '', icon: 'leaf', tags: [] },
    { id: 15, name: '알로에 노비리스', description: '작고 귀여운 알로에', price: 10500, image: '', icon: 'leaf', tags: [] },
];

// 갤러리 상태 관리
let galleryState = {
    allPlants: plantsData,
    filteredPlants: plantsData,
    currentPage: 1,
    itemsPerPage: getItemsPerPage(),
    searchQuery: '',
    activeFilter: 'all'
};

/**
 * 화면 크기에 따라 페이지당 항목 수 결정
 */
function getItemsPerPage() {
    // 768px 이하는 모바일/태블릿으로 간주
    if (window.innerWidth <= 768) {
        return 10; // 2열 x 5행
    } else {
        return 9; // 3열 x 3행
    }
}

/**
 * 식물 갤러리 초기화
 */
function initPlantsGallery() {
    // 검색 기능 초기화
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        
        // 실시간 검색을 위한 debounce
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch();
            }, 300);
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
    
    // 필터 버튼 초기화
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            handleFilter(filter);
            
            // 활성 버튼 표시
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 화면 크기 변경 시 페이지당 항목 수 업데이트
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newItemsPerPage = getItemsPerPage();
            if (galleryState.itemsPerPage !== newItemsPerPage) {
                galleryState.itemsPerPage = newItemsPerPage;
                galleryState.currentPage = 1; // 첫 페이지로 리셋
                renderPlants();
            }
        }, 300);
    });
    
    // 초기 식물 표시
    renderPlants();
}

/**
 * 검색 처리
 */
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const query = searchInput.value.toLowerCase().trim();
    
    galleryState.searchQuery = query;
    galleryState.currentPage = 1;
    
    // Clear 버튼 표시/숨김
    if (clearButton) {
        clearButton.style.display = query ? 'flex' : 'none';
    }
    
    applyFilters();
}

/**
 * 필터 처리
 */
function handleFilter(filter) {
    galleryState.activeFilter = filter;
    galleryState.currentPage = 1; // 첫 페이지로 리셋
    applyFilters();
}

/**
 * 검색어와 필터를 모두 적용
 */
function applyFilters() {
    let filtered = galleryState.allPlants;
    
    // 검색어 필터링
    if (galleryState.searchQuery) {
        filtered = filtered.filter(plant => {
            return plant.name.toLowerCase().includes(galleryState.searchQuery) ||
                   (plant.description && plant.description.toLowerCase().includes(galleryState.searchQuery));
        });
    }
    
    // 태그 필터링
    if (galleryState.activeFilter !== 'all') {
        filtered = filtered.filter(plant => {
            return plant.tags && plant.tags.includes(galleryState.activeFilter);
        });
    }
    
    galleryState.filteredPlants = filtered;
    renderPlants();
}

/**
 * 검색 초기화
 */
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    galleryState.searchQuery = '';
    galleryState.currentPage = 1;
    
    applyFilters();
}

/**
 * 식물 카드 렌더링
 */
function renderPlants() {
    const plantsGrid = document.getElementById('plantsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!plantsGrid) return;
    
    // 화면 크기에 따라 itemsPerPage 업데이트
    galleryState.itemsPerPage = getItemsPerPage();
    
    const { filteredPlants, currentPage, itemsPerPage } = galleryState;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const plantsToShow = filteredPlants.slice(startIndex, endIndex);
    
    // 디버깅용 로그
    console.log('렌더링 정보:', {
        화면너비: window.innerWidth,
        itemsPerPage: itemsPerPage,
        표시할식물수: plantsToShow.length,
        시작인덱스: startIndex,
        끝인덱스: endIndex
    });
    
    // 결과 카운트 업데이트
    if (resultsCount) {
        if (galleryState.searchQuery) {
            resultsCount.textContent = `검색 결과: ${filteredPlants.length}개의 식물`;
        } else {
            resultsCount.textContent = `총 ${filteredPlants.length}개의 식물`;
        }
    }
    
    // 결과가 없는 경우
    if (plantsToShow.length === 0) {
        plantsGrid.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
        renderPagination();
        return;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // 식물 카드 생성
    plantsGrid.innerHTML = plantsToShow.map(plant => createPlantCard(plant)).join('');
    
    // 페이지네이션 렌더링
    renderPagination();
    
    // 카드 애니메이션
    animatePlantCards();
}

/**
 * 식물 카드 HTML 생성
 */
function createPlantCard(plant) {
    const imageHTML = plant.image 
        ? `<img src="${plant.image}" alt="${plant.name}" class="plant-image">`
        : `<div class="plant-image-placeholder">
                <svg class="plant-placeholder-icon">
                    <use href="#icon-${plant.icon}"></use>
                </svg>
           </div>`;
    
    // 태그 HTML 생성
    const tagsHTML = plant.tags && plant.tags.length > 0
        ? `<div class="plant-tags">
                ${plant.tags.map(tag => `<span class="plant-tag">${tag}</span>`).join('')}
           </div>`
        : '';
    
    return `
        <div class="plant-card" data-plant-id="${plant.id}">
            <div class="plant-image-container">
                ${imageHTML}
                ${tagsHTML}
            </div>
            <div class="plant-info">
                <h3 class="plant-name">${plant.name}</h3>
                <p class="plant-description">${plant.description}</p>
                <div class="plant-price">
                    ${plant.price.toLocaleString()}원
                </div>
            </div>
        </div>
    `;
}

/**
 * 페이지네이션 렌더링
 */
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const { filteredPlants, currentPage, itemsPerPage } = galleryState;
    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 이전 버튼
    paginationHTML += `
        <button class="pagination-button" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
    `;
    
    // 페이지 번호
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-button" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-button ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="pagination-button" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // 다음 버튼
    paginationHTML += `
        <button class="pagination-button" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

/**
 * 페이지 이동
 */
function goToPage(pageNumber) {
    const { filteredPlants, itemsPerPage } = galleryState;
    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
    
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    galleryState.currentPage = pageNumber;
    renderPlants();
    
    // 갤러리 섹션으로 부드럽게 스크롤
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * 식물 카드 애니메이션
 */
function animatePlantCards() {
    const cards = document.querySelectorAll('.plant-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * 모바일 네비게이션 버튼 클릭 이벤트 초기화
 */
function initMobileNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        // a 태그가 아닌 button 태그만 클릭 이벤트 추가
        if (button.tagName === 'BUTTON') {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // 부드러운 스크롤로 해당 섹션으로 이동
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 활성 버튼 표시
                    updateActiveButton(this);
                }
            });
        }
    });
}

/**
 * 활성 네비게이션 버튼 업데이트
 */
function updateActiveButton(activeButton) {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    activeButton.classList.add('active');
}

/**
 * 스크롤 위치에 따라 네비게이션 버튼 하이라이트
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('.section, header');
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Intersection Observer 설정
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                navButtons.forEach(button => {
                    if (button.getAttribute('data-target') === sectionId) {
                        updateActiveButton(button);
                    }
                });
            }
        });
    }, observerOptions);
    
    // 모든 섹션 관찰
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 스크롤 애니메이션 초기화
 */
function initScrollAnimations() {
    const animateOnScrollElements = document.querySelectorAll(
        '.feature-item, .gallery-item, .contact-item'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 전화번호 클릭 이벤트 (선택사항)
 */
const phoneLink = document.querySelector('.contact-link[href^="tel:"]');
if (phoneLink) {
    phoneLink.addEventListener('click', function(e) {
        // 모바일이 아닌 경우 알림 표시
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            e.preventDefault();
            const phoneNumber = this.textContent;
            alert(`전화번호: ${phoneNumber}\n\n모바일 기기에서는 바로 전화 연결이 가능합니다.`);
        }
    });
}

/**
 * CTA 버튼 클릭 추적 (선택사항)
 */
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function() {
        console.log('CTA 버튼 클릭됨 - 갤러리로 이동');
    });
}

/**
 * 스크롤 시 헤더 그림자 효과 (선택사항)
 */
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileNav) {
        if (scrollTop > lastScrollTop) {
            // 스크롤 다운
            mobileNav.style.transform = 'translateY(100%)';
        } else {
            // 스크롤 업
            mobileNav.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

/**
 * 터치 제스처 지원 개선
 */
if ('ontouchstart' in window) {
    document.querySelectorAll('.nav-button, .cta-button, .gallery-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// 페이지 로드 완료 애니메이션
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

/**
 * 반응형 네비게이션 바 자동 숨김/표시 개선
 */
let scrollTimeout;
window.addEventListener('scroll', function() {
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileNav) {
        clearTimeout(scrollTimeout);
        mobileNav.style.transition = 'transform 0.3s ease';
        
        scrollTimeout = setTimeout(() => {
            mobileNav.style.transform = 'translateY(0)';
        }, 150);
    }
});

