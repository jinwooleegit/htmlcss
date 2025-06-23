// 진행률 표시기 기능
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
    
    if (progressText) {
        progressText.textContent = Math.round(scrolled) + '%';
    }
}

// 스크롤 이벤트 리스너
window.addEventListener('scroll', updateProgressBar);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    
    // 목차 링크 부드러운 스크롤
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 모바일 햄버거 메뉴 토글
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // 코드 복사 기능 초기화
    initializeCopyButtons();
});

// 코드 복사 기능
function initializeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.tag-code pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
        const preElement = codeBlock.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '복사';
        copyButton.setAttribute('data-index', index);
        
        // 복사 버튼을 pre 요소에 추가
        preElement.style.position = 'relative';
        preElement.appendChild(copyButton);
        
        copyButton.addEventListener('click', function() {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = '복사됨!';
                copyButton.style.background = '#28a745';
                
                setTimeout(() => {
                    copyButton.textContent = '복사';
                    copyButton.style.background = '';
                }, 2000);
            }).catch(() => {
                copyButton.textContent = '복사 실패';
                setTimeout(() => {
                    copyButton.textContent = '복사';
                }, 2000);
            });
        });
    });
}

// 현재 섹션 하이라이트 (스크롤 위치에 따라)
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.tutorial-section');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scrollPos = window.scrollY;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // 모든 링크에서 active 클래스 제거
    tocLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// 스크롤 시 현재 섹션 하이라이트
window.addEventListener('scroll', highlightCurrentSection); 