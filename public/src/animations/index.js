
function home() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
        "(max-width: 750px)": function() {
            gsap.from(".service__card--1", {
                scrollTrigger: {
                    trigger: ".service__card--1",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--2", {
                scrollTrigger: {
                    trigger: ".service__card--2",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--3", {
                scrollTrigger: {
                    trigger: ".service__card--3",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
        },
        "(min-width: 750px)": function() {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".service__card",
                    start: "top center"
                }
            });

            tl.from(".service__card", {
                opacity: 0,
                duration: 1,
                stagger: 0.3
            });
        },
        "all": function() {
            gsap.from(".service__title", {
                scrollTrigger: {
                    trigger: ".service__title",
                    start: "center center"
                },
                opacity: 0,
                y: 100,
                duration: 1
            });
        }
    });

    // About top section timeline
    // let a_tl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: ".about__bottom",
    //         start: "top center"
    //     }
    // });

    // a_tl.from(".about__bottom-1",{opacity: 0, duration: 1});
    // a_tl.from(".about__top__back-img", {
    //     x: -300,
    //     opacity: 0,
    //     duration: 1.5
    // })
    // .from(".about__top__title", {
    //     opacity: 0,
    //     duration: 1.5,
    // });

    // // About bottom section timeline
    // let ab_tl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: ".about__bottom",
    //         start: "top 84%"
    //     }
    // });

    // ab_tl.from(".about__bottom__wDo, .about__bottom__wTo, .about__bottom__wC", {
    //     y: 150,
    //     duration: 0.6,
    //     stagger: 0.2,
    //     opacity: 0
    // })
    // .from(".about__bottom__wDo-title, .about__bottom__wTo-title, .about__bottom__wC-title", {
    //     duration: 0.5,
    //     opacity: 0
    // }, "-=.5")
    // .from(".about__bottom__wDo-text, .about__bottom__wTo-text, .about__bottom__wC-text", {
    //     duration: 1,
    //     opacity: 0,
    //     y: 100,
    //     ease: "power4.out"
    // })
}

export {home as default};