document.addEventListener("DOMContentLoaded", () => {
    // 초기화: 항상 첫 번째 섹션으로 이동
    window.scrollTo(0, 0);
    
    const sections = document.querySelectorAll(".section");
    let currentSectionIndex = 0;
    let isScrolling = false;
    const scrollCooldown = 800;

    // 초기 섹션 설정
    function initSections() {
        sections.forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
                section.style.zIndex = 2;
            } else {
                section.classList.add('inactive');
                section.style.zIndex = 1;
            }
        });
    }

    // 섹션 전환 함수
    const scrollToSection = (index) => {
        if (isScrolling || index < 0 || index >= sections.length) return;
        
        isScrolling = true;
        currentSectionIndex = index;
        
        sections.forEach((section, idx) => {
            if (idx === index) {
                section.style.zIndex = 2;
                section.classList.add('active');
                section.classList.remove('inactive');
            } else {
                section.style.zIndex = 1;
                section.classList.remove('active');
                section.classList.add('inactive');
            }
        });

        sections[index].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    };

    // 휠 이벤트 처리
    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            scrollToSection(currentSectionIndex + 1);
        } else {
            scrollToSection(currentSectionIndex - 1);
        }
    }, { passive: true });

    // 해시 변경 감지
    window.addEventListener('hashchange', () => {
        const targetId = window.location.hash.substring(1);
        const targetIndex = Array.from(sections).findIndex(sec => sec.id === targetId);
        if (targetIndex !== -1) {
            scrollToSection(targetIndex);
        }
    });

    // 초기 실행
    initSections();
    
    // URL에 해시가 있으면 해당 섹션으로 이동 (새로고침 시 무시)
    if (!performance.navigation.type === 1 && window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetIndex = Array.from(sections).findIndex(sec => sec.id === targetId);
        if (targetIndex !== -1) {
            scrollToSection(targetIndex);
        }
    }
});