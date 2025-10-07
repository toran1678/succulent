// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initScrollAnimations();
    initActiveNavHighlight();
});

/**
 * 모바일 네비게이션 버튼 클릭 이벤트 초기화
 */
function initMobileNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
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

