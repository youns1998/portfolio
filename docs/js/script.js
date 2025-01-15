document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");

    let isScrolling = false; // 스크롤 중복 방지 플래그

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isScrolling) {
                    const currentIndex = Array.from(sections).indexOf(entry.target);

                    // 네비게이션 상태 업데이트
                    navLinks.forEach((link, index) => {
                        link.classList.toggle("active", index === currentIndex);
                    });

                    // 섹션 활성화/비활성화 업데이트
                    sections.forEach((section, index) => {
                        section.classList.toggle("visible", index === currentIndex);
                        section.classList.toggle("inactive", index !== currentIndex);
                    });
                }
            });
        },
        {
            threshold: 0.6, // 섹션의 60% 이상 보일 때 활성화
        }
    );

    // 모든 섹션을 Observer에 등록
    sections.forEach((section) => {
        observer.observe(section);
    });

    // 네비게이션 클릭 이벤트
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetSection = sections[index];

            isScrolling = true;
            targetSection.scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
                isScrolling = false;
            }, 800); // 애니메이션 시간
        });
    });

    // 스크롤 이벤트 감지
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (Math.abs(currentScrollY - lastScrollY) > window.innerHeight / 2 && !isScrolling) {
            const direction = currentScrollY > lastScrollY ? "down" : "up";
            let currentSectionIndex = Array.from(sections).findIndex((section) =>
                section.classList.contains("visible")
            );

            if (direction === "down" && currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
            } else if (direction === "up" && currentSectionIndex > 0) {
                currentSectionIndex--;
            }

            const targetSection = sections[currentSectionIndex];
            if (targetSection) {
                isScrolling = true;
                targetSection.scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    isScrolling = false;
                }, 800); // 애니메이션 시간
            }
        }

        lastScrollY = currentScrollY;
    });

    // 초기 섹션 활성화
    sections[0].classList.add("visible");
    navLinks[0].classList.add("active");
});
