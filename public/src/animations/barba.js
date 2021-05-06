import {default as barba} from "../core.js";
import {default as barbaPrefetch} from "../prefetch.js";

function reloadJs(src) {
    src = $('script[src$="' + src + '"]').attr("src");
    $('script[src$="' + src + '"]').remove();
    $('<script/>').attr('src', src).appendTo('footer');
}

// function insertScript(src) {
//     var s = document.createElement('script');

//     s.setAttribute('src', src);
//     document.body.appendChild(s);
// }

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
            gsap.from(".service__card--4", {
                scrollTrigger: {
                    trigger: ".service__card--4",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--5", {
                scrollTrigger: {
                    trigger: ".service__card--5",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--6", {
                scrollTrigger: {
                    trigger: ".service__card--6",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--7", {
                scrollTrigger: {
                    trigger: ".service__card--7",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });
            gsap.from(".service__card--8", {
                scrollTrigger: {
                    trigger: ".service__card--8",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });

            // About top section timeline
            let a_tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about__top",
                    start: "top center"
                }
            });

            a_tl.from(".about__top__title", {
                opacity: 0,
                duration: 2
            },)
            .from(".about__top-load", {
                width: 0,
                duration: 2
            }, "-=1.5");

            gsap.from(".about__bottom-1", {
                scrollTrigger: {
                    trigger: ".about__bottom-1",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });

            gsap.from(".about__bottom-2", {
                scrollTrigger: {
                    trigger: ".about__bottom-2",
                    start: "top center"
                },
                opacity: 0,
                duration: 1
            });

            gsap.from(".about__bottom-3", {
                scrollTrigger: {
                    trigger: ".about__bottom-3",
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

            // About top section timeline
            let a_tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".about__top",
                    start: "top center"
                }
            });

            a_tl.from(".about__top__title", {
                opacity: 0,
                duration: 2
            },)
            .from(".about__top-load", {
                width: 0,
                duration: 2
            }, "-=1.5")
            .from(".about__bottom-1", {
                opacity: 0,
                duration: 1
            }, "-=1.5")
            .from(".about__bottom-2", {
                opacity: 0,
                duration: 1
            }, "-=.7")
            .from(".about__bottom-3", {
                opacity: 0,
                duration: 1
            }, "-=.5");
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

            gsap.from(".service__title-load", {
                scrollTrigger: {
                    trigger: ".service__title",
                    start: "center center"
                },
                width: 0,
                duration: 2, delay: 0.8
            });
        }
    });
}

barba.use(barbaPrefetch);

barba.init({
    timeout: 10000,
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
                reloadJs("./src/popup.js");
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
                namespace: ['login', 'contact', 'calander', 'upload', 'portfolio']
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
            to: {
                namespace: ['edit', 'edit-project']
            },
            once({next}) {

                let snap_tl = gsap.timeline({paused: true});
                snap_tl.to("#edit-input", {duration: 0.2, marginTop: 35, ease: Sine.easeInOut});
                const tl = gsap.timeline();
                
                $(".delete-project__icon").hover(function() {
                    console.log("ehllo");
                    snap_tl.play();
                }, function() {
                    console.log("ehllo");
                    snap_tl.reverse();
                });
                
                tl.to(next.container, {duration: 1, opacity: 1}).delay(0.5);
            },
            leave({current}) {
                const done = this.async();
                gsap.to(current.container, {duration: 1, opacity: 0, onComplete: () => done()});
            },
            enter({next}) {
                $(window).scrollTop(0);
                let snap_tl = gsap.timeline({paused: true});
                snap_tl.to("#edit-input", {duration: 0.2, marginTop: 35, ease: Sine.easeInOut});
                const tl = gsap.timeline();

                $(".delete-project__icon").hover(function() {
                    snap_tl.play();
                }, function() {
                    snap_tl.reverse();
                });
                tl.to(next.container, {duration: 1, opacity: 1}).delay(0.2);
                reloadJs("./src/edit-project.js");
                reloadJs("./src/edit.js");
            }
        },
        {
            to: {
                namespace: ['project']
            },
            
            once({next}) {
                const tl = gsap.timeline();
                tl.to(next.container, {duration: 1, opacity: 1}).delay(0.5)
                  .to('.project-root__title', {duration: 1, opacity: 1}, 0)
                  .from('.project-root__title', {duration: 1, yPercent: 50}, 0)
                  .from('.project-root__gallery-photo', {duration: 1, xPercent: -101, stagger: 0.2}, '-=.5');
            },
            leave({current}) {
                const done = this.async();
                gsap.to(current.container, {duration: 1, opacity: 0, onComplete: () => done()});
            },
            beforeEnter: ({next}) => {$(window).scrollTop(0)},  
            enter({next}){
                $(window).scrollTop(0);
                const tl = gsap.timeline();
                tl.to(next.container, {duration: 1, opacity: 1}).delay(0.2)
                  .to('.project-root__title', {duration: 1, opacity: 1}, 0)
                  .from('.project-root__title', {duration: 1, yPercent: 50}, 0)
                  .from('.project-root__gallery-photo', {duration: 1, xPercent: -101, stagger: 0.2}, '-=.5');
                reloadJs("./src/popup.js");
                reloadJs("./src/editimg.js");
            }
        },
        {
            name: "slide",
            from: {
                namespace: ['login', 'contact', 'calander', 'upload', 'portfolio', 'novato', 'san-rafael', 'stinson-beach', 'valencia-st', 'project']
            },
            to: {
                namespace: ['home']
            },
            leave: ({current}) => gsap.to(current.container, {duration: 1, opacity: 0}),
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
                  .from(next.container, {duration: 1.5, opacity: 0, clearProps: "all"});
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