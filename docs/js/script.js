document.addEventListener("DOMContentLoaded", () => {
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

    // 네비게이션 클릭 이벤트
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            activeIndex = index; // 클릭한 섹션의 인덱스 저장
            showSection(activeIndex);

            sections[activeIndex].scrollIntoView({
                behavior: "smooth", // 부드러운 스크롤
                block: "start",
            });
        });
    });

    // 스크롤로 섹션 전환
    window.addEventListener("scroll", () => {
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();

            if (rect.top >= 0 && rect.top <= windowHeight * 0.5) {
                activeIndex = index;
                showSection(activeIndex);
            }
        });
    });

    // 초기 상태: 첫 번째 섹션 표시
    showSection(activeIndex);
});
