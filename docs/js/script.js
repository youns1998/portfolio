document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("header nav a");
    const scrollToTopButton = document.getElementById("scroll-to-top");

    // Intersection Observer 설정
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    entry.target.classList.remove("inactive");

                    sections.forEach((section) => {
                        if (section !== entry.target) {
                            section.classList.remove("visible");
                            section.classList.add("inactive");
                        }
                    });

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
            threshold: 0.6,
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            navLinks.forEach((otherLink) => {
                otherLink.classList.toggle(
                    "active",
                    otherLink === link
                );
            });
        });
    });

    if (sections.length > 0) {
        sections[0].classList.add("visible");
        sections.forEach((section, index) => {
            if (index !== 0) {
                section.classList.add("inactive");
            }
        });
        navLinks[0].classList.add("active");
    }

    // Top으로 이동 버튼 클릭 이벤트
    scrollToTopButton.addEventListener("click", () => {
        document.getElementById("home").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});
