jQuery(document).on('click', '._show-gdpr-modal', function(e) {
    e.preventDefault();

    let html = jQuery('#_gdpr-modal-content').html();
    jQuery('#form-gdpr-content').html(html);
    jQuery('#form-gdpr').modal('show');
})

jQuery(document).on('click', '._cms-form-submit', function (e) {
    e.preventDefault();
    var $this = jQuery(this);
    var $form = $this.closest('._cms-contact-form');
    if ($form.validate({
        rules: {
            name: "required",
            surname: "required",
            message: "required",
            email: {
                required: true,
                email: true
            },
            _restaurantId: {
                required: true
            }
        },
        messages: {
            name: I18n.t('js_contact_first_name_required'),
            surname: I18n.t('js_contact_surname_required'),
            message: I18n.t('js_contact_message_required'),
            email: I18n.t('js_contact_email_required')
        },
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },
        success: function (element) {
            element.closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    }).form()) {
        var api = new com.upmenu();
        var serialized = $form.serialize();
        if (isEmpty(com.upmenu.restaurantId)) {
            com.upmenu.restaurantId = jQuery('select[name="_restaurantId"]').val();
            if (isEmpty(com.upmenu.restaurantId)) {
                com.upmenu.restaurantId = jQuery('input[name="_restaurantId"]').val();
            }
        }
        $this.attr('disabled', true);

        api.sendEmail(serialized, function () {
            $form.prepend("<p class='alert alert-success _cms-form-success-info'>" + I18n.t('js_contact_send') + "</p>");
            $form.find('.has-success').removeClass('has-success');
            $form.find('label.error').remove();
            $($form)[0].reset();
            $this.attr('disabled', false);

            setTimeout(function(){
                var $successInfo = jQuery('._cms-form-success-info');
                $successInfo.slideUp(250, function() {
                    $successInfo.remove();
                });
            }, 3000)
        });

    }
    return false;
});

var initResponsiveTab = function() {
    let bodyVisible = setInterval(function() {
        if(jQuery('body').is(':visible')) {
            jQuery('.responsivetab').responsivetab({
                text: I18n.t('cms_responsivetab_more'),
            });
            clearInterval(bodyVisible);
        }
    },100);
}

function initMapWidget() {
    jQuery('.map-container').each(function() {
        const $this = jQuery(this);
        let id;
        let bounds = [];
        let pin = '<svg width="45" height="45" viewBox="0 0 45 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
                    '<path d="M39.3799 18.834C39.3799 31.6673 22.8799 42.6673 22.8799 42.6673C22.8799 42.6673 6.37988 31.6673 6.37988 18.834C6.37988 14.4579 8.11827 10.2611 11.2126 7.16672C14.307 4.07237 18.5038 2.33398 22.8799 2.33398C27.256 2.33398 31.4528 4.07237 34.5471 7.16672C37.6415 10.2611 39.3799 14.4579 39.3799 18.834Z" fill="currentColor"/>\n' +
                    '<path d="M22.8799 24.334C25.9174 24.334 28.3799 21.8716 28.3799 18.834C28.3799 15.7964 25.9174 13.334 22.8799 13.334C19.8423 13.334 17.3799 15.7964 17.3799 18.834C17.3799 21.8716 19.8423 24.334 22.8799 24.334Z" fill="white"/>\n' +
                  '</svg>\n';

        if($this.hasClass("leaflet-container")) {
            return;
        }

        id = $this.attr('id');

        let map = L.map(id);

        let iconPin = L.divIcon({
            className: "map-marker color-0",
            html: pin,
            iconSize:     [45, 45],
            iconAnchor:   [22.5, 45],
            popupAnchor:  [0, -45]
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        function createMarker(restaurant) {
            let lat_lng = [restaurant.latitude, restaurant.longitude];
            let marker = new L.marker(lat_lng, {icon: iconPin}).addTo(map);
            bounds.push(lat_lng);

            let popup = new L.Popup({ autoClose: false, closeOnClick: false })
                .setContent('<b>'+restaurant.name +'</b><br>'+restaurant.formattedAddress)
                .setLatLng([restaurant.latitude, restaurant.longitude]);
            marker.bindPopup(popup);
        }

        if(com.upmenu.restaurant) {
            if(com.upmenu.restaurant.latitude) {
                createMarker(com.upmenu.restaurant);
            }
            else {
                map.setView(L.latLng(51.78, 19.46), 5);
            }
        }
        else if(com.upmenu.restaurants) {
            for(let restaurant of com.upmenu.restaurants) {
                if(restaurant.latitude) {
                    createMarker(restaurant);
                }
            }
        }

        if(bounds.length !== 0) {
            map.fitBounds(bounds, {
                padding: [20,20]
            });
        }

        setTimeout(function() {
            map.invalidateSize(true);
        }, 300);
    })
}

function initReservationsWidget() {
    if(jQuery('._booking-form-wrapper').length > 0) {
        if(com.upmenu.restaurants.length > 1) {
            api._loadReservationForm();
        } else {
            api._loadReservationForm(com.upmenu.restaurantId);
        }
    }
}

function initPromotionsSlider() {
    const $promotionsSlider = jQuery('._promotions-slider');
    $promotionsSlider.owlCarousel({
        items: 3,
        margin: 24,
        dots: false,
        nav: false,
        loop: true,
        responsive: {
            0: {
                items: 1,
                stagePadding: 50,
                autoHeight: true
            },
            560: {
                items: 2,
                stagePadding: 50,
                autoHeight: true
            },
            768: {
                items: 2,
                autoHeight: false
            },
            1200: {
                items: 3
            }
        }
    });

    jQuery(document).on('click', '.promotionPrev', function() {
        $promotionsSlider.trigger('prev.owl.carousel');
    });

    jQuery(document).on('click', '.promotionNext', function() {
        $promotionsSlider.trigger('next.owl.carousel');
    });
}

function loadGoogleFontsCmsv4(fonts) {
    const removeDuplicates = function(array) {
        var unique = [];
        for (var i = 0; i < array.length; i++) {
            var current = array[i];
            if (unique.indexOf(current) < 0) unique.push(current);
        }
        return unique;
    };

    fonts = removeDuplicates(fonts);

    let fontsToLoad = [];

    for(let f in fonts) {
        let load = true;
        let googleFont = '';
        for(let df in defaultFonts) {
            if(fonts[f] === '' || fonts[f] === defaultFonts[df].name) {
                load = false;
            }
        }
        for (let gf in googleWebfonts) {
            if(googleWebfonts[gf].name === fonts[f]) {
                googleFont = googleWebfonts[gf].family;
            }
        }
        if(load) fontsToLoad.push(googleFont);
    }

    if(fontsToLoad.length === 0) return;

    WebFont.load({
        google: {
            families: fontsToLoad
        }
    });
}

var initPlugins = function() {
    AOS.init();

    setupPhoneInput('phone');
    jQuery('.owl-carousel').each(function() {
        const $carousel = jQuery(this);
        const columns = $carousel.data('columns');

        $carousel.owlCarousel({
            items: columns,
            margin: 24,
            dots: false,
            nav: true,
            navText: [
                '<i class="feather-icon icon-chevron-left"></i>',
                '<i class="feather-icon icon-chevron-right"></i>'
            ],
            lazyLoad: true,
            responsive: {
                0: { items: 2 },
                768: { items: 3 },
                992: { items: columns }
            },
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true
        });
    });

    jQuery('.grid-masonry').each(function() {
        var $this = jQuery(this);
        var columns = $this.data('columns');

        $this.masonryGrid({
            'columns': columns
        });
    })

    jQuery('.theme-page-section:not(.editable-section) .gallery-holder .row-grid').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeBtnInside: false,
        mainClass: 'mfp-fade',
        image: {
            verticalFit: true
        },
        gallery: {
            enabled: true
        }
    });

    initMapWidget();

    initReservationsWidget();

    if(!isMobile()) {
        initResponsiveTab();
    }
}

var initCustomerNav = function() {
    if (jQuery('.main-navigation .theme-nav-customer-account').length) {
        var model = $.extend({}, {}, {
            customer: com.upmenu.customer,
            aside: false
        });
        var source = jQuery("#cms4-pageHeader-page-account-html").html();
        var template = Handlebars.compile(source, com.upmenu.Templates.getOptions());
        var html = template(model);
        jQuery(".main-navigation .theme-nav-customer-account").replaceWith(html);
    }

    if (jQuery('.aside-navigation .theme-nav-customer-account-mobile').length) {
        var model = $.extend({}, {}, {
            customer: com.upmenu.customer,
            aside: true
        });
        var source = jQuery("#cms4-pageHeader-page-account-mobile-html").html();
        var template = Handlebars.compile(source, com.upmenu.Templates.getOptions());
        var html = template(model);
        jQuery(".aside-navigation .theme-nav-customer-account-mobile").replaceWith(html);
    }
}

function setPopupCookie(popup) {
    var expires;
    if (popup.frequency === 'once') {
        expires = 3650;
        jQuery.cookie('popupV2-' + popup.id, true, { expires: expires, path: '/' });
    } else {
        var multiplier;
        switch (popup.frequencySpan) {
            case 'hours':
                multiplier = 1 / 24;
                break;
            case 'days':
                multiplier = 1;
                break;
            case 'weeks':
                multiplier = 7;
                break;
            case 'months':
                multiplier = 30;
                break;
        }
        var expDate = new Date();
        expires = popup.frequencyValue * multiplier * 24 * 60 * 60 * 1000;
        expDate.setTime(expDate.getTime() + expires);

        jQuery.cookie('popupV2-' + popup.id, true, { expires: expDate, path: '/' });
    }
}

function getPopupCookie(popup) {
    var cookie = jQuery.cookie('popupV2-' + popup.id);
    return cookie != null;
}

var initPopups = function() {
    if(com.upmenu.editMode) return;

    var popupsList = com.upmenu.theme_JSON.popups.filter(popup => (
        popup.status === "Active"
    ) && (
        popup.restaurant === "" || (popup.restaurant !== "" && popup.restaurant.includes(com.upmenu.restaurantId))
    ) && (
        popup.pageType === "all" || (popup.pageType !== "all" && popup.page.includes(com.upmenu.pageId))
    ) && (
        moment(popup.dateStart).valueOf() <= Date.now() &&
        (popup.time !== "timespan" || moment(popup.dateEnd).valueOf() >= Date.now())
    ) && (
        !getPopupCookie(popup)
    ));

    if(popupsList.length > 0) {
        com.upmenu.Templates.popupsModal(popupsList, function() {
            if(popupsList.length > 1) {
                jQuery('.popups-holder').addClass('owl-carousel').owlCarousel({
                    items: 1,
                    margin: 0,
                    autoHeight: true,
                    loop: true,
                    dots: false,
                    autoplay: false,
                    autoplayHoverPause: true,
                    mouseDrag: false,
                    touchDrag: false,
                    nav: true,
                    navText: ['<i class="feather-icon icon-arrow-left v-middle m-t-n-3xxs"></i>','<i class="feather-icon icon-arrow-right v-middle m-t-n-3xxs"></i>']
                });
            }

            setTimeout(function() {
                $('#cms4-popups').modal();

                popupsList.forEach(function(popup) {
                    setPopupCookie(popup);
                });
            }, 2000);
        })
    }
}

function onPageResize() {
    if(!isMobile()) {
        initResponsiveTab();
    }
}

jQuery(document).on('click', '._toggle-aside-nav', function(e) {
    e.preventDefault();

    jQuery('.aside-navigation').toggleClass('active');
    jQuery('body').toggleClass('modal-open');
});

jQuery(document).on('click', '._play-yt-video', function() {
    var $this = jQuery(this);
    var $player = $this.closest('.video-widget').find('iframe');

    $this.fadeOut();
    $player.attr('src', $player.attr('src') + '&autoplay=1');
});

jQuery(window).on('resize', () => onPageResize());

jQuery(window).on('load', function() {
    initResponsiveTab();
});

jQuery(document).on('ready', function() {
    loadGoogleFontsCmsv4([com.upmenu.theme_JSON.globalStyles.fontFamily, com.upmenu.theme_JSON.globalStyles.headings.fontFamily]);
    initPopups();
    initPlugins();
    initCustomerNav();

    jQuery(window).trigger('resize');
});

jQuery('._show-cookies-settings').click( function(e) {
    e.preventDefault();
    jQuery('.cky-btn-revisit').trigger('click');
});