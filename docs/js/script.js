document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const header = document.querySelector("header");

    let lastScrollY = 0;

    // 헤더 스크롤 이벤트
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add("hidden");
        } else if (currentScrollY < lastScrollY) {
            header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY;
    });

    // 스크롤 애니메이션 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    entry.target.classList.remove("visible");
                }
            });
        },
        {
            threshold: 0.2, // 뷰포트의 20% 이상 보일 때 작동
        }
    );

    sections.forEach((section) => observer.observe(section));

    // "Scroll Down" 버튼 클릭 시 부드러운 스크롤 처리
    const scrollBtn = document.querySelector(".scroll-btn");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const target = document.querySelector("#about");
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
});
