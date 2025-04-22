document.addEventListener("DOMContentLoaded", () => {
    // 섹션 준비 함수 수정 (사전 로드 대신 가벼운 초기화)
    initSections();
    
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
    const scrollCooldown = 800; // 스크롤 쿨다운 시간 감소 (밀리초)
    
    // 섹션 초기화 함수 (더 가벼운 접근 방식으로 수정)
    function initSections() {
        // 첫 번째 섹션을 활성화하고 나머지는 비활성화
        document.querySelectorAll('.section').forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
                section.style.zIndex = 2;
                section.style.opacity = 1;
            } else {
                section.classList.add('inactive');
                section.style.zIndex = 1;
            }
        });
    }
    
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
    
    // 섹션 전환 그라데이션 오버레이 생성
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'section-transition-overlay';
    document.body.appendChild(transitionOverlay);

    // 특정 섹션으로 스크롤 (수정된 버전)
    const scrollToSection = (index) => {
        if (typeof index === 'string') {
            // ID로 섹션을 찾아 인덱스로 변환
            const targetSection = document.getElementById(index);
            if (targetSection) {
                index = Array.from(sections).indexOf(targetSection);
            } else {
                return; // 섹션을 찾을 수 없으면 중단
            }
        }
        
        if (index < 0 || index >= sections.length) return;
        isScrolling = true;
        currentSectionIndex = index;
        
        // 불필요한 애니메이션 제거
        document.body.classList.add('is-changing');
        
        // 전환 효과 활성화
        transitionOverlay.classList.add('active');
        
        // 모든 섹션의 z-index 조정 (현재 섹션이 항상 위에 오도록)
        requestAnimationFrame(() => {
            sections.forEach((section, idx) => {
                if (idx === index) {
                    section.style.zIndex = 2;
                } else {
                    section.style.zIndex = 1;
                }
            });
            
            // 부드러운 전환 효과를 위해 현재 섹션 활성화
            activateSection(sections[index]);
            
            // 다른 섹션들은 현재 섹션에 따라 비활성화
            sections.forEach((section, idx) => {
                if (idx !== index) {
                    deactivateSection(section);
                }
            });
            
            // 프로젝트 섹션으로 이동할 때 제목이 잘 보이도록 스크롤 위치 조정
            if (sections[index].id.includes('project')) {
                setTimeout(() => {
                    // 페이지 상단에서 약간 여유 공간을 두고 스크롤
                    window.scrollTo({
                        top: sections[index].offsetTop - 20,
                        behavior: 'smooth'
                    });
                }, 30);
            } else {
                sections[index].scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
            
            // 스크롤 후 잠시 후에 애니메이션 클래스 제거 및 스크롤 잠금 해제
            setTimeout(() => {
                transitionOverlay.classList.remove('active');
                document.body.classList.remove('is-changing');
                isScrolling = false;
                updateNavButtons();
            }, 500); // 시간 단축
        });
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

    // 섹션 활성화 최적화
    const activateSection = (section) => {
        // 이전 활성 상태 제거
        sections.forEach(sec => {
            if (sec !== section) {
                sec.classList.remove("active");
            }
        });
        
        // 현재 섹션 활성화 (애니메이션 프레임 사용)
        requestAnimationFrame(() => {
            section.classList.add("active");
            section.classList.remove("inactive"); // 비활성 클래스 제거
            
            // 요소 애니메이션 최적화
            const elements = section.querySelectorAll(".animate-on-scroll");
            elements.forEach((element, index) => {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        element.classList.add("visible");
                    });
                }, index * 150); // 애니메이션 시간 간격 단축
            });
        });
    };

    // 섹션 비활성화 최적화
    const deactivateSection = (section) => {
        // 애니메이션 프레임 사용
        requestAnimationFrame(() => {
            section.classList.remove("active");
            section.classList.add("inactive");
            
            const elements = section.querySelectorAll(".animate-on-scroll");
            elements.forEach(element => {
                element.classList.remove("visible");
            });
        });
    };

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

    // 중복 코드 제거 (기존의 다른 인디케이터 함수들은 사용하지 않음)
    
    // 프로젝트 내비게이션 버튼 설정
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('project-nav-btn')) {
            const targetId = e.target.dataset.target;
            scrollToSection(targetId);
        }
    });

    // 스크롤 진행률 표시
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    // 최적화된 스크롤 진행률 표시
    const updateScrollProgress = () => {
        requestAnimationFrame(() => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    };

    // 최적화된 휠 이벤트 처리
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        if (wheelTimeout) return;
        
        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 50);
        
        const now = Date.now();
        currentSectionIndex = findActiveSectionIndex();
        
        // 현재 프로젝트 섹션에 있고 스크롤 커맨드가 지난 지 일정 시간이 지났을 때에만 처리
        const isProjectSection = ['project1', 'project2', 'project3'].includes(sections[currentSectionIndex].id);
        
        // 프로젝트 섹션에서는 스크롤 체크를 위한 로직 추가
        if (isProjectSection) {
            const currentSection = sections[currentSectionIndex];
            const sectionHeight = currentSection.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollTop = window.scrollY - currentSection.offsetTop;
            
            // 섹션 내부 스크롤 여부 확인
            const isAtTop = scrollTop <= 10;
            const isAtBottom = scrollTop + viewportHeight >= sectionHeight - 10;
            
            // 섹션 상단에서 위로 스크롤 시 이전 섹션으로, 하단에서 아래로 스크롤 시 다음 섹션으로
            if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                // 이미 스크롤 중이거나 쿨다운 시간이 지나지 않았으면 무시
                if (isScrolling || now - lastScrollTime < scrollCooldown) return;
                
                if (e.deltaY > 0) {
                    // 아래로 스크롤하여 다음 섹션으로
                    scrollToSection(currentSectionIndex + 1);
                } else {
                    // 위로 스크롤하여 이전 섹션으로
                    scrollToSection(currentSectionIndex - 1);
                }
                
                lastScrollTime = now;
            }
        } else {
            // 프로젝트 섹션이 아닌 경우 기존 로직 유지
            // 이미 스크롤 중이거나 쿨다운 시간이 지나지 않았으면 무시
            if (isScrolling || now - lastScrollTime < scrollCooldown) return;
            
            if (e.deltaY > 0) {
                // 아래로 스크롤
                scrollToSection(currentSectionIndex + 1);
            } else {
                // 위로 스크롤
                scrollToSection(currentSectionIndex - 1);
            }
            
            lastScrollTime = now;
        }
    }, { passive: true }); // passive 옵션 추가

    // 애니메이션 요소 체크 최적화
    const checkAnimatedElements = () => {
        requestAnimationFrame(() => {
            const elements = document.querySelectorAll('.animate-on-scroll:not(.visible)');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                
                if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
                    element.classList.add('visible');
                }
            });
        });
    };

    // 스크롤 이벤트 최적화
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            updateScrollProgress();
            checkAnimatedElements();
            toggleTopButton();
            updateIndicator();
            scrollTimeout = null;
        }, 10);
    }, { passive: true });

    // 마우스 움직임에 따른 배경 효과
    document.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty("--mouse-x", `${x}%`);
        document.documentElement.style.setProperty("--mouse-y", `${y}%`);
    });
    
    // 섹션 인디케이터 추가 (중복 제거 후 단일 함수로 통합)
    const createIndicator = () => {
        const sectionIndicator = document.createElement("div");
        sectionIndicator.className = "section-indicator";
        
        sections.forEach((section, index) => {
            const dot = document.createElement("div");
            dot.className = "indicator-dot";
            dot.dataset.index = index;
            
            // 섹션 ID를 기반으로 라벨 설정
            let labelText = '';
            if (section.id === 'home') {
                labelText = 'Home';
            } else if (section.id === 'about') {
                labelText = 'About Me';
            } else if (section.id === 'skills') {
                labelText = 'Skills';
            } else if (section.id === 'project1') {
                labelText = 'Project 1';
            } else if (section.id === 'project2') {
                labelText = 'Project 2';
            } else if (section.id === 'project3') {
                labelText = 'Project 3';
            } else if (section.id === 'contact') {
                labelText = 'Contact';
            }
            
            dot.dataset.label = labelText;
            
            dot.addEventListener("click", () => {
                scrollToSection(index);
            });
            
            sectionIndicator.appendChild(dot);
        });
        
        document.body.appendChild(sectionIndicator);
    };
    
    // 탑다운 버튼 추가
    const createNavButtons = () => {
        const navButtons = document.createElement("div");
        navButtons.className = "nav-buttons";
        
        const topButton = document.createElement("button");
        topButton.className = "top-button hidden";
        topButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
        topButton.addEventListener("click", () => {
            scrollToSection(currentSectionIndex - 1);
        });
        
        const downButton = document.createElement("button");
        downButton.className = "down-button";
        downButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
        downButton.addEventListener("click", () => {
            scrollToSection(currentSectionIndex + 1);
        });
        
        navButtons.appendChild(topButton);
        navButtons.appendChild(downButton);
        document.body.appendChild(navButtons);
        
        return { topButton, downButton };
    };
    
    // 버튼 생성
    const { topButton, downButton } = createNavButtons();
    
    // 탑다운 버튼 상태 업데이트
    const updateNavButtons = () => {
        // 첫 번째 섹션일 때 탑 버튼 숨김
        if (currentSectionIndex === 0) {
            topButton.classList.add("hidden");
        } else {
            topButton.classList.remove("hidden");
        }
        
        // 마지막 섹션일 때 다운 버튼 숨김
        if (currentSectionIndex === sections.length - 1) {
            downButton.classList.add("hidden");
        } else {
            downButton.classList.remove("hidden");
        }
        
        // 인디케이터 업데이트
        updateIndicator();
    };
    
    // 탑 버튼 표시/숨기기
    const toggleTopButton = () => {
        if (window.scrollY > 200) {
            document.querySelector('.top-button')?.classList.remove('hidden');
        } else {
            document.querySelector('.top-button')?.classList.add('hidden');
        }
    };
    
    // 초기화 함수
	const init = () => {
	    // 1. 해시 제거 (스크롤 위치 오작동 방지)
	    history.replaceState(null, "", window.location.pathname);

	    // 2. 인디케이터 생성 및 초기 UI 설정
	    createIndicator();
	    updateNavButtons();
	    checkAnimatedElements();

	    // 3. 첫 번째 섹션 강제 활성화 (보장)
	    activateSection(sections[0]);
	    sections[0].classList.add('active');
	    sections[0].classList.remove('inactive');
	    sections[0].style.zIndex = 2;
	    sections[0].style.opacity = 1;

	    // 나머지 섹션 비활성화
	    sections.forEach((sec, idx) => {
	        if (idx !== 0) {
	            sec.classList.remove('active');
	            sec.classList.add('inactive');
	            sec.style.zIndex = 1;
	            sec.style.opacity = 0;
	        }
	    });

	    currentSectionIndex = 0;
	};

    
    // 초기화 실행
    init();
});
