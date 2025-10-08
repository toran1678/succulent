// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initScrollAnimations();
    initActiveNavHighlight();
    initScrollFadeAnimations(); // 스크롤 애니메이션 추가
    
    // 갤러리 페이지에서만 식물 갤러리 초기화
    if (document.getElementById('plantsGrid')) {
        initPlantsGallery();
    }
});

// ====== 식물 갤러리 시스템 ======
// 식물 데이터는 js/plants-data.js 파일에서 불러옵니다

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
        // 실시간 검색을 위한 debounce
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch();
            }, 300);
        });
        
        // 검색창 포커스 시 자동완성 표시
        searchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                showAutocomplete(this.value.toLowerCase().trim());
            }
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
    
    // 자동완성 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('autocompleteDropdown');
        const searchContainer = document.querySelector('.search-container');
        
        if (dropdown && searchContainer && !searchContainer.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
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
    
    // 자동완성 표시
    showAutocomplete(query);
    
    applyFilters();
}

/**
 * 자동완성 표시
 */
function showAutocomplete(query) {
    const dropdown = document.getElementById('autocompleteDropdown');
    
    if (!query || query.length < 1) {
        dropdown.style.display = 'none';
        return;
    }
    
    // 검색어와 일치하는 식물 찾기
    const matches = galleryState.allPlants.filter(plant => {
        return plant.name.toLowerCase().includes(query);
    }).slice(0, 5); // 최대 5개만 표시
    
    if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    // 자동완성 결과 생성
    dropdown.innerHTML = matches.map(plant => {
        // 검색어 하이라이트
        const highlightedName = plant.name.replace(
            new RegExp(`(${query})`, 'gi'),
            '<span class="autocomplete-highlight">$1</span>'
        );
        
        // 이미지 또는 아이콘 표시
        const hasImage = plant.images && plant.images.length > 0;
        const imageHTML = hasImage 
            ? `<img src="${plant.images[0]}" alt="${plant.name}" class="autocomplete-item-image">`
            : `<svg class="autocomplete-item-svg"><use href="#icon-leaf"></use></svg>`;
        
        return `
            <div class="autocomplete-item" data-plant-name="${plant.name}">
                <div class="autocomplete-item-icon ${hasImage ? 'has-image' : ''}">
                    ${imageHTML}
                </div>
                <div class="autocomplete-item-text">
                    <div class="autocomplete-item-name">${highlightedName}</div>
                    <div class="autocomplete-item-desc">${plant.description}</div>
                </div>
            </div>
        `;
    }).join('');
    
    dropdown.style.display = 'block';
    
    // 자동완성 항목 클릭 이벤트
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            const plantName = this.getAttribute('data-plant-name');
            document.getElementById('searchInput').value = plantName;
            dropdown.style.display = 'none';
            handleSearch();
        });
    });
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
    const dropdown = document.getElementById('autocompleteDropdown');
    
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    if (dropdown) {
        dropdown.style.display = 'none';
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
    // images 배열 지원 (첫 번째 이미지 또는 플레이스홀더)
    const firstImage = plant.images && plant.images.length > 0 ? plant.images[0] : '';
    const imageHTML = firstImage
        ? `<img src="${firstImage}" alt="${plant.name}" class="plant-image">`
        : `<div class="plant-image-placeholder">
                <svg class="plant-placeholder-icon">
                    <use href="#icon-leaf"></use>
                </svg>
           </div>`;
    
    // 태그 HTML 생성
    const tagsHTML = plant.tags && plant.tags.length > 0
        ? `<div class="plant-tags">
                ${plant.tags.map(tag => `<span class="plant-tag">${tag}</span>`).join('')}
           </div>`
        : '';
    
    // 재고 상태 뱃지 HTML 생성
    const stockLabels = {
        'in-stock': '판매중',
        'low-stock': '소량 남음',
        'out-of-stock': '품절',
        'coming-soon': '재입고 예정'
    };
    
    const stockHTML = plant.stock
        ? `<span class="stock-badge ${plant.stock}">${stockLabels[plant.stock] || '판매중'}</span>`
        : '';
    
    return `
        <div class="plant-card" data-plant-id="${plant.id}">
            <div class="plant-image-container">
                ${imageHTML}
                ${tagsHTML}
                ${stockHTML}
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
 * 스크롤 페이드인 애니메이션 초기화
 */
function initScrollFadeAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate');
    
    // Intersection Observer 설정
    const observerOptions = {
        threshold: 0.15, // 요소의 15%가 보이면 트리거
        rootMargin: '0px 0px -50px 0px' // 하단에서 50px 전에 트리거
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // 한 번 애니메이션되면 관찰 중지 (선택사항)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 모든 애니메이션 요소 관찰 시작
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

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

// ====== 식물 상세 모달 시스템 ======

let currentPlant = null;
let currentImageIndex = 0;

/**
 * 모달 열기
 */
function openPlantModal(plantId) {
    const plant = plantsData.find(p => p.id === plantId);
    if (!plant) return;
    
    currentPlant = plant;
    currentImageIndex = 0;
    
    const modal = document.getElementById('plantModal');
    
    // 식물 정보 업데이트
    document.getElementById('modalPlantName').textContent = plant.name;
    document.getElementById('modalPlantDescription').textContent = plant.description;
    document.getElementById('modalPlantPrice').textContent = `${plant.price.toLocaleString()}원`;
    
    // 재고 상태 표시
    const stockLabels = {
        'in-stock': '판매중',
        'low-stock': '소량 남음',
        'out-of-stock': '품절',
        'coming-soon': '재입고 예정'
    };
    document.getElementById('modalPlantStock').textContent = stockLabels[plant.stock] || '판매중';
    
    // 태그 표시
    const modalTags = document.getElementById('modalTags');
    if (plant.tags && plant.tags.length > 0) {
        modalTags.innerHTML = plant.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');
    } else {
        modalTags.innerHTML = '';
    }
    
    // 이미지 슬라이더 초기화
    initImageSlider();
    
    // 이미지 업데이트
    updateModalImage();
    
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
    
    // 모바일 네비게이션과 하단 여백 제거
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
        mobileNav.style.display = 'none';
    }
    document.body.style.paddingBottom = '0';
}

/**
 * 모달 닫기
 */
function closePlantModal() {
    const modal = document.getElementById('plantModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 복원
    
    // 모바일 네비게이션과 하단 여백 복원
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
        mobileNav.style.display = '';
    }
    document.body.style.paddingBottom = '';
    
    currentPlant = null;
    currentImageIndex = 0;
}

/**
 * 이미지 슬라이더 초기화
 */
function initImageSlider() {
    if (!currentPlant) return;
    
    const wrapper = document.getElementById('sliderImagesWrapper');
    const modalImagePlaceholder = document.getElementById('modalImagePlaceholder');
    const images = currentPlant.images || [];
    
    // 기존 이미지 제거
    wrapper.innerHTML = '';
    
    // 이미지 생성
    if (images.length > 0) {
        modalImagePlaceholder.style.display = 'none';
        images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = currentPlant.name;
            img.className = 'modal-plant-image';
            if (index === 0) {
                img.classList.add('active');
            }
            wrapper.appendChild(img);
        });
    } else {
        // 이미지가 없으면 플레이스홀더 표시
        modalImagePlaceholder.style.display = 'flex';
    }
}

/**
 * 모달 이미지 업데이트
 */
function updateModalImage() {
    if (!currentPlant) return;
    
    const modalImagePlaceholder = document.getElementById('modalImagePlaceholder');
    const images = currentPlant.images || [];
    const allImages = document.querySelectorAll('.modal-plant-image');
    const imageCounter = document.querySelector('.image-counter');
    const sliderButtons = document.querySelectorAll('.slider-btn');
    
    // 이미지가 있는 경우
    if (images.length > 0) {
        modalImagePlaceholder.style.display = 'none';
        
        // 이미지 카운터와 슬라이더 버튼 표시
        if (imageCounter) imageCounter.style.display = 'block';
        sliderButtons.forEach(btn => btn.style.display = 'flex');
        
        // 모든 이미지의 클래스 제거
        allImages.forEach((img, index) => {
            img.classList.remove('active', 'prev');
            
            if (index === currentImageIndex) {
                img.classList.add('active');
            } else if (index < currentImageIndex) {
                img.classList.add('prev');
            }
        });
        
        // 이미지 카운터 업데이트
        document.getElementById('currentImageIndex').textContent = currentImageIndex + 1;
        document.getElementById('totalImages').textContent = images.length;
    } else {
        // 플레이스홀더 표시
        modalImagePlaceholder.style.display = 'flex';
        
        // 이미지 카운터와 슬라이더 버튼 숨김
        if (imageCounter) imageCounter.style.display = 'none';
        sliderButtons.forEach(btn => btn.style.display = 'none');
    }
    
    // 슬라이더 버튼 상태 업데이트
    updateSliderButtons();
}

/**
 * 슬라이더 버튼 상태 업데이트
 */
function updateSliderButtons() {
    const images = currentPlant.images || [];
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 이미지가 1개 이하면 버튼 비활성화
    if (images.length <= 1) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }
    
    // 첫 번째 이미지에서 이전 버튼 비활성화
    prevBtn.disabled = currentImageIndex === 0;
    
    // 마지막 이미지에서 다음 버튼 비활성화
    nextBtn.disabled = currentImageIndex === images.length - 1;
}

/**
 * 이전 이미지로 이동
 */
function prevImage() {
    if (!currentPlant || currentImageIndex === 0) return;
    currentImageIndex--;
    updateModalImage();
}

/**
 * 다음 이미지로 이동
 */
function nextImage() {
    const images = currentPlant.images || [];
    if (!currentPlant || currentImageIndex === images.length - 1) return;
    currentImageIndex++;
    updateModalImage();
}

/**
 * 모달 이벤트 리스너 설정
 */
document.addEventListener('DOMContentLoaded', function() {
    // 모달 닫기 버튼
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closePlantModal);
    }
    
    // 오버레이 클릭 시 닫기
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closePlantModal);
    }
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlantModal();
        }
    });
    
    // 슬라이더 버튼
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevImage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextImage);
    }
    
    // 카드 클릭 이벤트 위임
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.plant-card');
        if (card) {
            const plantId = parseInt(card.getAttribute('data-plant-id'));
            openPlantModal(plantId);
        }
    });
});

