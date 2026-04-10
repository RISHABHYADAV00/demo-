(function () {

    /* ── helpers ── */
    function qs(s) { return document.querySelector(s); }
    function qsa(s) { return document.querySelectorAll(s); }

    function showToast(msg) {
        var t = qs('#toast');
        t.textContent = msg;
        t.classList.add('on');
        clearTimeout(t._tmr);
        t._tmr = setTimeout(function () { t.classList.remove('on'); }, 3800);
    }

    /* ── Ticker ── */
    var brands = [
        "L'Oreal Professionnel", "Wella Professionals", "Kerastase", "Schwarzkopf",
        "Matrix", "Streax", "Biotique", "OGX", "Tresemme", "Pantene", "Dove Hair",
        "Indulekha", "Dabur Vatika", "Livon", "Sunsilk", "Himalaya", "Patanjali",
        "Head and Shoulders", "Garnier", "Clinic Plus"
    ];
    var tt = qs('#tickerTrack');
    var doubled = brands.concat(brands);
    doubled.forEach(function (b) {
        var el = document.createElement('div');
        el.className = 'tick-item';
        el.innerHTML = '<div class="tick-dot"></div><span>' + b + '</span>';
        tt.appendChild(el);
    });

    /* ── Navbar scroll ── */
    window.addEventListener('scroll', function () {
        qs('#nav').classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── Mobile menu ── */
    var mob = qs('#mobNav');
    qs('#ham').addEventListener('click', function () { mob.classList.add('open'); });
    qs('#mobClose').addEventListener('click', function () { mob.classList.remove('open'); });
    qsa('.mlink').forEach(function (el) {
        el.addEventListener('click', function () { mob.classList.remove('open'); });
    });

    /* ── Sticky bar booking button ── */
    qs('#bookBtn').addEventListener('click', function (e) {
        e.preventDefault();
        var target = qs('#booking');
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });

    /* ── Scroll reveal ── */
    var reveals = qsa('.reveal');
    var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) { entry.target.classList.add('vis'); }
        });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { ro.observe(el); });

    /* ── Counter ── */
    var statsRow = qs('.stats-row');
    if (statsRow) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                if (statsRow.dataset.done) { return; }
                statsRow.dataset.done = '1';
                var counters = statsRow.querySelectorAll('.snum[data-to]');
                counters.forEach(function (el, idx) {
                    var target = parseInt(el.dataset.to, 10);
                    var suffix = (target === 12) ? 'K+' : '+';
                    var t0 = null;
                    var dur = 1600;
                    var delay = idx * 200; // Stagger animation start
                    function step(ts) {
                        if (!t0) { t0 = ts; }
                        var elapsed = ts - t0;
                        if (elapsed < delay) { requestAnimationFrame(step); return; }
                        var p = Math.min((elapsed - delay) / dur, 1);
                        el.textContent = Math.floor(p * target);
                        if (p < 1) { requestAnimationFrame(step); }
                        else { el.textContent = target + suffix; }
                    }
                    requestAnimationFrame(step);
                });
            });
        }, { threshold: 0.3 });
        co.observe(statsRow);
    }

    /* ── Testimonials ── */
    var track = qs('#tTrack');
    var cards = track.querySelectorAll('.tcard');
    var dotsWrap = qs('#tDots');
    var cur = 0;
    var total = cards.length;

    function pv() {
        if (window.innerWidth < 600) { return 1; }
        if (window.innerWidth < 900) { return 2; }
        return 3;
    }

    for (var i = 0; i < total; i++) {
        var d = document.createElement('button');
        d.className = 'tdot' + (i === 0 ? ' on' : '');
        d.setAttribute('data-idx', i);
        dotsWrap.appendChild(d);
    }

    dotsWrap.addEventListener('click', function (e) {
        var idx = e.target.getAttribute('data-idx');
        if (idx !== null) { goTo(parseInt(idx, 10)); }
    });

    function goTo(idx) {
        var perV = pv();
        var max = Math.max(0, total - perV);
        cur = Math.max(0, Math.min(idx, max));
        var w = cards[0].offsetWidth + 22;
        track.style.transform = 'translateX(-' + (cur * w) + 'px)';
        cards.forEach(function (c, ci) { c.classList.toggle('on', ci === cur); });
        qsa('.tdot').forEach(function (dot, di) { dot.classList.toggle('on', di === cur); });
    }

    qs('#tPrev').addEventListener('click', function () {
        var perV = pv();
        goTo(cur <= 0 ? Math.max(0, total - perV) : cur - 1);
    });
    qs('#tNext').addEventListener('click', function () {
        var perV = pv();
        goTo(cur >= Math.max(0, total - perV) ? 0 : cur + 1);
    });

    var autoT = setInterval(function () {
        var perV = pv();
        goTo(cur >= Math.max(0, total - perV) ? 0 : cur + 1);
    }, 4500);

    window.addEventListener('resize', function () { goTo(0); }, { passive: true });




    /* ── Service book buttons ── */
    qsa('.btn-dark[data-svc]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var svc = btn.getAttribute('data-svc');
            var sel = qs('#bService');
            for (var i = 0; i < sel.options.length; i++) {
                if (sel.options[i].value === svc) { sel.selectedIndex = i; break; }
            }
            qs('#booking').scrollIntoView({ behavior: 'smooth' });
            showToast(svc + ' selected — fill in your details below');
        });
    });

    /* ── Booking form ── */
    qs('#bForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = qs('#bName').value;
        showToast('Booking confirmed for ' + name + '! We will WhatsApp you shortly.');
        e.target.reset();
    });

    /* ── Contact form ── */
    qs('#cForm').addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('Message sent! We will reply within a few hours.');
        e.target.reset();
    });

    /* ── Newsletter ── */
    qs('#newsBtn').addEventListener('click', function () {
        showToast('Subscribed! Thank you.');
    });

    /* ── Min booking date ── */
    var bd = qs('#bDate');
    if (bd) {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var iso = tomorrow.toISOString().slice(0, 10);
        bd.min = iso;
        bd.value = iso;
    }

})();
