var com = com || {};
com.upmenu = com.upmenu || function() {};

// uuid simple generator http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
function trackEventsDataLayer(event, category, action, label ){
	if (!dataLayer) {
		return;
	}
	dataLayer.push({
		'event': event,
		'category': category,
		'action': action,
		'label': label
	});
}
/*
	IE bugfix for radius corners
*/
/*com.upmenu.prototype._initRadiusIE = function() {
	if (document.all && !document.addEventListener) {
		$('.plus').corner();
		$('.btn').corner();
	}
}*/
com.upmenu.logError = function(label, error) {
	elasticApm.captureError(error.stack);
	elasticApm.addLabels({ errorLabel: label });
}
com.upmenu.prototype._hashCode = function(str) {
	var hash = 0;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
// custom function to wrap google analytics tracking event
com.upmenu.prototype.trackEvent = function(name, event, label) {
	 if (typeof ga === 'function') {
	        return ga('send', 'event', name, event, label);
	 }
};
com.upmenu.prototype._getParameterByName = function(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	  var regexS = "[\\?&]" + name + "=([^&#]*)";
	  var regex = new RegExp(regexS);
	  var results = regex.exec(window.location.search);
	  if(results == null)
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
};

com.upmenu.prototype._updateParameterByName = function(url, param, paramVal)
{
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) 
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }        
    }
    else
    {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor  = tmpAnchor[1];

        if(TheParams)
            baseURL = TheParams;
    }

    if(TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
};

com.upmenu.prototype._focusOnFirstFormError = function(context) {
	
	
	jQuery('.has-error:first', context).find(":input:visible").focus();
};
com.upmenu.prototype._isCityExistInGoogleMapsResult = function(city, result) {
	for(var j = 0; j < result.address_components.length; j++) {
		for(var t = 0; t < result.address_components[j].types.length; t++) {
			var type = result.address_components[j].types[t];
			
			if(type == 'locality' || type == 'administrative_area_level_3' || type == 'administrative_area_level_2') {
				var longName = result.address_components[j].long_name;
				var shortName = result.address_components[j].short_name;
				if(longName.toLowerCase().indexOf(city.toLowerCase()) != -1) {
					return true;
				}
				if(shortName.toLowerCase().indexOf(city.toLowerCase()) != -1) {
					return true;
				}
				
			}
		}
	}
	return false;
};
com.upmenu.prototype._serializeObject = function($form)
{
    var o = {};
    var a = $form.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

com.upmenu.prototype.formatTime = function (oldFormatTime) {
	var oldFormatTimeArray = oldFormatTime.split(":");
	if (com.upmenu.timeFormat === 'FULL_HOURS') {
		return oldFormatTime;
	}
	var HH = parseInt(oldFormatTimeArray[0]);
	var min = oldFormatTimeArray[1];

	var AMPM = HH >= 12 ? "PM" : "AM";
	var hours;
	if (HH == 0) {
		hours = HH + 12;
	} else if (HH > 12) {
		hours = HH - 12;
	} else {
		hours = HH;
	}
	return hours + ":" + min + " " + AMPM;
};

window.mobileAndTabletCheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

// initialize date time localization
jQuery(document).ready(function () {
	// http://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
	if (window.location.hash == "#_=_")
		  window.location.hash = "";

	var api = new com.upmenu();
	//api._initRadiusIE();

	if(typeof jQuery.datepicker === 'undefined') {
	    return;
	}
	if(typeof I18n === 'undefined') {
	    return;
	}

	jQuery.datepicker.regional['pl'] = {
			prevText: I18n.t('js_datepicker_back'),
			nextText: I18n.t('js_datepicker_next'),
			monthNames: [
			             I18n.t('js_datepicker_month_january'),
			             I18n.t('js_datepicker_month_february'),
			             I18n.t('js_datepicker_month_march'),
			             I18n.t('js_datepicker_month_april'),
			             I18n.t('js_datepicker_month_may'),
			             I18n.t('js_datepicker_month_june'),
			             I18n.t('js_datepicker_month_july'),
			             I18n.t('js_datepicker_month_august'),
			             I18n.t('js_datepicker_month_september'),
			             I18n.t('js_datepicker_month_october'),
			             I18n.t('js_datepicker_month_november'),
			             I18n.t('js_datepicker_month_december')
			             ],
			monthNamesShort: [
						I18n.t('js_datepicker_month_short_january'),
						I18n.t('js_datepicker_month_short_february'),
						I18n.t('js_datepicker_month_short_march'),
						I18n.t('js_datepicker_month_short_april'),
						I18n.t('js_datepicker_month_short_may'),
						I18n.t('js_datepicker_month_short_june'),
						I18n.t('js_datepicker_month_short_july'),
						I18n.t('js_datepicker_month_short_august'),
						I18n.t('js_datepicker_month_short_september'),
						I18n.t('js_datepicker_month_short_october'),
						I18n.t('js_datepicker_month_short_november'),
						I18n.t('js_datepicker_month_short_december')
			                  ],
			dayNames: [
			           	I18n.t('js_datepicker_weekday_sunday'),
						I18n.t('js_datepicker_weekday_monday'),
						I18n.t('js_datepicker_weekday_tuesday'),
						I18n.t('js_datepicker_weekday_wednesday'),
						I18n.t('js_datepicker_weekday_thursday'),
						I18n.t('js_datepicker_weekday_friday'),
						I18n.t('js_datepicker_weekday_saturday')

			           ],
			dayNamesShort: [
			            I18n.t('js_datepicker_weekday_short_sunday'),
						I18n.t('js_datepicker_weekday_short_monday'),
						I18n.t('js_datepicker_weekday_short_tuesday'),
						I18n.t('js_datepicker_weekday_short_wednesday'),
						I18n.t('js_datepicker_weekday_short_thursday'),
						I18n.t('js_datepicker_weekday_short_friday'),
						I18n.t('js_datepicker_weekday_short_saturday')

						],
			dayNamesMin: [
			            I18n.t('js_datepicker_weekday_short_sunday'),
						I18n.t('js_datepicker_weekday_short_monday'),
						I18n.t('js_datepicker_weekday_short_tuesday'),
						I18n.t('js_datepicker_weekday_short_wednesday'),
						I18n.t('js_datepicker_weekday_short_thursday'),
						I18n.t('js_datepicker_weekday_short_friday'),
						I18n.t('js_datepicker_weekday_short_saturday')

			              ],
			weekHeader: I18n.t('js_datepicker_week'),
			dateFormat: 'yy-mm-dd',
			firstDay: 1,
			isRTL: false,
			yearSuffix: ''
	};
	if (jQuery.timepicker) {
		jQuery.timepicker.regional['pl'] = {
			timeText: I18n.t('js_datepicker_time'),
			hourText: I18n.t('js_datepicker_hour'),
			minuteText: I18n.t('js_datepicker_minute'),
			currentText: I18n.t('js_datepicker_current'),
			closeText: I18n.t('js_datepicker_ok')
		};
		jQuery.datepicker.setDefaults(jQuery.datepicker.regional['pl']);
		jQuery.timepicker.setDefaults(jQuery.timepicker.regional['pl']);
	}
});


com.upmenu.picker = {};
com.upmenu.pikaday = {};
if(typeof I18n !== 'undefined') {
	com.upmenu.pikaday.translations = {
		previousMonth: I18n.t('js_datepicker_back'),
		nextMonth: I18n.t('js_datepicker_next'),
		months: [I18n.t('js_datepicker_month_january'),
			I18n.t('js_datepicker_month_february'),
			I18n.t('js_datepicker_month_march'),
			I18n.t('js_datepicker_month_april'),
			I18n.t('js_datepicker_month_may'),
			I18n.t('js_datepicker_month_june'),
			I18n.t('js_datepicker_month_july'),
			I18n.t('js_datepicker_month_august'),
			I18n.t('js_datepicker_month_september'),
			I18n.t('js_datepicker_month_october'),
			I18n.t('js_datepicker_month_november'),
			I18n.t('js_datepicker_month_december')],
		weekdays: [I18n.t('js_datepicker_weekday_sunday'),
			I18n.t('js_datepicker_weekday_monday'),
			I18n.t('js_datepicker_weekday_tuesday'),
			I18n.t('js_datepicker_weekday_wednesday'),
			I18n.t('js_datepicker_weekday_thursday'),
			I18n.t('js_datepicker_weekday_friday'),
			I18n.t('js_datepicker_weekday_saturday')],
		weekdaysShort: [I18n.t('js_datepicker_weekday_short_sunday'),
			I18n.t('js_datepicker_weekday_short_monday'),
			I18n.t('js_datepicker_weekday_short_tuesday'),
			I18n.t('js_datepicker_weekday_short_wednesday'),
			I18n.t('js_datepicker_weekday_short_thursday'),
			I18n.t('js_datepicker_weekday_short_friday'),
			I18n.t('js_datepicker_weekday_short_saturday')]};
}

var ajaxRequestConfig = {
	opportunityWidget: [
		{
			excludedPaths: ['dashboard', 'partnersProgram', 'registration', 'login']
		}
	],
	headerPlanInfo: [
		{
			excludedPaths: ['registration', 'login']
		}
	],
	navUser: [
		{
			excludedPaths: ['registration', 'login']
		}
	],
	errorMessage: [
		{
			excludedPaths: ['registration', 'login']
		}
	],
	notifications2: [
		{
			excludedPaths: ['questionnaire']
		}
	],
	restaurantBlockCheck: [
		{
			excludedPaths: ['questionnaire']
		}
	]
};

function shouldMakeAjaxRequest(requestName) {
	const currentPath = window.location.pathname;

	const config = ajaxRequestConfig[requestName];
	if (!config) {
		return true;
	}

	for (const rule of config) {
		const match = rule.excludedPaths.some(excludedPath => currentPath.includes(excludedPath));
		if (match) return false;
	}

	return true;
}

function initAppleLogin(registration = true) {
	(function waitForAppleID() {
		if (window.AppleID && AppleID.auth) {
			AppleID.auth.init({
				clientId: com.upmenu.appleSsoClientId,
				scope: com.upmenu.appleSsoScope,
				redirectURI: com.upmenu.appleSsoRedirect,
				state: btoa(com.upmenu.siteId + '|' + window.location.href + '|' + com.upmenu.language),
			});
			const buttonElement = document.getElementById('appleid-signin');
			buttonElement.addEventListener('click', () => {
				AppleID.auth.signIn();
			});
			$("#googleIframe").attr('src', com.upmenu.socialLoginDomain + '/customer/login/social/google?lang=' + com.upmenu.language + '&siteUrl=' +  btoa(window.location.href) + '&registration=' + registration);
		} else {
			setTimeout(waitForAppleID, 200);
		}
	})();
}
