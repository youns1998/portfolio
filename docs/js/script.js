document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    // 스크롤 이벤트 감지
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            header.classList.add("hidden"); // 스크롤 시 헤더를 숨김
        } else {
            header.classList.remove("hidden"); // 스크롤이 위로 가면 다시 표시
        }
    });

    // "Scroll Down" 버튼 클릭 시 부드러운 스크롤 처리
    const scrollBtn = document.querySelector(".scroll-btn");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const target = document.querySelector("#about"); // 이동할 섹션
            if (target) {
                target.scrollIntoView({ behavior: "smooth" }); // 부드럽게 스크롤
            }
        });
    }
});
