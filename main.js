document.addEventListener('DOMContentLoaded', function(){
    // Mobile nav toggle
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('nav');
    if(toggle && nav){
        toggle.addEventListener('click', function(){ nav.classList.toggle('open'); });
    }

    // tabs opener exposed globally so inline onclick handlers keep working
    window.opentab = function(tabname, el){
        var links = document.getElementsByClassName("links");
        var contents = document.getElementsByClassName("content");
        for (var i = 0; i < links.length; i++){
            links[i].classList.remove("active-link");
        }
        for (var j = 0; j < contents.length; j++){
            contents[j].classList.remove("active-tab");
        }
        if(el) el.classList.add("active-link");
        var target = document.getElementById(tabname);
        if(target) target.classList.add("active-tab");
    };

    // contact form submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxlmeZQPM3v9dMDUJXJEWqAB7UqeRpSHEaBdsSQdE6MiqpsmhyLhxHspOvN2j1H1poKAA/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById("msg");

    if(form){
        form.addEventListener('submit', e => {
            e.preventDefault();
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                if(msg) msg.innerHTML = "Message sent successfully";
                setTimeout(function(){ if(msg) msg.innerHTML = ""; },5000);
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                if(msg) msg.innerHTML = "Error sending message";
            });
        });
    }

    // Portfolio lightbox
    var lightbox = document.getElementById('lightbox');
    var lbImage = document.querySelector('.lb-image');
    var lbTitle = document.querySelector('.lb-title');
    var lbDesc = document.querySelector('.lb-desc');
    var lbClose = document.querySelector('.lb-close');

    function openLightbox(src, title, desc){
        if(!lightbox) return;
        lbImage.src = src;
        lbImage.alt = title || '';
        lbTitle.textContent = title || '';
        lbDesc.textContent = desc || '';
        lightbox.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox(){
        if(!lightbox) return;
        lightbox.setAttribute('aria-hidden','true');
        lbImage.src = '';
        document.body.style.overflow = '';
    }

    // attach to work items
    var works = document.querySelectorAll('.work');
    works.forEach(function(w){
        w.addEventListener('click', function(){
            var img = w.querySelector('img');
            var src = img ? img.src : '';
            var title = w.dataset.title || '';
            var desc = w.dataset.desc || '';
            openLightbox(src, title, desc);
        });
        w.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); w.click(); } });
    });

    if(lbClose){ lbClose.addEventListener('click', closeLightbox); }
    if(lightbox){ lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); }); }
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLightbox(); });

    // Theme toggle (dark / light)
    var themeToggle = document.getElementById('theme-toggle');
    var root = document.documentElement;
    function applyTheme(isLight){
        if(isLight) root.classList.add('light-theme'); else root.classList.remove('light-theme');
        if(themeToggle){
            themeToggle.setAttribute('aria-pressed', String(isLight));
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    // initialize from localStorage or prefers-color-scheme
    var stored = localStorage.getItem('theme');
    if(stored){
        applyTheme(stored === 'light');
    } else {
        var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight);
    }

    if(themeToggle){
        themeToggle.addEventListener('click', function(){
            var isLight = root.classList.toggle('light-theme');
            applyTheme(isLight);
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

});
