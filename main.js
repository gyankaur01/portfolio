// Tab Switching Logic
function opentab(tabname) {
    const tablinks = document.getElementsByClassName("tab-links");
    const tabcontents = document.getElementsByClassName("tab-contents");

    for (let link of tablinks) {
        link.classList.remove("active-link");
    }
    for (let content of tabcontents) {
        content.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// Mobile Nav Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Dark/Light Theme Logic
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    // Save preference
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update icon
    themeBtn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Contact Form (Example Script)
const scriptURL = 'https://scriyka3hqqXC7Qjp6GvEv4nPtefPJiIjrSnHHSDODS2qbvBMuHLCZXWWDEDVJU/exec'
const form = document.forms['contact-form']
const msg = document.getElementById("msg")

form.addEventListener('submit', e => {
  e.preventDefault()
  msg.innerHTML = "Sending..."
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        msg.innerHTML = "Message sent successfully! ✅"
        setTimeout(function(){
            msg.innerHTML = ""
        }, 5000)
        form.reset()
    })
    .catch(error => {
        msg.innerHTML = "Something went wrong. Please try again. ❌";
        msg.style.color = "#ff4d4d";
        submitBtn.innerHTML = originalBtnText;
        console.error('Error!', error.message);
    })
})