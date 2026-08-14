const toggleBtn = document.getElementById("toggleMode");
const pageBody = document.body;

const savedTheme = localStorage.getItem("cybrox-theme");
if (savedTheme === "dark") {
    pageBody.classList.add("dark");
    toggleBtn.textContent = "☀️";
} else {
    toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
    const dark = pageBody.classList.toggle("dark");
    toggleBtn.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("cybrox-theme", dark ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("themechange"));
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll("[data-nav]");

function setActiveNav() {
    let current = "";
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
            current = section.id;
        }
    });
    navItems.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

window.addEventListener("scroll", setActiveNav);
setActiveNav();

// ---------- Scroll reveal ----------
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

// ---------- Skills bar fill on reveal ----------
const skillFills = document.querySelectorAll(".skill-fill");
let skillsAnimated = false;

function animateSkills() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection || skillsAnimated) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        skillFills.forEach(fill => {
            const level = fill.closest(".skill").dataset.level;
            fill.style.width = `${level}%`;
        });
        skillsAnimated = true;
    }
}

window.addEventListener("scroll", animateSkills);
animateSkills();

// ---------- Typing tagline effect ----------
const taglineEl = document.getElementById("typedTagline");
const taglineText = "Securing systems. Designing experiences.";
let typeIndex = 0;

function typeTagline() {
    if (typeIndex <= taglineText.length) {
        taglineEl.textContent = taglineText.slice(0, typeIndex);
        typeIndex++;
        setTimeout(typeTagline, 45);
    }
}

typeTagline();

// ---------- Project popup ----------
const projects = document.querySelectorAll(".project");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupTag = document.getElementById("popupTag");
const popupProblem = document.getElementById("popupProblem");
const popupApproach = document.getElementById("popupApproach");
const popupResult = document.getElementById("popupResult");
const closePopup = document.getElementById("closePopup");

function openProjectPopup(project) {
    popupTag.textContent = project.dataset.tag || "";
    popupTitle.textContent = project.dataset.title;
    popupProblem.textContent = project.dataset.problem || "";
    popupApproach.textContent = project.dataset.approach || "";
    popupResult.textContent = project.dataset.result || "";
    popup.style.display = "flex";
}

projects.forEach(project => {
    project.addEventListener("click", () => openProjectPopup(project));
    project.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProjectPopup(project);
        }
    });
});

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
});

// ---------- Avatar lightbox ----------
const avatarTrigger = document.getElementById("avatarTrigger");
const avatarLightbox = document.getElementById("avatarLightbox");
const closeAvatarLightbox = document.getElementById("closeAvatarLightbox");

function openAvatarLightbox() {
    avatarLightbox.style.display = "flex";
}

function closeAvatarLightboxFn() {
    avatarLightbox.style.display = "none";
}

avatarTrigger.addEventListener("click", openAvatarLightbox);
avatarTrigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAvatarLightbox();
    }
});

closeAvatarLightbox.addEventListener("click", closeAvatarLightboxFn);

avatarLightbox.addEventListener("click", (e) => {
    if (e.target === avatarLightbox) closeAvatarLightboxFn();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        popup.style.display = "none";
        closeAvatarLightboxFn();
    }
});

// ---------- Toast ----------
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- Contact form ----------
const emailBtn = document.getElementById("sendEmail");
const whatsappBtn = document.getElementById("sendWhatsApp");

function getFormData() {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const message = document.getElementById("userMessage").value.trim();
    return { name, email, message };
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
    const { name, email, message } = getFormData();
    if (!name || !email || !message) {
        showToast("Fill in all fields before sending.");
        return false;
    }
    if (!isValidEmail(email)) {
        showToast("Enter a valid email address.");
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

// ---------- World loader ----------
const worldLoader = document.getElementById("worldLoader");
let loaderHidden = false;

function hideLoader() {
    if (loaderHidden || !worldLoader) return;
    loaderHidden = true;
    worldLoader.classList.add("hidden");
}

window.addEventListener("worldready", hideLoader);
setTimeout(hideLoader, 7000);

// ---------- LinkedIn placeholder guard ----------
document.querySelectorAll("#linkedinLink, #linkedinLinkFooter").forEach(link => {
    link.addEventListener("click", (e) => {
        if (link.getAttribute("href") === "#") {
            e.preventDefault();
            showToast("LinkedIn link not added yet.");
        }
    });
});

// ---------- Resume guard ----------
document.querySelectorAll(".resume-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        fetch("resume.pdf", { method: "HEAD" }).then(res => {
            if (!res.ok) {
                e.preventDefault();
                showToast("Resume not ready yet — check back soon.");
            }
        }).catch(() => {
            e.preventDefault();
            showToast("Resume not ready yet — check back soon.");
        });
    });
});