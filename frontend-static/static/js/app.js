// Template Name: Nexus
// Description:  Nexus - Digital Agency HTML Template
// Version: 1.0.0
// ==========================================================
// Detect mobile device and add class "is-mobile" to </body>
// ==========================================================

// Detect mobile device (Do not remove!!!)
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(navigator.userAgent) ? true : false;

// Add class "is-mobile" to </body>
if (isMobile) {
    $("body").addClass("is-mobile");
}

(function (window, document, $, undefined) {
    "use strict";
    var Init = {
        i: function (e) {
            Init.s();
            Init.methods();
        },
        s: function (e) {
            (this._window = $(window)),
                (this._document = $(document)),
                (this._body = $("body")),
                (this._html = $("html"));
        },
        methods: function (e) {
            Init.w();
            Init.preloader();
            Init.magicCursor();
            Init.niceSelect();
            Init.gsap();
            Init.moveCard();
            Init.onPage();
            Init.process();
            Init.headerMenu();
            Init.feedbackSlider();
            Init.fileInput();
            Init.smooth();
            Init.slick();
            Init.formValidation();
            Init.countdownInit(".countdown", "2025/07/01");
            Init.contactForm();
            Init.scrollToTop();
        },

        w: function (e) {
            this._window.on("load", Init.l).on("scroll", Init.res);
        },

        // =======================
        //  Preloader
        // =======================
        preloader: function () {
            setTimeout(function () { $('.preloader').hide('slow') }, 2000);
        },
        // =======================
        //  Process
        // =======================
        process: function () {
            $('.block').on('click', function () {
                var id = $(this).attr("id");
                $('.block').removeClass('active');
                $(this).addClass('active');
                $('.process-image').hide('slow');
                $('.' + id).show('slow');
            })
        },
        // =======================
        //  Nice Select
        // =======================
        niceSelect: function () {
            if ($(".has-nice-select").length) {
                $('.has-nice-select, .contact-form select').niceSelect();
            }
        },
        // =======================================================================================
        // Magic cursor (no effect on small screens!)
        // https://codepen.io/Sahil89/pen/MQbdNR
        // https://greensock.com/forums/topic/17490-follow-button-effect/?tab=comments#comment-81107
        // =======================================================================================
        magicCursor: function () {

            if ($("body").not(".is-mobile").hasClass("tt-magic-cursor")) {
                if ($(window).width() > 1024) {
                    $(".magnetic-item").wrap('<div class="magnetic-wrap"></div>');

                    if ($("a.magnetic-item").length) {
                        $("a.magnetic-item").addClass("not-hide-cursor");
                    }

                    var $mouse = { x: 0, y: 0 }; // Cursor position
                    var $pos = { x: 0, y: 0 }; // Cursor position
                    var $ratio = 0.15; // delay follow cursor
                    var $active = false;
                    var $ball = $("#ball");

                    var $ballWidth = 34; // Ball default width
                    var $ballHeight = 34; // Ball default height
                    var $ballScale = 1; // Ball default scale
                    var $ballOpacity = 0.5; // Ball default opacity
                    var $ballBorderWidth = 2; // Ball default border width

                    gsap.set($ball, {  // scale from middle and style ball
                        xPercent: -50,
                        yPercent: -50,
                        width: $ballWidth,
                        height: $ballHeight,
                        borderWidth: $ballBorderWidth,
                        opacity: $ballOpacity
                    });

                    document.addEventListener("mousemove", mouseMove);

                    function mouseMove(e) {
                        $mouse.x = e.clientX;
                        $mouse.y = e.clientY;
                    }

                    gsap.ticker.add(updatePosition);

                    function updatePosition() {
                        if (!$active) {
                            $pos.x += ($mouse.x - $pos.x) * $ratio;
                            $pos.y += ($mouse.y - $pos.y) * $ratio;

                            gsap.set($ball, { x: $pos.x, y: $pos.y });
                        }
                    }

                    $(".magnetic-wrap").mousemove(function (e) {
                        parallaxCursor(e, this, 2); // magnetic ball = low number is more attractive
                        callParallax(e, this);
                    });

                    function callParallax(e, parent) {
                        parallaxIt(e, parent, parent.querySelector(".magnetic-item"), 25); // magnetic area = higher number is more attractive
                    }

                    function parallaxIt(e, parent, target, movement) {
                        var boundingRect = parent.getBoundingClientRect();
                        var relX = e.clientX - boundingRect.left;
                        var relY = e.clientY - boundingRect.top;

                        gsap.to(target, {
                            duration: 0.3,
                            x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
                            y: ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
                            ease: Power2.easeOut
                        });
                    }

                    function parallaxCursor(e, parent, movement) {
                        var rect = parent.getBoundingClientRect();
                        var relX = e.clientX - rect.left;
                        var relY = e.clientY - rect.top;
                        $pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
                        $pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
                        gsap.to($ball, { duration: 0.3, x: $pos.x, y: $pos.y });
                    }


                    // Magic cursor behavior
                    // ======================

                    // Magnetic item hover.
                    $(".magnetic-wrap").on("mouseenter", function (e) {
                        gsap.to($ball, { duration: 0.3, scale: 2, borderWidth: 1, opacity: $ballOpacity });
                        $active = true;
                    }).on("mouseleave", function (e) {
                        gsap.to($ball, { duration: 0.3, scale: $ballScale, borderWidth: $ballBorderWidth, opacity: $ballOpacity });
                        gsap.to(this.querySelector(".magnetic-item"), { duration: 0.3, x: 0, y: 0, clearProps: "all" });
                        $active = false;
                    });

                    // Alternative cursor style on hover.
                    $(".cursor-alter, .tt-main-menu-list > li > a, .tt-main-menu-list > li > .tt-submenu-trigger > a")
                        .not(".magnetic-item") // omit from selection.
                        .on("mouseenter", function () {
                            gsap.to($ball, {
                                duration: 0.3,
                                borderWidth: 0,
                                opacity: 0.2,
                                backgroundColor: "#CCC",
                                width: "100px",
                                height: "100px",
                            });
                        }).on("mouseleave", function () {
                            gsap.to($ball, {
                                duration: 0.3,
                                borderWidth: $ballBorderWidth,
                                opacity: $ballOpacity,
                                backgroundColor: "transparent",
                                width: $ballWidth,
                                height: $ballHeight,
                                clearProps: "backgroundColor"
                            });
                        });

                    // Overlay menu caret hover.
                    $(".tt-ol-submenu-caret-wrap .magnetic-wrap").on("mouseenter", function () {
                        gsap.to($ball, { duration: 0.3, scale: 1.3, borderWidth: $ballBorderWidth });
                    }).on("mouseleave", function () {
                        gsap.to($ball, { duration: 0.3, scale: $ballScale });
                    });

                    // Cursor view on hover (data attribute "data-cursor="...").
                    $("[data-cursor]").each(function () {
                        $(this).on("mouseenter", function () {
                            $ball.append('<div class="ball-view"></div>');
                            $(".ball-view").append($(this).attr("data-cursor"));
                            gsap.to(ball, { duration: 0.3, yPercent: -75, width: 95, height: 95, opacity: 1, borderWidth: 0, backgroundColor: "#FFF" });
                            gsap.to(".ball-view", { duration: 0.3, scale: 1, autoAlpha: 1 });
                        }).on("mouseleave", function () {
                            gsap.to(ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity, borderWidth: $ballBorderWidth, backgroundColor: "transparent" });
                            gsap.to(".ball-view", { duration: 0.3, scale: 0, autoAlpha: 0, clearProps: "all" });
                            $ball.find(".ball-view").remove();
                        });
                        $(this).addClass("not-hide-cursor");
                    });


                    // Cursor close on hover.
                    $(".cursor-close").each(function () {
                        $(this).on("mouseenter", function () {
                            $ball.addClass("ball-close-enabled");
                            $ball.append('<div class="ball-close">Close</div>');
                            gsap.to($ball, { duration: 0.3, yPercent: -75, width: 80, height: 80, opacity: 1 });
                            gsap.from(".ball-close", { duration: 0.3, scale: 0, autoAlpha: 0 });
                        }).on("mouseleave click", function () {
                            $ball.removeClass("ball-close-enabled");
                            gsap.to($ball, { duration: 0.3, yPercent: -50, width: $ballWidth, height: $ballHeight, opacity: $ballOpacity });
                            $ball.find(".ball-close").remove();
                        });

                        // Hover on "cursor-close" inner elements.
                        $(".cursor-close a, .cursor-close button, .cursor-close .tt-btn, .cursor-close .hide-cursor")
                            .not(".not-hide-cursor") // omit from selection (class "not-hide-cursor" is for global use).
                            .on("mouseenter", function () {
                                $ball.removeClass("ball-close-enabled");
                            }).on("mouseleave", function () {
                                $ball.addClass("ball-close-enabled");
                            });
                    });



                    // Show/hide magic cursor
                    // =======================

                    // Hide on hover.
                    $("a, button, .cus-btn, .cus-btn-sec, .form-group, .custom-checkbox, .hide-cursor") // class "hide-cursor" is for global use.
                        .not(".not-hide-cursor") // omit from selection (class "not-hide-cursor" is for global use).
                        .not(".cursor-alter") // omit from selection
                        .not(".tt-main-menu-list > li > a") // omit from selection
                        .not(".tt-main-menu-list > li > .tt-submenu-trigger > a") // omit from selection
                        .on("mouseenter", function () {
                            gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
                        }).on("mouseleave", function () {
                            gsap.to($ball, { duration: 0.3, scale: $ballScale, opacity: $ballOpacity });
                        });

                    // Hide on click.
                    $("a")
                        .not('[target="_blank"]') // omit from selection.
                        .not('[href^="#"]') // omit from selection.
                        .not('[href^="mailto"]') // omit from selection.
                        .not('[href^="tel"]') // omit from selection.
                        .not(".lg-trigger") // omit from selection.
                        .not(".tt-btn-disabled a") // omit from selection.
                        .on('click', function () {
                            gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
                        });

                    // Show/hide on document leave/enter.
                    $(document).on("mouseleave", function () {
                        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
                    }).on("mouseenter", function () {
                        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
                    });

                    // Show as the mouse moves.
                    $(document).mousemove(function () {
                        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
                    });
                }
            }
        },

        // =======================
        //  Move Card
        // =======================
        moveCard: function () {
            document.addEventListener("DOMContentLoaded", () => {
                const slider = document.querySelector(".slider");

                function moveCard() {
                    const lastItem = slider.querySelector(".item:last-child");

                    if (slider && lastItem) {
                        slider.insertBefore(lastItem, slider.firstChild);
                    }
                }

                function animateSlider() {
                    let state = Flip.getState(".item");
                    moveCard();

                    Flip.from(state, {
                        targets: ".item",
                        ease: "sine.inOut",
                        absolute: true,
                        onEnter: (elements) => {
                            return gsap.from(elements, {
                                yPercent: 20,
                                opacity: 0,
                                ease: "sine.out"
                            });
                        },
                        onLeave: (elements) => {
                            return gsap.to(elements, {
                                yPercent: -20,
                                xPercent: 0,
                                transformOrigin: "bottom left",
                                opacity: 0,
                                ease: "sine.out",
                                onComplete() {
                                    // No additional actions needed
                                }
                            });
                        }
                    });
                }

                if (slider) {
                    animateSlider();
                    setInterval(animateSlider, 4000);
                }
            });
        },

        // =======================================================================================
        // Smooth Scrollbar
        // Source: https://github.com/idiotWu/smooth-scrollbar/
        // =======================================================================================
        smooth: function () {
            if ($("body").hasClass("tt-smooth-scroll")) {
                // Not for mobile devices!
                if (!isMobile) {

                    var Scrollbar = window.Scrollbar;

                    // AnchorPlugin (URL with hash links load in the right position)
                    // https://github.com/idiotWu/smooth-scrollbar/issues/440
                    // ==================================
                    class AnchorPlugin extends Scrollbar.ScrollbarPlugin {
                        static pluginName = 'anchor';

                        onHashChange = () => {
                            this.jumpToHash(window.location.hash);
                        };

                        onClick = (event) => {
                            const { target } = event;
                            if (target.tagName !== 'A') {
                                return;
                            }
                            const hash = target.getAttribute('href');
                            if (!hash || hash.charAt(0) !== '#') {
                                return;
                            }
                            this.jumpToHash(hash);
                        };

                        jumpToHash = (hash) => {
                            if (!hash) {
                                return;
                            }
                            const { scrollbar } = this;
                            scrollbar.containerEl.scrollTop = 0;
                            const target = document.querySelector(hash);
                            if (target) {
                                scrollbar.scrollIntoView(target, {
                                    offsetTop: parseFloat(target.getAttribute('data-offset')) || 0 // Change to set default offset
                                });
                            }
                        };

                        onInit() {
                            this.jumpToHash(window.location.hash);
                            window.addEventListener('hashchange', this.onHashChange);
                            this.scrollbar.contentEl.addEventListener('click', this.onClick);
                        };

                        onDestory() {
                            window.removeEventListener('hashchange', this.onHashChange);
                            this.scrollbar.contentEl.removeEventListener('click', this.onClick);
                        };
                    };

                    // usage
                    Scrollbar.use(AnchorPlugin);


                    // Init Smooth Scrollbar
                    // ======================
                    Scrollbar.init(document.querySelector("#scroll-container"), {
                        damping: 0.06,
                        renderByPixel: true,
                        continuousScrolling: true,
                        alwaysShowTracks: true
                    });


                    // // 3rd party library setup
                    // // More info: https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy()
                    // // ========================
                    // let scrollPositionX = 0,
                    //     scrollPositionY = 0,
                    //     bodyScrollBar = Scrollbar.init(document.getElementById("scroll-container"));

                    // bodyScrollBar.addListener(({ offset }) => {
                    //     scrollPositionX = offset.x;
                    //     scrollPositionY = offset.y;
                    // });

                    // bodyScrollBar.setPosition(0, 0);
                    // bodyScrollBar.track.xAxis.element.remove();

                    // // tell ScrollTrigger to use these proxy getter/setter methods for the "body" element:
                    // ScrollTrigger.scrollerProxy("body", {
                    //     scrollTop(value) {
                    //         if (arguments.length) {
                    //             bodyScrollBar.scrollTop = value;
                    //         }
                    //         return bodyScrollBar.scrollTop;
                    //     }
                    // });

                    // // when smooth scroller updates, tell ScrollTrigger to update() too. 
                    // bodyScrollBar.addListener(ScrollTrigger.update);


                    // Move "tt-header" out of "scroll-container"
                    // Expl: Since Smooth Scrollbar doesn't support element fixed position inside "scroll-container" move the "tt-header" out of it.
                    // ==========================================
                    if ($("#tt-header").hasClass("tt-header-fixed")) {
                        $("#tt-header").prependTo($("#body-inner"));
                    }


                    // Enable regular scrollbar inside a smooth scrollbar (#scroll-container). IMPORTANT: use class "tt-overflow" on inside scroll elements!
                    // ===================================================
                    if ($(".tt-overflow").length) {
                        // Determine if an element is scrollable
                        $.fn.ttIsScrollable = function () {
                            return this[0].scrollWidth > this[0].clientWidth || this[0].scrollHeight > this[0].clientHeight;
                        };

                        $(".tt-overflow").each(function () {
                            var $this = $(this);
                            if ($this.ttIsScrollable()) {
                                $this.on("wheel", function (e) {
                                    e.stopPropagation();
                                });
                            }
                        });
                    }


                    // Prevent input[type=number] to scroll on focus 
                    // ==============================================
                    $("input[type=number]").on("focus", function () {
                        $(this).on("wheel", function (e) {
                            e.stopPropagation();
                        });
                    });

                }
            }
        },


        // =======================
        //  GSAP Animations
        // =======================
        gsap: function () {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            //// mobile Nav
            $("#mobile-nav").on("click", function () {
                $(this).addClass("visible");
                var isVisible = $(this).attr("data-visible") === "true";

                if (!isVisible) {
                    gsap.to($(".mobile_menu__list"), { height: "255px" });
                    $(this).attr("data-visible", "true");
                } else {
                    gsap.to($(".mobile_menu__list"), { height: "0px" });
                    $(this).removeClass("visible");
                    $(this).attr("data-visible", "false");
                }
            });

            $('.mobile-nav-link').on('click', function () {
                var target = $(this).attr("data-click")
                gsap.to($(".mobile_menu__list"), { height: "0px" });
                $('#mobile-nav').removeClass("visible");
                $('#mobile-nav').attr("data-visible", "false");
                $("." + target).animate({ left: "8px" }, "slow");
            });

        },

        // ================================================================
        // Scroll to top 
        // Requires "GSAP ScrollToPlugin" (https://greensock.com/docs/v2/Plugins/ScrollToPlugin)
        // ================================================================
        scrollToTop: function () {  
            $(".scroll-to-top").on("click", function () {
                if (!isMobile) { // Not for mobile devices!
                    if ($("body").hasClass("tt-smooth-scroll")) {
                        var $scrollbar = Scrollbar.init(document.getElementById("scroll-container"));
                        gsap.to($scrollbar, { duration: 1.5, scrollTo: { y: 0, autoKill: true }, ease: Expo.easeInOut });
                    } else {
                        $("html,body").animate({ scrollTop: 0 }, 800);
                    }
                } else {
                    $("html,body").animate({ scrollTop: 0 }, 800);
                }
                return false;
            });
        },


        // =======================
        // Header Menu
        // =======================
        headerMenu: function () {
            if (window.innerWidth > 1199) {
                $(".hamburger").hover(function () {
                    $('.menu__block').addClass('menu-active')
                    $(this).addClass("show");
                });
                $('.toggle-menu').mouseleave(function () {
                    $('.menu__block').removeClass('menu-active')
                    $('.hamburger').removeClass('show')
                });
            } else {
                $(".hamburger").click(function () {
                    $('.menu__block').toggleClass('menu-active')
                    $(this).toggleClass("show hamburger-close");
                });
                $('.hamburger-close').on('click', function () {
                    $('.menu__block').removeClass('menu-active')
                    $('.hamburger').removeClass('show hamburger-close')
                });
            }
            if (window.innerWidth > 1199) {
                $(".dropdown a").hover(function () {
                    $('.dropdown').addClass('dropdown-active')
                });
                $('.toggle-menu-2, toggle-menu').mouseleave(function () {
                    $('.dropdown').removeClass('dropdown-active')
                });

            } else {
                $(".dropdown a").click(function () {
                    $('.dropdown').toggleClass('dropdown-active')
                    $(this).toggleClass("show hamburger-close");
                });

            }
        },
        onPage: function () {
            window.onpageshow = function (event) {
                if (event.persisted) {
                    window.location.reload();
                }
            }
        },
        // Feedback Slider 
        feedbackSlider: function () {
            $('a[data-slide]').click(function (e) {
                e.preventDefault();
                var slideno = $(this).data('slide');
                $('.feedback-user-nav').slick('slickGoTo', slideno - 1);
                $('a[data-slide]').removeClass('active');
                $(this).addClass('active');
            });
        },
        // Custom File Input 
        fileInput: function () {
            var $fileInput = $('.file-input');
            var $droparea = $('.file-drop-area');

            // highlight drag area
            $fileInput.on('dragenter focus click', function () {
                $droparea.addClass('is-active');
            });

            // back to normal state
            $fileInput.on('dragleave blur drop', function () {
                $droparea.removeClass('is-active');
            });

            // change inner text
            $fileInput.on('change', function () {
                var filesCount = $(this)[0].files.length;
                var $textContainer = $(this).prev();

                if (filesCount === 1) {
                    // if single file is selected, show file name
                    var fileName = $(this).val().split('\\').pop();
                    $textContainer.text(fileName);
                } else {
                    // otherwise show number of files
                    $textContainer.text(filesCount + ' files selected');
                }
            });
        },
        // Slick 
        slick: function (e) {
            if ($(".brands-slider").length) {
                $('.brands-slider').slick({
                    slidesToShow: 7,
                    arrows: false,
                    dots: false,
                    infinite: true,
                    autoplay: true,
                    cssEase: "linear",
                    autoplaySpeed: 0,
                    speed: 6000,
                    pauseOnFocus: false,
                    pauseOnHover: false,
                    responsive: [
                        {
                            breakpoint: 1599,
                            settings: {
                                slidesToShow: 6,
                            },
                        },
                        {
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 5,
                            },
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 4,
                            },
                        },
                        {
                            breakpoint: 575,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                    ],
                });
            }
            if ($(".feedback-slider").length) {
                $(".feedback-slider").slick({
                    slidesToShow: 1,
                    arrows: false,
                    dots: false,
                    infinite: true,
                    autoplay: true,
                    autoplay: true,
                    variableWidth: true,
                    autoplaySpeed: 3000,
                    speed: 600,
                    responsive: [
                        {
                            breakpoint: 650,
                            settings: {
                                variableWidth: false,
                            },
                        },
                    ],
                });
            }
            if ($(".feedback-user-nav").length) {
                $(".feedback-user-nav").slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: ".feedback-slider",
                    variableWidth: true,
                    dots: false,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    arrows: false,
                    infinity: true,
                    centerMode: false,
                    focusOnSelect: true,
                });
            }
        },
        // form Validation 
        formValidation: function () {
            if ($(".contact-form").length) {
                $(".contact-form").validate();
            }
        },
        //  Coming Soon Countdown
        countdownInit: function (countdownSelector, countdownTime) {
            var eventCounter = $(countdownSelector);
            if (eventCounter.length) {
                eventCounter.countdown(countdownTime, function (e) {
                    $(this).html(
                        e.strftime(
                            '<li><h4>%D</h4><p>Days</p></li>\
                            <li><h4>%H</h4><p>Hrs</p></li>\
                            <li><h4>%M</h4><p>Min</p></li>\
                            <li><h4>%S</h4><p>Sec</p></li>'
                        )
                    );
                });
            }
        },
        // contact Form
        contactForm: function () {
            $(".contact-form").on("submit", function (e) {
                e.preventDefault();
                if ($(".contact-form").valid()) {
                    var _self = $(this);
                    _self
                        .closest("div")
                        .find('button[type="submit"]')
                        .attr("disabled", "disabled");
                    var data = $(this).serialize();
                    $.ajax({
                        url: "./assets/mail/contact.php",
                        type: "post",
                        dataType: "json",
                        data: data,
                        success: function (data) {
                            $(".contact-form").trigger("reset");
                            _self.find('button[type="submit"]').removeAttr("disabled");
                            if (data.success) {
                                document.getElementById("message").innerHTML =
                                    "<h5 class='text-success mt-3 mb-2'>Email Sent Successfully</h5>";
                            } else {
                                document.getElementById("message").innerHTML =
                                    "<h5 class='text-danger mt-3 mb-2'>There is an error</h5>";
                            }
                            $("#message").show("slow");
                            $("#message").slideDown("slow");
                            setTimeout(function () {
                                $("#message").slideUp("hide");
                                $("#message").hide("slow");
                            }, 3000);
                        },
                    });
                } else {
                    return false;
                }
            });
        },
    };
    Init.i();
})(window, document, jQuery);
