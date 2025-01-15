document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");
    let activeIndex = 0; // 현재 화면에 표시된 섹션의 인덱스

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const sectionIndex = [...sections].indexOf(entry.target);

                if (entry.isIntersecting) {
                    // 현재 섹션이 화면에 들어오면 visible 클래스 추가
                    if (sectionIndex === activeIndex) {
                        entry.target.classList.add("visible");
                    }
                } else {
                    // 화면에서 벗어나면 visible 클래스 제거
                    entry.target.classList.remove("visible");
                }
            });
        },
        {
            threshold: 0.5, // 섹션이 화면의 50% 이상 보일 때 동작
        }
    );

    sections.forEach((section) => observer.observe(section));

    // 스크롤 이벤트로 헤더와 섹션 전환
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;

        // 헤더 제어
        if (currentScroll > windowHeight * 0.5) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }

        // 현재 활성화된 섹션 결정
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= windowHeight * 0.5) {
                activeIndex = index;
            }
        });
    });
});
