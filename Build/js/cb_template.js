document.addEventListener("DOMContentLoaded", function(event) {
    /**
     * Zoom for Devices with viewport width 320px
     */
    let g = document.documentElement.clientWidth;
    let f = document.querySelector("meta[name=viewport]");

    if (g < 768 && f) {
        f.setAttribute("content", "width=360, maximum-scale=1.0, user-scalable=0");
    }
    if (g < 1280 && f) {
        f.setAttribute('content', 'width=device-width,initial-scale=1.0,maximum-scale=10.0,user-scalable=1');
    }

    // mobile menu starts
    let $navIcon = document.getElementById('nav-icon');

    if ($navIcon.offsetParent !== 0) {
        let navMenu = document.getElementById('menu-main');
        let menu = document.querySelector('.menu-main');

        $navIcon.addEventListener("click", function () {
            $navIcon.classList.toggle('open');
            menu.classList.toggle('d-none');

            if (!navMenu.classList.contains('open')) {
                navMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            }  else {
                navMenu.classList.remove('open');
                document.body.style.overflow = null;
            }
        });

        let $subMenuOpener = document.querySelectorAll('.w-submenu__opener');

        $subMenuOpener.forEach((subMenuOpener) => {
            subMenuOpener.addEventListener('click', function () {
                let mainSub = subMenuOpener.closest('.menu-main_item.lvl1').querySelector('.menu-main__sub.lvl2');

                subMenuOpener.classList.toggle('open');
                mainSub.classList.toggle('open');

            });
        });

        let $menuMainActiveSwitcherMobile = document.querySelectorAll('.menu-main_item.lvl1.w-submenu');
        for (let i = 0, len = $menuMainActiveSwitcherMobile.length; i < len; i++) {
            if ($menuMainActiveSwitcherMobile[i].classList.contains('active')) {
                $menuMainActiveSwitcherMobile[i].querySelector('.menu-main__sub.lvl2').classList.add('open');
            } else {
                $menuMainActiveSwitcherMobile[i].querySelector('.menu-main__sub.lvl2').classList.remove('open');
            }
        }

    }
    // mobile menu ends

    document.addEventListener('scroll', function () {
        let headerEl = document.querySelector(".header");
        let body = document.body;
        let scrollUp;
        let scrollDown;
        if (g < 768 && f) {
            scrollDown = 80;
            scrollUp = 100;
        }
        if (g > 1023 && f) {
            scrollDown = 100;
            scrollUp = 120;
        }
        if (typeof (headerEl) != 'undefined' && headerEl != null) {
            headerScrollFunc(headerEl, body, scrollDown, scrollUp);
        }
    });
    function headerScrollFunc(headerEl, body, scrollDown, scrollUp) {
        if (document.body.scrollTop > scrollDown || document.documentElement.scrollTop > scrollUp) {
            headerEl.classList.add("header-small");
            body.classList.add("header-is-small");
        } else {
            headerEl.classList.remove("header-small");
            body.classList.remove("header-is-small");
        }
    }

    let slider = document.getElementById("splide");

    if (typeof (slider) != 'undefined' && slider != null)
    {
        new Splide('#splide', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            autoplay: true,
            interval: 8000,
            updateOnMove: true,
            pagination: false,
            throttle: 300,
            breakpoints: {
                1440: {
                    perPage: 2,
                },
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    }

    let imageSlider = document.getElementById("imageSlide");

    if (typeof (imageSlider) != 'undefined' && imageSlider != null)
    {
        new Splide('#imageSlide', {
            type: 'loop',
            perPage: 4,
            perMove: 1,
            autoplay: false,
            interval: 8000,
            updateOnMove: true,
            pagination: false,
            throttle: 300,
            breakpoints: {
                1440: {
                    perPage: 1,
                }
            }
        }).mount();
    }

    GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
        selector: ".glightbox"
    });
    const lightbox = GLightbox({
        openEffect: "zoom",
        closeEffect: "fade",
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });


    function setHeight(el, val) {
        if (typeof val === "function") val = val();
        if (typeof val === "string") el.style.height = val;
        else el.style.height = val + "px";
    }

    let equalheight = function(container){
        let currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            topPosition = 0;

        Array.from(document.querySelectorAll(container)).forEach((el,i) => {
            el.style.height = "auto";
            let topPosition = el.offsetTop;
            let currentDiv;
            if(currentRowStart !== topPosition){
                for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                    setHeight(rowDivs[currentDiv], currentTallest);
                }
                rowDivs.length = 0;
                currentRowStart = topPosition;
                currentTallest = parseFloat(getComputedStyle(el, null).height.replace("px", ""));
                rowDivs.push(el);
            } else {
                rowDivs.push(el);
                currentTallest = (currentTallest < parseFloat(getComputedStyle(el, null).height.replace("px", ""))) ? (parseFloat(getComputedStyle(el, null).height.replace("px", ""))) : (currentTallest);
            }
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                setHeight(rowDivs[currentDiv], currentTallest);
            }
        });
    };
    if (g >= 768 && f) {
        window.addEventListener("load", function(){
            equalheight('.content-column-item p');
        });
        window.addEventListener("resize", function(){
            setTimeout(function(){
                equalheight('.content-column-item p');
            });
        });
    }

});
