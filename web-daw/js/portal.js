(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    const counters = [...document.querySelectorAll("[data-count]")];

    if ("IntersectionObserver" in window) {
        const groups = new Map();

        revealItems.forEach((item) => {
            const parent = item.parentElement;
            const index = groups.get(parent)?.length ?? 0;

            groups.set(parent, [...(groups.get(parent) ?? []), item]);
            item.classList.add(`reveal-delay-${Math.min(index, 5)}`);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
        );

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    counters.forEach((counter) => {
        const target = parseInt(counter.dataset.count, 10);
        if (!Number.isFinite(target) || motionQuery.matches) return;

        const duration = 1200;
        let start = null;

        counter.textContent = "0";

        const tick = (now) => {
            if (start === null) start = now;

            const progress = Math.min((now - start) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            counter.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = target;
                counter.animate([{ scale: "1" }, { scale: "1.06", offset: 0.6 }, { scale: "1" }], {
                    duration: 320,
                    easing: "ease-out",
                });
            }
        };

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    counterObserver.unobserve(entry.target);
                    requestAnimationFrame(tick);
                });
            },
            { threshold: 0.5 }
        );

        counterObserver.observe(counter);
    });
})();
