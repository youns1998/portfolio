document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("nav button"); // 네비게이션 버튼
    const sections = document.querySelectorAll(".section"); // 모든 섹션
    const options = {
        root: null, // 뷰포트를 기준으로 관찰
        threshold: 0.5, // 섹션의 50%가 보이면 활성화
    };

    // 네비게이션 버튼 클릭 시 부드러운 스크롤
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);

            // 해당 섹션으로 부드럽게 스크롤
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });

    // Intersection Observer로 스크롤에 따라 섹션 활성화
    const observerCallback = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                sections.forEach((section) => {
                    section.classList.add("d-none"); // 모든 섹션 숨기기
                });
                entry.target.classList.remove("d-none"); // 보이는 섹션 표시
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    sections.forEach((section) => {
        observer.observe(section);
    });
});
