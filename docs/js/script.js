document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 현재 보이는 섹션 활성화
                    entry.target.classList.add("visible");
                    entry.target.classList.remove("inactive");

                    // 다른 섹션 비활성화
                    sections.forEach((section) => {
                        if (section !== entry.target) {
                            section.classList.remove("visible");
                            section.classList.add("inactive");
                        }
                    });

                    // 네비게이션 활성화 업데이트
                    navLinks.forEach((link) => {
                        const targetId = link.getAttribute("href").substring(1);
                        link.classList.toggle(
                            "active",
                            targetId === entry.target.id
                        );
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

    // 네비게이션 클릭 시 부드럽게 스크롤 이동
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            // 스크롤로 해당 섹션으로 이동
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            // 클릭 시 네비게이션 상태 업데이트
            navLinks.forEach((otherLink) => {
                otherLink.classList.toggle(
                    "active",
                    otherLink === link
                );
            });
        });
    });

    // 초기 상태에서 첫 번째 섹션 활성화
    if (sections.length > 0) {
        sections[0].classList.add("visible");
        sections.forEach((section, index) => {
            if (index !== 0) {
                section.classList.add("inactive");
            }
        });
        navLinks[0].classList.add("active");
    }
});
