const toggleBtn = document.getElementById("toggleMode");
const pageBody = document.body;

toggleBtn.addEventListener("click", () => {
    pageBody.classList.toggle("dark");
});

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(item => {
        const windowHeight = window.innerHeight;
        const elementTop = item.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            item.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

const projects = document.querySelectorAll(".project");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");
const closePopup = document.getElementById("closePopup");

projects.forEach(project => {
    project.addEventListener("click", () => {
        popupTitle.textContent = project.dataset.title;
        popupDesc.textContent = project.dataset.desc;
        popup.style.display = "flex";
    });
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

const emailBtn = document.getElementById("sendEmail");
const whatsappBtn = document.getElementById("sendWhatsApp");

function getFormData() {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const message = document.getElementById("userMessage").value.trim();
    return { name, email, message };
}

function validateForm() {
    const { name, email, message } = getFormData();
    if (!name || !email || !message) {
        alert("Please fill in all fields before sending.");
        return false;
    }
    return true;
}

emailBtn.addEventListener("click", () => {
    if (!validateForm()) return;
    const { name, email, message } = getFormData();
    const subject = encodeURIComponent(`Portfolio Message from ${name}`);
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:kolawoletaiwo415@gmail.com?subject=${subject}&body=${emailBody}`;
});

whatsappBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const { name, email, message } = getFormData();
    const text = encodeURIComponent(`Hi Cybro'X! 👋\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.open(`https://wa.me/2347043930307?text=${text}`, "_blank");
});