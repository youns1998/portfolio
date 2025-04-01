document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("nav button"); // 네비게이션 버튼
    const sections = document.querySelectorAll(".section"); // 모든 섹션
    const options = {
        root: null, // 뷰포트를 기준으로 관찰
        threshold: 0.3, // 섹션의 30%가 보이면 활성화
        rootMargin: "-50px"
    };

    let isScrolling = false;
    let currentSectionIndex = 0;
    let lastScrollTime = Date.now();
    const scrollCooldown = 1000; // 스크롤 쿨다운 시간 (밀리초)
    
    // 현재 활성화된 섹션 인덱스 찾기
    const findActiveSectionIndex = () => {
        let activeIndex = 0;
        sections.forEach((section, index) => {
            if (section.classList.contains('active')) {
                activeIndex = index;
            }
        });
        return activeIndex;
    };
    
    // 특정 섹션으로 스크롤
    const scrollToSection = (index) => {
        if (index < 0 || index >= sections.length) return;
        isScrolling = true;
        currentSectionIndex = index;
        
        sections[index].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        
        // 스크롤 후 잠시 후에 스크롤 잠금 해제
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    };

    // 네비게이션 버튼 클릭 시 부드러운 스크롤
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);
            
            // 버튼에 클릭 효과 추가
            button.classList.add("clicked");
            setTimeout(() => button.classList.remove("clicked"), 200);
            
            // 해당 섹션의 인덱스 찾기
            sections.forEach((section, idx) => {
                if (section.id === targetId) {
                    currentSectionIndex = idx;
                }
            });
            
            // 해당 섹션으로 부드럽게 스크롤
            scrollToSection(currentSectionIndex);
        });
    });

    // 섹션 활성화 시 애니메이션 효과
    const activateSection = (section) => {
        section.classList.add("active");
        const elements = section.querySelectorAll(".animate-on-scroll");
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add("visible");
            }, index * 200);
        });
    };

    // 섹션 비활성화 시 애니메이션 효과
    const deactivateSection = (section) => {
        section.classList.remove("active");
        const elements = section.querySelectorAll(".animate-on-scroll");
        elements.forEach(element => {
            element.classList.remove("visible");
        });
    };

    // Intersection Observer로 스크롤에 따라 섹션 활성화
    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                sections.forEach((section, index) => {
                    if (section === entry.target) {
                        activateSection(section);
                        currentSectionIndex = index;
                    } else {
                        deactivateSection(section);
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // 휠 이벤트를 통한 섹션 이동
    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        
        // 이미 스크롤 중이거나 쿨다운 시간이 지나지 않았으면 무시
        if (isScrolling || now - lastScrollTime < scrollCooldown) return;
        
        currentSectionIndex = findActiveSectionIndex();
        
        if (e.deltaY > 0) {
            // 아래로 스크롤
            scrollToSection(currentSectionIndex + 1);
        } else {
            // 위로 스크롤
            scrollToSection(currentSectionIndex - 1);
        }
        
        lastScrollTime = now;
    });

    // 터치 이벤트 처리 (모바일 지원)
    let touchStartY = 0;
    let touchEndY = 0;
    const touchThreshold = 50; // 터치 감지 임계값
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    window.addEventListener('touchend', (e) => {
        const now = Date.now();
        
        // 이미 스크롤 중이거나 쿨다운 시간이 지나지 않았으면 무시
        if (isScrolling || now - lastScrollTime < scrollCooldown) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const difference = touchStartY - touchEndY;
        
        currentSectionIndex = findActiveSectionIndex();
        
        if (Math.abs(difference) > touchThreshold) {
            if (difference > 0) {
                // 위에서 아래로 스와이프 (다음 섹션)
                scrollToSection(currentSectionIndex + 1);
            } else {
                // 아래에서 위로 스와이프 (이전 섹션)
                scrollToSection(currentSectionIndex - 1);
            }
            
            lastScrollTime = now;
        }
    });

    // 스크롤 진행률 표시
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // 마우스 움직임에 따른 배경 효과
    document.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty("--mouse-x", `${x}%`);
        document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    });
    
    // 섹션 번호 인디케이터 추가
    const sectionIndicator = document.createElement("div");
    sectionIndicator.className = "section-indicator";
    document.body.appendChild(sectionIndicator);
    
    sections.forEach((section, index) => {
        const dot = document.createElement("div");
        dot.className = "indicator-dot";
        dot.dataset.index = index;
        
        dot.addEventListener("click", () => {
            scrollToSection(index);
        });
        
        sectionIndicator.appendChild(dot);
    });
    
    // 페이지 로드 시 첫 번째 섹션 활성화
    activateSection(sections[0]);
    
    // 활성 섹션에 따라 인디케이터 업데이트
    const updateIndicator = () => {
        const dots = document.querySelectorAll(".indicator-dot");
        dots.forEach((dot, index) => {
            if (index === currentSectionIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    };
    
    // 스크롤 이벤트 발생 시 인디케이터 업데이트
    window.addEventListener("scroll", () => {
        if (!isScrolling) {
            updateIndicator();
        }
    });
    
    // 초기 인디케이터 상태 설정
    updateIndicator();
});
