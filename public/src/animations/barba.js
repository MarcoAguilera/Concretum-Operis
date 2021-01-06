import {default as barba} from "../core.js";
import {default as barbaPrefetch} from "../prefetch.js";

function reloadJs(src) {
    src = $('script[src$="' + src + '"]').attr("src");
    $('script[src$="' + src + '"]').remove();
    $('<script/>').attr('src', src).appendTo('footer');
}

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
    let a_tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about__top",
            start: "top center"
        }
    });

    a_tl.from(".about__top__back-img", {
        x: -300,
        opacity: 0,
        duration: 1.5
    })
    .from(".about__top__title", {
        opacity: 0,
        duration: 1.5,
    });

    // About bottom section timeline
    let ab_tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".about__bottom",
            start: "top 84%"
        }
    });

    ab_tl.from(".about__bottom__wDo, .about__bottom__wTo, .about__bottom__wC", {
        y: 150,
        duration: 0.6,
        stagger: 0.2,
        opacity: 0
    })
    .from(".about__bottom__wDo-title, .about__bottom__wTo-title, .about__bottom__wC-title", {
        duration: 0.5,
        opacity: 0
    }, "-=.5")
    .from(".about__bottom__wDo-text, .about__bottom__wTo-text, .about__bottom__wC-text", {
        duration: 1,
        opacity: 0,
        y: 100,
        ease: "power4.out"
    })

    //Gallery section 

    let gb_tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".gallery",
            start: "top 70%"
        }
    });

    gb_tl.to(".gallery", {duration: 1.5, opacity: 1, ease: "power2.out"}, 0);
}

barba.use(barbaPrefetch);

barba.init({
    timeout: 5000,
    transitions: [
        {
            name: "home",
            to: {
                namespace: ['home']
            },
            once() {
                const tl = gsap.timeline();
                tl.set(".intro", {opacity: 1})
                  .to(".intro__slot", {duration: 1.5, stagger: 0.2, height: 0, delay: 0.2, onComplete: () => {
                    gsap.to(".intro", {duration: 0.1, height: 0})
                }}, 0)
                  .to(".pattern, .header", {duration: 1, opacity: 1}, 0);
                
                  home();
            },
            leave(){},
            beforeEnter(){
                gsap.set(".intro", {height: 0});
                gsap.set(".pattern, .header", {duration: 3, opacity: 1});
            },
            enter(){
                reloadJs("./src/scroll.js");
                reloadJs("./src/popup.js");
                reloadJs("./src/editimg.js");
                home();
            }
        },
        {
            name: "fade", 
            to: {
                namespace: ['login', 'contact', 'calander', 'upload']
            },
            once({next}) {
                gsap.to(next.container, {duration: 1, opacity: 1}).delay(0.5);
                console.log(next.container);
            },
            leave({current}){
                const done = this.async();
                gsap.to(current.container, {duration: 1, opacity: 0, onComplete: () => done()});

            },
            beforeEnter: ({next}) => $(window).scrollTop(0),
            enter({next}){
                gsap.to(next.container, {duration: 1, opacity: 1}).delay(0.2);
                reloadJs("./src/popup.js");
                reloadJs("./src/editimg.js");
            }
        },
        {
            name: "slide",
            from: {
                namespace: ['login', 'contact', 'calander', 'upload']
            },
            to: {
                namespace: ['home']
            },
            leave: ({current}) => gsap.to(current.container, {duration: 1, x: "100%"}),
            beforeEnter: ({next}) => {
                var intro = $(next.container).find(".intro");
                var pattern = $(next.container).find(".pattern");
                var header = $(next.container).find(".header");
                gsap.set(intro, {height: 0});
                gsap.set(pattern,{opacity: 1});
                gsap.set(header, {opacity: 1});
                $(window).scrollTop(0);
            },
            enter: ({next}) => {
                const tl = gsap.timeline();
                tl.set($(next.container).find(".intro"), {opacity: 1})
                  .from(next.container, {duration: 1.5, xPercent: -100, clearProps: "all"});
                home();
                reloadJs("./src/scroll.js");
                reloadJs("./src/popup.js");
            }
        }
    ]
});



  barba.hooks.once(() => {
    gsap.to(".navigation__button, .social_media", {duration: 0.5, opacity: 1, delay: 0.7});
  });