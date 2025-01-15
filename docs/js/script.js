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
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href").substring(1) === entry.target.id
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
    sections.forEach((section) => observer.observe(section));
});
