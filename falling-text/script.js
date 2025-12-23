async function loadFont(target, config) {
  await document.fonts.ready;
  return SplitText.create(target, config);
}

document.addEventListener("DOMContentLoaded", async () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  let isAnimating = false;

  const buttons = document.querySelectorAll(".selected-type button");
  const startButton = document.querySelector(".start-button");
  const activeButton = document.querySelector(".selected-type button.active");
  let selectedType = activeButton
    ? activeButton.getAttribute("data-type")
    : "chars";

  gsap.ticker.lagSmoothing(0);

  let splitType = await loadFont(".content h1", {
    type: "lines,words,chars",
    charsClass: "chars",
    wordsClass: "words",
    linesClass: "lines",
    smartWrap: true,
  });

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (isAnimating) return;
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      selectedType = button.getAttribute("data-type");
    });
  });

  const createAnimation = () => {
    if (isAnimating) return;
    isAnimating = true;
    if (!splitType.isSplit) {
      isAnimating = false;
      return;
    }
    gsap.to(splitType[selectedType], {
      y: "120dvh",
      x: "random(-150, 150)",
      rotate: "random(-720, 720)",
      ease: "elastic.in(1,0.75)",
      duration: 1,
      stagger: {
        each:
          selectedType === "lines"
            ? 0.1
            : selectedType === "words"
            ? 0.05
            : 0.0095,
        from: "random",
      },
      onComplete: () => {
        gsap.set(splitType[selectedType], {
          y: 0,
          x: 0,
          rotate: 0,
          delay: 0.5,
          onComplete: () => {
            isAnimating = false;
          },
        });
      },
    });
  };

  startButton.addEventListener("click", createAnimation);

  // Scrool-triggered version (disabled)
  // await loadFont(".content h1", {
  //   type: "chars",
  //   charsClass: "chars",
  //   smartWrap: true,
  //   autoSplit: true,
  //   onSplit: ({ chars }) => {
  //     const anim = gsap.to(chars, {
  //       y: window.innerHeight,
  //       x: "random(-150, 150)",
  //       rotate: "random(-720, 720)",
  //       ease: "elastic.in(1,0.75)",
  //       duration: 1,
  //       stagger: {
  //         each: 0.0095,
  //         from: "random",
  //       },
  //       paused: true,
  //     });

  //     ScrollTrigger.create({
  //       trigger: ".content h1",
  //       start: `${!isMobile ? "center" : "30%"} center`,
  //       end: "center center",

  //       onEnter: () => anim.play(),

  //       onEnterBack: () => anim.reverse(),

  //       onLeaveBack: () => anim.reverse(),
  //     });

  //     return anim;
  //   },
  // });
});
