
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

            tl.from(".service__card service__card--7", {
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
}

export {home as default};