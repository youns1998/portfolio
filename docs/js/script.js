document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const header = document.querySelector("header");

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 현재 보이는 섹션 활성화
                    entry.target.classList.add("visible");

                    // 이전 섹션 비활성화
                    sections.forEach((section) => {
                        if (section !== entry.target) {
                            section.classList.remove("visible");
                        }
                    });
                }
            });
        },
        {
            threshold: 0.5, // 섹션의 50% 이상 보일 때 동작
        }
    );

    // 각 섹션 관찰
    sections.forEach((section) => observer.observe(section));
});
