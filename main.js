// Consolidated site script: nav, tabs, form, lightbox (image/video), theme, AOS/Chart, cursor, reveal
document.addEventListener('DOMContentLoaded', () => {
	// --- Mobile nav toggle ---
	const navToggle = document.querySelector('.nav-toggle');
	const nav = document.querySelector('nav');
	if (navToggle && nav) {
		navToggle.addEventListener('click', () => nav.classList.toggle('open'));
	}

	// --- Tabs (exposed globally for inline onclick) ---
	window.opentab = function(tabId, el) {
		document.querySelectorAll('.links').forEach(l => l.classList.remove('active-link'));
		if (el && el.classList) el.classList.add('active-link');
		document.querySelectorAll('.content').forEach(c => c.classList.remove('active-tab'));
		const target = document.getElementById(tabId);
		if (target) target.classList.add('active-tab');
	};
	// keyboard + click fallback for .links
	document.querySelectorAll('.links').forEach(node => {
		if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
		node.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); }
		});
		node.addEventListener('click', () => {
			// if inline onclick exists it will run (opentab). Otherwise attempt to use data-tab attribute.
			if (!node.getAttribute('onclick')) {
				const tab = node.dataset.tab || node.getAttribute('data-tab') || 'skills';
				if (document.getElementById(tab)) window.opentab(tab, node);
			}
		});
	});
	// ensure default tab visible
	if (!document.querySelector('.content.active-tab')) {
		const skills = document.getElementById('skills') || document.querySelector('.content');
		const firstLink = document.querySelector('.links');
		if (skills) skills.classList.add('active-tab');
		if (firstLink) firstLink.classList.add('active-link');
	}

	// --- Contact form submit (Google Sheets) ---
	const form = document.forms['submit-to-google-sheet'];
	const msg = document.getElementById('msg');
	if (form) {
		const scriptURL = form.dataset.script || 'https://script.google.com/macros/s/AKfycbxlmeZQPM3v9dMDUJXJEWqAB7UqeRpSHEaBdsSQdE6MiqpsmhyLhxHspOvN2j1H1poKAA/exec';
		form.addEventListener('submit', e => {
			e.preventDefault();
			fetch(scriptURL, { method: 'POST', body: new FormData(form) })
			.then(() => {
				if (msg) msg.textContent = 'Message sent successfully';
				form.reset();
				setTimeout(()=> { if (msg) msg.textContent = ''; }, 4000);
			})
			.catch(err => {
				console.error(err);
				if (msg) msg.textContent = 'Error sending message';
			});
		});
	}

	// --- Lightbox / Case Study (image or video) ---
	const lightbox = document.getElementById('lightbox');
	const lbImage = lightbox ? lightbox.querySelector('.lb-image') : null;
	const lbVideo = lightbox ? lightbox.querySelector('.lb-video') : null;
	const lbTitle = lightbox ? lightbox.querySelector('.lb-title') : null;
	const lbDesc = lightbox ? lightbox.querySelector('.lb-desc') : null;
	const lbDemo = lightbox ? lightbox.querySelector('.lb-demo') : null;
	const lbRepo = lightbox ? lightbox.querySelector('.lb-repo') : null;
	const lbClose = lightbox ? lightbox.querySelector('.lb-close') : null;

	function openCase(card) {
		if (!lightbox || !card) return;
		const title = card.dataset.title || '';
		const desc = card.dataset.desc || '';
		const img = card.dataset.image || '';
		const vid = card.dataset.video || '';
		const repo = card.dataset.repo || '#';
		const demo = card.dataset.demo || '#';

		if (lbTitle) lbTitle.textContent = title;
		if (lbDesc) lbDesc.textContent = desc;
		if (lbRepo) lbRepo.href = repo;
		if (lbDemo) lbDemo.href = demo;

		if (vid && lbVideo) {
			if (lbImage) lbImage.hidden = true;
			lbVideo.hidden = false;
			lbVideo.src = vid;
			lbVideo.play().catch(()=>{});
		} else {
			if (lbVideo) { lbVideo.pause(); lbVideo.hidden = true; lbVideo.src = ''; }
			if (lbImage) { lbImage.hidden = false; lbImage.src = img; }
		}

		lightbox.setAttribute('aria-hidden','false');
		document.body.style.overflow = 'hidden';
		if (lbClose) lbClose.focus();
	}
	function closeCase() {
		if (!lightbox) return;
		lightbox.setAttribute('aria-hidden','true');
		document.body.style.overflow = '';
		if (lbVideo) { lbVideo.pause(); lbVideo.src = ''; }
		if (lbImage) { lbImage.src = ''; }
	}

	// Attach click to work items and details buttons
	document.querySelectorAll('.work').forEach(card => {
		card.addEventListener('click', (e) => {
			// if clicked a link inside card, let it proceed
			if (e.target.closest('a')) return;
			openCase(card);
		});
		card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(card); } });
	});
	document.querySelectorAll('.view-details').forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const card = btn.closest('.work');
			if (card) openCase(card);
		});
	});

	if (lbClose) lbClose.addEventListener('click', closeCase);
	if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeCase(); });
	document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCase(); });

	// --- Theme toggle (persisted) ---
	const THEME_KEY = 'site-theme'; // 'light' | 'dark'
	const HTML = document.documentElement;
	const themeBtn = document.getElementById('theme-toggle');

	function applyTheme(theme) {
		if (theme === 'light') {
			HTML.classList.add('light-theme');
			if (themeBtn) { themeBtn.setAttribute('aria-pressed','true'); const ic = themeBtn.querySelector('i'); if(ic){ ic.className = 'fas fa-sun'; } }
		} else {
			HTML.classList.remove('light-theme');
			if (themeBtn) { themeBtn.setAttribute('aria-pressed','false'); const ic = themeBtn.querySelector('i'); if(ic){ ic.className = 'fas fa-moon'; } }
		}
	}
	// init
	let stored = null;
	try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
	if (stored === 'light' || stored === 'dark') applyTheme(stored);
	else {
		const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
		applyTheme(prefersLight ? 'light' : 'dark');
	}
	if (themeBtn) {
		themeBtn.addEventListener('click', () => {
			const isLight = HTML.classList.toggle('light-theme');
			applyTheme(isLight ? 'light' : 'dark');
			try { localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark'); } catch (e) {}
		});
		themeBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeBtn.click(); } });
	}

	// --- Init AOS & Chart.js if present ---
	if (window.AOS) AOS.init({ duration: 700, once: true });
	const chartEl = document.getElementById('skillChart');
	if (chartEl && window.Chart) {
		new Chart(chartEl, {
			type: 'bar',
			data: {
				labels: ['HTML/CSS','JS','React','Python','Pandas'],
				datasets: [{ label:'Skill %', data:[90,80,70,75,65], backgroundColor:['#f06529','#2965f1','#61dafb','#3776ab','#2a9d8f'] }]
			},
			options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, max:100 } } }
		});
	}

	// --- Cursor follower + glow ---
	const follower = document.createElement('div');
	follower.className = 'cursor-follower';
	document.body.appendChild(follower);
	document.addEventListener('mousemove', (e) => {
		follower.style.left = e.clientX + 'px';
		follower.style.top = e.clientY + 'px';
	});
	['a','button','.work','.project-link','.btn'].forEach(sel => {
		document.querySelectorAll(sel).forEach(el => {
			el.addEventListener('mouseenter', ()=> follower.style.transform = 'translate(-50%,-50%) scale(1.6)');
			el.addEventListener('mouseleave', ()=> follower.style.transform = 'translate(-50%,-50%) scale(1)');
		});
	});

	// --- Scroll reveal: add 'reveal' to major sections and trigger on scroll ---
	document.querySelectorAll('div[id], section, header, footer').forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });
	function revealOnScroll() {
		const reveals = document.querySelectorAll('.reveal');
		const h = window.innerHeight;
		reveals.forEach(el => {
			const top = el.getBoundingClientRect().top;
			if (top < h - 120) el.classList.add('active');
		});
	}
	window.addEventListener('scroll', revealOnScroll, { passive: true });
	window.addEventListener('resize', revealOnScroll);
	setTimeout(revealOnScroll, 120);
});
