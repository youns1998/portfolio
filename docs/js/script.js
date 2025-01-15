document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const sections = document.querySelectorAll("section");
    let activeIndex = 0; // 현재 활성화된 섹션의 인덱스

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const sectionIndex = [...sections].indexOf(entry.target);

                if (entry.isIntersecting) {
                    // 현재 섹션이 화면에 들어오면 visible 클래스 추가
                    entry.target.classList.add("visible");

                    // 해당 섹션을 최상단으로 스크롤
                    if (sectionIndex === activeIndex) {
                        entry.target.scrollIntoView({
                            behavior: "smooth", // 부드러운 스크롤
                            block: "start", // 최상단에 위치
                        });
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

    // 각 섹션을 관찰
    sections.forEach((section) => observer.observe(section));

    // 스크롤 이벤트로 활성화된 섹션 인덱스 업데이트
    window.addEventListener("scroll", () => {
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= windowHeight * 0.5) {
                activeIndex = index;
            }
        });
    });
});
