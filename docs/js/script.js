document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("nav button");
    const sections = document.querySelectorAll(".section");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.target;

            sections.forEach((section) => {
                section.classList.add("d-none");
            });

            document.getElementById(target).classList.remove("d-none");
        });
    });
});
