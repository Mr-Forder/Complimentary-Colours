gsap.fromTo(".library-panel", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".library-panel", { y: "1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".generate-panel", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".generate-panel", { y: "1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".save-panel", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".save-panel", { y: "1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".logo", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".logo", { y: "-5rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".nav-links", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".nav-links", { y: "-5rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".hamburger", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".hamburger", { x: "5rem" }, { x: "0rem", duration: 1 });

gsap.fromTo(".about-content", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".about-content", { y: "1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".about-content h1", { opacity: 0 }, { opacity: 1, duration: 1 });
gsap.fromTo(".about-content h1", { y: "-1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".fwrap", { opacity: 0 }, { opacity: 1, duration: 3 });
gsap.fromTo(".fwrap", { y: "1rem" }, { y: "0rem", duration: 1 });

gsap.fromTo(".intro", { opacity: 0 }, { opacity: 1, duration: 3 });

TweenMax.to(".big-logo", 0.5, {
  scale: 1.2,
  repeat: -1,
  ease: Bounce.easeOut,
  yoyoEase: Power3.easeOut,
});
 