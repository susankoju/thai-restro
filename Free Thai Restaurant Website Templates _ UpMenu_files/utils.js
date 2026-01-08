function newEvent(siteId, restaurantId, type, description, partnersProgramId) {
    const event = {
        siteId: siteId,
        restaurantId: restaurantId,
        type: type,
        description: description,
        partnersProgramId: partnersProgramId
    };

    jQuery.ajax({
        url: '/admin/restapi/event',
        type: 'POST',
        data: JSON.stringify(event),
        contentType: 'application/json'
    });
}

function convertToText(obj) {
    var string = [];

    if (obj == undefined) {
        return String(obj);
    } else if (typeof(obj) == "object" && (obj.join == undefined)) {
        for (prop in obj) {
            if (obj.hasOwnProperty(prop))
                string.push(prop + ": " + convertToText(obj[prop]));
        }
        return "{" + string.join(",") + "}";

        //is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        for (prop in obj) {
            string.push(convertToText(obj[prop]));
        }
        return "[" + string.join(",") + "]";

        //is function
    } else if (typeof(obj) == "function") {
        string.push(obj.toString())

        //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj))
    }

    return string.join(",");
}

function setupPhoneInput(name, options, validationCallback, showDropdown) {
    if(typeof options === 'undefined') {
        options = {
            validate: false,
            initialCountry: null
        };
    }
    if (typeof showDropdown === 'undefined') {
        showDropdown = true;
    }

    var inputs = document.querySelectorAll('input[name="'+name+'"][type="tel"]');
    for(var i = 0; i < inputs.length ; i++) {
        var input = inputs[i];
        if(input.hasAttribute('data-intl-tel-input-id')) {
            continue;
        }

        if(typeof input === 'undefined' || input == null) {
            console.log('Input with name: ' + name + ' is not defined.');
            return;
        }

        var count = 0;
        var child = null;
        var findCountryCodeInput = function(input) {
            if(count >= 5) {
                console.warn('Did not found input for countryCode!');
                return;
            }

            if(child === null) {
                child = input;
            }
            var cci = jQuery(child).closest('.form-group, .form-floating').find('input[name="'+name+'CountryCode"]');
            if(cci.length === 0) {
                count++;
                child = jQuery(child).parent();
                return findCountryCodeInput(input);
            }

            return cci;
        }

        var countryCodeInput = findCountryCodeInput(input);
        var $parentFormGroup = $(input).closest('.form-group');
        if(input == null || input === 'undefined') {
            console.log('WARNING: Not found input for query selector: ' + selector);
            return;
        }

        let regionalDataUrl = '/restapi/regional/data';
        if (com.upmenu.siteId) {
            regionalDataUrl += '/' + com.upmenu.siteId;
        }

        var iti = window.intlTelInput(input, {
            utilsScript: com.upmenu.staticPath + '/vendor/intl-tel-input-19.5.7/js/utils.js',
            initialCountry: "auto",
            formatOnDisplay: true,
            containerClass: "intl-tel-input",
            showSelectedDialCode: true,
            allowDropdown: showDropdown,
            separateDialCode: true,
            geoIpLookup: function(success, failure) {
                jQuery.ajax({
                    url: regionalDataUrl,
               	    type: 'GET',
                    success: function(data) {
                        var countryCode;
                        if (typeof data === 'undefined' || data === null || data.status === "fail" || data.countryCode == null) {
                            countryCode = 'pl';
                        } else {
                            countryCode = data.countryCode.toLowerCase();
                        }

                        if (typeof countryCode === 'undefined' || countryCode == null || countryCode === "") {
                            countryCode = 'pl';
                        }
                        success(countryCode);
                        if(typeof countryCodeInput !== 'undefined' && typeof countryCodeInput.val() === 'undefined'){
                            countryCodeInput.val(countryCode);
                        }
                    },
                    error: function(data) {
                        var countryCode = 'pl';
                        success(countryCode);
                    }
                });
            },
            customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                return "";
            }
        });

        var dataPhone = input.getAttribute('data-phone');
        if(dataPhone != null && typeof dataPhone !== 'undefined') {
            iti.setNumber(dataPhone);
        }

        if(typeof countryCodeInput !== 'undefined' && typeof countryCodeInput.val() !== 'undefined' && countryCodeInput.val() != '') {
            iti.setCountry(countryCodeInput.val());
        }
        if(typeof options.initialCountry !== 'undefined' && options.initialCountry != null) {
            iti.setCountry(options.initialCountry);
        }
        jQuery(document).on('keyup', input, function() {
            if(options.validate !== 'undefined' && options.validate === true) {
                if(typeof validationCallback !== 'undefined') {
                    validationCallback($parentFormGroup, iti, input, countryCodeInput);
                }
            }
        });

        jQuery(document).on('change', input, function() {
            if(typeof validationCallback !== 'undefined') {
                validationCallback($parentFormGroup, iti, input, countryCodeInput);
            }
        });

        jQuery(input).on("countrychange", function() {
            countryCodeInput.val(iti.getSelectedCountryData().iso2);
        }).trigger('countrychange');
    }
};

function assignErrors(errors) {
    for(var i = 0; i < errors.length ; i++) {
        var helpBlock = jQuery('.error-'+errors[i].field);
        helpBlock.html(errors[i].error);
        helpBlock.parent().addClass('has-error');
        console.log('.error-'+errors[i].field, errors[i].error);
    }
}
var myEvent = null;
$(document).ready(function() {
    var ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            vKey = 86,
            cKey = 67,
            dotKey = 190,
            commaKey = 188,
            backspaceKey = 8,
            tabKey = 9,
            zeroKey = 48,
            nineKey = 57,
            zeroNumpadKey = 96,
            nineNumpadKey = 105,
            leftArrowKey = 37,
            rightArrowKey = 39,
            deleteKey = 46,
            aKey = 65,
            vKey = 86;


    function isDigitOrDecimalSeparator(key) {
        return (key >= 0 && key <= 9) || key === ',' || key === '.';
    }

    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    function isTextSelected(input) {
        var selection = window.getSelection().toString();
        return selection !== "" && input.value.includes(selection);
    }

    $(document).on('keydown', '.decimal-only', function(event) {

        var textSelected = isTextSelected(this);

        var precision = event.target.getAttribute('data-precision');
        if(typeof precision === 'undefined') {
            precision = 0;
        }

        var additionalAllowedCharacters = event.target.getAttribute('data-additional-allowed-characters');
        if(typeof additionalAllowedCharacters !== 'undefined' && additionalAllowedCharacters != null) {
            for(var i = 0; i < additionalAllowedCharacters.length; i++) {
                if(event.key === additionalAllowedCharacters[i]) {
                    return;
                } else {
                    if (event.shiftKey && !isDigitOrDecimalSeparator(event.key)) {
                        event.preventDefault();
                    }
                }
            }
        } else {
            if (event.shiftKey && !isDigitOrDecimalSeparator(event.key)) {
                event.preventDefault();
            }
        }

        if(ctrlDown && (event.keyCode == aKey || event.keyCode == cKey || event.keyCode == vKey)) {
            return;
        }

        if(event.keyCode == leftArrowKey || event.keyCode == rightArrowKey) {
            return;
        }

        if(precision == 0 && (event.keyCode === dotKey || event.keyCode === commaKey)) {
            event.preventDefault();
            return;
        }

        if ((event.keyCode == zeroKey || event.keyCode == zeroNumpadKey) && event.target.value.startsWith('0') && !event.target.value.includes('.') && precision > 0) {
            event.preventDefault();
            return;
        }

        if ((event.keyCode >= zeroKey && event.keyCode <= nineKey) && !isDigitOrDecimalSeparator(event.key)) {
            event.preventDefault();
            return;
        }

        if ((event.keyCode >= zeroKey && event.keyCode <= nineKey) || (event.keyCode >= zeroNumpadKey && event.keyCode <= nineNumpadKey) ||
            event.keyCode == backspaceKey || event.keyCode == tabKey || event.keyCode == leftArrowKey || event.keyCode == rightArrowKey ||
            event.keyCode == deleteKey || event.keyCode == dotKey) {
            if (precision != null && precision != 'undefined') {
                var dotIndex = $(this).val().indexOf('.');
                if (dotIndex !== -1) {
                    if ($(this).val().length - dotIndex > precision) {
                        if (event.keyCode != backspaceKey && event.keyCode != deleteKey && event.keyCode != tabKey) {
                            if(!textSelected) {
                                event.preventDefault();
                            }
                        }
                    }
                }
            }
        } else {
            event.preventDefault();
        }
        if ($(this).val().indexOf('.') !== -1 && event.keyCode == dotKey) {
            event.preventDefault();
        }
    });
});

jQuery(window).load(function(){
    if(jQuery('._send-sms').length > 0) {
        jQuery('._send-sms').removeClass('disabled');
    };
});

function isTextSelected(input) {
    document.getSelection().toString() === input.value
}

function makeFormReadonly(formId, restaurantSelect) {
    $('#' + formId + ' input').attr('readonly', 'readonly');
    $('#' + formId + ' textarea').attr('readonly', 'readonly');
    $('.select2').prop('readonly', 'true');
    $('#' + formId + ' select').attr('readonly', 'readonly');
    $('.datetimepicker').removeClass('datetimepicker');
    $('#' + restaurantSelect).removeAttr('readonly');
 }

function formatCurrency(price, currencyCode, localeString) {
    let SPECIFIC_CURRENCY_DIGITS_FORMAT = new Map([
            ['COP', 0],
            ['JPY', 0],
            ['XOF', 0],
            ['XPF', 0],
            ['XAF', 0],
            ['VUV', 0],
            ['VND', 0],
            ['RWF', 0],
            ['PYG', 0],
            ['IDR', 0],
            ['GNF', 0],
            ['DJF', 0],
            ['KRW', 0],
            ['KMF', 0],
            ['KWD', 3],
            ['TND', 3],
            ['OMR', 3],
            ['LYD', 3],
            ['JOD', 3],
            ['IQD', 3],
            ['BHD', 3]
    ]);
    let SPECIFIC_CURRENCY_FORMAT = new Map([
        ['XAF', 'FCFA'],
        ['XOF', 'CFA']
    ]);
    if (price == null || isNaN(price)) {
        return '';
    }

    var priceNum = parseFloat(price);
    if (typeof priceNum === 'undefined' || priceNum === null) {
        return '';
    }

    var locale;
    if (localeString) {
        locale = localeString;
    } else {
        locale = com.upmenu.languageCode + '-' + com.upmenu.countryCode;
        if (com.upmenu.languageCode == null || com.upmenu.countryCode == null) {
            locale = 'en-EN';
        }
    }

    var currency = com.upmenu.currency;
    if (!currency) {
        currency = currencyCode;
    }

    var options;
    if (priceNum % 1.0 == 0) {
        if (SPECIFIC_CURRENCY_DIGITS_FORMAT.has(currency)) {
            options = {
                style: 'currency',
                currency: currency,
                currencyDisplay: "symbol",
                minimumFractionDigits: SPECIFIC_CURRENCY_DIGITS_FORMAT.get(currency)
            };
        } else {
            options = {style: 'currency', currency: currency, currencyDisplay: "symbol"};
        }
    } else {
        options = {style: 'currency', currency: currency, currencyDisplay: "symbol"};
    }

    if (locale.indexOf('fmcg')) {
        locale = locale.replace("_fmcg", "");
    }
    options.allowDropdown = false;
    var numberFormat = new Intl.NumberFormat(locale , options);
    var formatted = numberFormat.format(priceNum);
    if (SPECIFIC_CURRENCY_FORMAT.has(currency)) {
        formatted = formatted.replace(currency, SPECIFIC_CURRENCY_FORMAT.get(currency));
    }
    return formatted;
}

function passwordStrength(page) {
    if(page == 'customer') {
        var $input = jQuery('#customer-password-change');
    }
    else if(page == 'forgot') {
        var $input = jQuery('#forgot-password-change');
    }
    else {
        var $input = jQuery('#password-form');
    }

    var string = $input.val(),
        $form = $input.closest('form'),
        length = false,
        moreLength = false,
        number = false,
        special = true,
        uppercase = false,
        strength = 0;

    if(string === undefined) {
        return;
    }

    if(string.length > 7) {
        $form.find('._validation-chars').addClass('success').removeClass('error');
        length = true;
        strength += 1;
    }
    else {
        $form.find('._validation-chars').addClass('error').removeClass('success');
        length = false;
    }

    if(string.length > 8) {
        jQuery('._validation-chars').addClass('success').removeClass('error');
        moreLength = true;
        strength += 1;
    }
    else {
        jQuery('._validation-chars').addClass('error').removeClass('success');
        moreLength = false;
    }

    if(/[0-9]/.test(string)) {
        $form.find('._validation-number').addClass('success').removeClass('error');
        number = true;
        strength += 1;
    }
    else {
        $form.find('._validation-number').addClass('error').removeClass('success');
        number = false;
    }

    if(/[`!@#$%^&*()_+\-=\[\]{}\|,.<>\/?~]/.test(string)) {
        $form.find('._validation-special').addClass('success').removeClass('error');
        special = true;
        strength += 1;
    }
    else {
        $form.find('._validation-special').addClass('error').removeClass('success');
        special = false;
    }

    if(/[A-Z]/.test(string) && /[a-z]/.test(string)) {
        $form.find('._validation-uppercase').addClass('success').removeClass('error');
        uppercase = true;
        strength += 1;
    }
    else {
        $form.find('._validation-uppercase').addClass('error').removeClass('success');
        uppercase = false;
    }

    if(page == 'registration') {
        let $restaurantName = $form.find('#restaurant-name');
        let $phone = $form.find('#phone');
        if((string.length > 7) && ($restaurantName.length > 0 ? $restaurantName.val().length > 0 : true) && ($form.find('#email').val().length > 0) && ($phone.length > 0 ? $phone.val().length > 0 : true)) {
            $form.find('#_submit-registration-form').removeAttr('disabled');
        }
        else {
            $form.find('#_submit-registration-form').attr('disabled', '');
        }
    }

    if(page == 'passChange') {
        if($form.find('#password-form-confirm').val().length > 0) {
            $form.find('#_submit-form').removeAttr('disabled');
        }
        else {
            $form.find('#_submit-form').attr('disabled', '');
        }
    }

    if(page == 'forgot') {
        if(string.length > 7 && $form.find('input[name="passwordConfirm"]').val().length > 0) {
            $form.find('#_forgot-password-create-new-password-form-submit').removeAttr('disabled');
        }
        else {
            $form.find('#_forgot-password-create-new-password-form-submit').attr('disabled', '');
        }
    }

    if((string.length > 7)) {
        $form.find('.password-strength').attr('data-strength', strength);
    }
    else {
        $form.find('.password-strength').attr('data-strength', 0);
    }
}


jQuery(document).on('keyup focus change', '#password-form', function(e) {
    passwordStrength();
});

var showHidePassword = false;
$(document).on('click', '.show-password', function(e) {
    e.preventDefault();
    if(showHidePassword === true) {
        $(this).parent().find('input').attr('type', 'password');
        $(this).parent().find('.eye-hide').removeClass('hidden');
        $(this).parent().find('.eye-show').addClass('hidden');
        showHidePassword = false;
    } else {
        $(this).parent().find('input').attr('type', 'text');
        $(this).parent().find('.eye-hide').addClass('hidden');
        $(this).parent().find('.eye-show').removeClass('hidden');
        showHidePassword = true;
    }
});
var getUrl = window.location.href;
jQuery(document).on('click', '._choose-language', function(e) {
    e.preventDefault();
    var $this = jQuery(this);
    var data = $this.data('lang').toLowerCase();

    if(getURLParameter('lang') === 'null') {
        let url = new URL(getUrl);
        url.searchParams.set('lang', data);
        window.location.replace(url);
        return false;
    }

    let url = new URL(getUrl);
    url.searchParams.set('lang', data);
    window.location.replace(url);
});

jQuery(document).on('click', '.sb-close', function(e) {
    e.preventDefault();
    jQuery('#smartbanner').remove();
})

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });

    if (window.innerWidth < 768) {
        document.querySelectorAll('.js-tooltip-trigger').forEach(icon => {
            icon.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const parent = this.closest('[data-bs-toggle="tooltip"]');
                if (parent) {
                    const tooltip = bootstrap.Tooltip.getInstance(parent);
                    if (tooltip) {
                        tooltip.toggle();
                    }
                }
            });
        });

        document.addEventListener('click', function (e) {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                const tooltip = bootstrap.Tooltip.getInstance(el);
                if (!tooltip) return;

                const triggerIcon = el.querySelector('.js-tooltip-trigger');
                const tooltipElement = document.querySelector('.tooltip.show');

                if (
                    triggerIcon && !triggerIcon.contains(e.target) &&
                    (!tooltipElement || !tooltipElement.contains(e.target))
                ) {
                    tooltip.hide();
                }
            });
        });
    }
});