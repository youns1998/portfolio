document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("nav button");
    const sections = document.querySelectorAll(".section");

    // 부드러운 스크롤 기능
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);

            // 부드럽게 스크롤
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });

    // Intersection Observer를 이용한 섹션 가시성 관리
    const observerOptions = {
        root: null, // 뷰포트를 기준으로 관찰
        threshold: 0.3, // 섹션의 30%가 보이면 활성화
    };

    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 현재 보이는 섹션만 표시
                sections.forEach((section) => {
                    if (section !== entry.target) {
                        section.classList.add("d-none");
                    }
                });

                entry.target.classList.remove("d-none");
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
        observer.observe(section);
    });
});
