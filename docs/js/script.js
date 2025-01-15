document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");

    let currentSectionIndex = 0; // 현재 활성화된 섹션의 인덱스
    let isScrolling = false; // 스크롤 중복 방지 플래그

    // 스크롤 이벤트 핸들러
    const handleScroll = (direction) => {
        if (isScrolling) return; // 이미 스크롤 중이면 무시
        isScrolling = true;

        if (direction === "down" && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
        } else if (direction === "up" && currentSectionIndex > 0) {
            currentSectionIndex--;
        }

        const targetSection = sections[currentSectionIndex];
        targetSection.scrollIntoView({ behavior: "smooth" });

        // 섹션 활성화/비활성화 업데이트
        sections.forEach((section, index) => {
            if (index === currentSectionIndex) {
                section.classList.add("visible");
                section.classList.remove("inactive");
            } else {
                section.classList.remove("visible");
                section.classList.add("inactive");
            }
        });

        // 네비게이션 활성화 업데이트
        navLinks.forEach((link, index) => {
            link.classList.toggle("active", index === currentSectionIndex);
        });

        setTimeout(() => {
            isScrolling = false; // 스크롤 플래그 해제
        }, 800); // 스크롤 애니메이션 시간 (CSS와 동기화 필요)
    };

    // 휠 이벤트 감지
    window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) {
            handleScroll("down");
        } else {
            handleScroll("up");
        }
    });

    // 네비게이션 클릭 이벤트
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            currentSectionIndex = index;

            const targetSection = sections[currentSectionIndex];
            targetSection.scrollIntoView({ behavior: "smooth" });

            sections.forEach((section, idx) => {
                section.classList.toggle("visible", idx === index);
                section.classList.toggle("inactive", idx !== index);
            });

            navLinks.forEach((nav, idx) => {
                nav.classList.toggle("active", idx === index);
            });
        });
    });

    // 초기 활성화 섹션 설정
    sections[0].classList.add("visible");
    navLinks[0].classList.add("active");
});
