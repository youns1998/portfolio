document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");
    let activeIndex = 0; // 현재 활성화된 섹션의 인덱스

    // 모든 섹션 숨기기
    function hideAllSections() {
        sections.forEach((section) => {
            section.classList.remove("visible");
        });
    }

    // 특정 섹션만 활성화
    function showSection(index) {
        hideAllSections();
        sections[index].classList.add("visible");
    }

    // 네비게이션 링크 클릭 시 해당 섹션으로 이동
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            activeIndex = index; // 클릭한 섹션의 인덱스 저장
            showSection(activeIndex);

            sections[activeIndex].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const sectionIndex = [...sections].indexOf(entry.target);

                if (entry.isIntersecting) {
                    activeIndex = sectionIndex;
                    showSection(activeIndex);
                }
            });
        },
        {
            threshold: 0.5, // 섹션이 50% 이상 보일 때 활성화
        }
    );

    sections.forEach((section) => observer.observe(section));

    // 스크롤 이벤트로 헤더 제어
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;

        // 헤더 숨기기/보이기
        if (currentScroll > windowHeight * 0.5) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }
    });

    // 초기 상태: 첫 번째 섹션 표시
    showSection(activeIndex);
});
