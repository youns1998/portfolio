document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    let lastScrollY = 0;

    // 스크롤 이벤트 감지
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // 아래로 스크롤할 때 헤더 숨기기
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add("hidden");
        } 
        // 위로 스크롤할 때 헤더 다시 표시
        else if (currentScrollY < lastScrollY) {
            header.classList.remove("hidden");
        }

        lastScrollY = currentScrollY; // 현재 스크롤 값을 저장
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
