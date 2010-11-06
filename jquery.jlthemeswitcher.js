/* 
    jlThemeSwitcher - jQuery plugin
    ==================================================================
    ©2010 JasonLau.biz - Version 2.0.1
    ==================================================================
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

$.fn.jlthemeswitcher = function(settings){
	var options = jQuery.extend({
	   autoOpen: false,
       bgClass: 'ui-widget-content',
       closeIcon: true,
       closeOnClick: true,
       cookieName: 'jlthemeswitcher-theme',
       cookieOptions: {expires:365},
       defaultTheme: '',
       excludeThemes: '',
       hoverText: false,
       importThemes: true,
       importThemesPath: 'http://jasonlau.biz/public/themes.run',
       onClose: function(){},
       onOpen: function(){},
       onSelect: function(){},
       openAtOpener: false,
       themeItemWidth: 82,
       themePreview: true,
	   themes: '',
       title: 'Theme Switcher',
       width: '300px',     
       zindex: 2147483647
       }, settings);   
    var obj = $(this);   
    var themes = options.themes;
    var excludeThemes = options.excludeThemes.split(',');
    
    if(options.importThemes || themes == '' || options.joinThemes){
        $.ajax({
            url: options.importThemesPath,
            dataType: 'jsonp',
            jsonp: 'jlthemeswitcher',
            success: function(data) {
                if(options.joinThemes){
                   construct(themes + '|' + data.themes, obj); 
                } else {
                   construct(data.themes, obj); 
                }               
            }     
       });        
    } else {
       construct(themes, obj); 
    }
    
    if(!options.closeIcon){
        $('.jlthemeswitcher-close-icon').remove();
        
    }     
     
    function construct(themes, obj){    
    themes = themes.split('|');
    var cicon = '';
    if(options.closeIcon){
        cicon = '<div class="jlthemeswitcher-closer jlthemeswitcher-close-icon ui-state-default ui-corner-all"><span class="ui-icon ui-icon-circle-close" title="Close"></span></div>';
    }
    var content = '<div class="jlthemeswitcher-container"><div class="jlthemeswitcher-header"><div class="jlthemeswitcher-title">&nbsp;' + options.title + '</div>' + cicon + '</div><div class="jlthemeswitcher ' + options.bgClass + ' ui-corner-bl ui-corner-br"><ul class="jlthemeswitcher">\n';
    for(var i in themes){
        var themedata = themes[i].split(',');
        if($.inArray(themedata[0],excludeThemes) == -1){
            content += '<li class="theme_item"><a class="theme_link" href="javascript:void(0)" rel="'+themedata[2]+'" title="'+themedata[0]+'"><img class="theme_thumb" src="'+themedata[1]+'" alt="'+themedata[0]+'" title="'+themedata[0]+'" /><br /><span class="theme_name">'+themedata[0]+'</span></a></li>\n';
        }
        
    }
    content += '</ul></div></div>\n';
	obj.append(content);   
    
    $('.jlthemeswitcher-container').css({
        'width': options.width,
        'z-index': options.zindex
    });
     
    $('.jlthemeswitcher-header').addClass('ui-widget-header ui-corner-tl ui-corner-tr');
    $('.jlthemeswitcher-close-icon').css({
        'float': 'right',
        'cursor':'pointer',
        'width': '16px',
        'height': '16px',
        'padding': '2px',
        
    });
    
    $('.jlthemeswitcher-header').css({
        'padding': '2px 4px 0px 0px',
        'height': '22px',
        'margin': '0px auto',
        'width': '100%'     
    });
    
    $('.jlthemeswitcher-title').css({
        'float': 'left'       
    });
       
    $('div.jlthemeswitcher').css({
        'padding': '2px',
        'width': '100%',
        'overflow': 'hidden',
        'margin':'0px auto'
    });  
    
    $('ul.jlthemeswitcher li').css({
        'width': options.themeItemWidth + 'px',
        'display': 'inline-block',
        'padding': '4px 0px 4px 0px',
        'text-align':'center',
        'margin':'0px'
    });
    
    var liWidth = options.themeItemWidth*(themes.length+2);

    $('ul.jlthemeswitcher').css({
        'width': liWidth,
        'margin': '0px',
        'padding':'0px',        
        'list-style-type': 'none'
    });
    
    $('.jlthemeswitcher a').css({
        'display': 'block',
        'text-decoration': 'none'
    });    
    
    $('.jlthemeswitcher span').css({
        'display': 'block',
        'margin-top': '3px',
        'text-align': 'center',
        'font-size': '12px'
    });
    
    if(options.hoverText){
        $('.jlthemeswitcher span').css({
            'display': 'none'
        });
    }
    
    $('.theme_item').hover(function(){
        $(this).find('span:first').css('display','block');
        $(this).find('img:first').css({
            'filter':'alpha(opacity=50)',
            'opacity': '0.5'
        });
        if(options.themePreview){
            previewTheme($(this).find('a:first').attr('rel'),$(this).find('a:first').attr('title')); 
        }           
    },function(){
        if(options.hoverText){
            $(this).find('span:first').css('display','none');
        }      
        $(this).find('img:first').css({
            'filter':'',
            'opacity': ''
        });
        if(options.themePreview){
            var originalTheme = $.cookie(options.cookieName);
            switchTheme($('.jlthemeswitcher').find('a:contains(' + originalTheme + ')').attr('rel'),originalTheme); 
        }      
    });
    
    $('.theme_item').addClass('ui-corner-all');
    $('.theme_item img').addClass('ui-corner-all');
    
    $('.jlthemeswitcher a:hover img').css({
        'filter':'alpha(opacity=50)',
        'opacity': '0.5'
    });
        
    $('.theme_link').each(function(){
        $(this).click(function(){
            $('.jlthemeswitcher li').removeClass('ui-state-active');
            $(this).parent().addClass('ui-state-active');
            switchTheme($(this).attr('rel'),$(this).attr('title'));
            if(options.closeOnClick){
                $('.jlthemeswitcher-container').slideUp('slow');
                $('div.jlthemeswitcher').animate({
                scrollLeft: 0
                }, 'slow');
            }
            try{
                options.onSelect();   
            } catch(e) {}
        });       
    });
    
    $('.theme_link').css({
        'text-decoration':'none'
    });
      
    var div = $('div.jlthemeswitcher'),
    ul = $('ul.jlthemeswitcher');
    var divWidth = div.width();
    div.css({overflow: 'hidden'});
    var lastLi = ul.find('li:last-child');
    $("#debug").show();
    div.mousemove(function(e){
        var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth();
        var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;
        var w = (options.themeItemWidth*(themes.length+2))/2 - options.themeItemWidth;
        div.scrollLeft(left);  
    });
    
    if( $.cookie(options.cookieName) || options.defaultTheme ){
		var themeName = $.cookie(options.cookieName) || options.defaultTheme;
        if(!$.cookie(options.cookieName)){           
            $.cookie(options.cookieName, themeName, options.cookieOptions);
        }
        switchTheme(div.find('a:contains('+ themeName +')').attr('rel'),themeName);
        div.find('li:contains('+ themeName +')').addClass('ui-state-active');
	}
    
    $('.jlthemeswitcher-opener').click(function(){
       if(!$('.jlthemeswitcher-container').is(':visible')){ 
        if(options.openAtOpener){
            var w = $('.jlthemeswitcher-container').width();
            var position = $(this).position();
            var l = ((position.left+w) > screen.width) ? (screen.width-w) : position.left;
           
           $('.jlthemeswitcher-container').css({
              'position': 'absolute',
              'top': position.top + 'px',
              'left': l + 'px'
            });
            $('.jlthemeswitcher-header').css({
              'margin': '0px'
            });
            $('div.jlthemeswitcher').css({
              'margin': '0px'
            }); 
        }
        openThemeSwitcher(options.width,options.onOpen);
       }                        
    });
    
    $('.jlthemeswitcher-closer').click(function(){
        if($('.jlthemeswitcher-container').is(':visible')){
            closeThemeSwitcher(options.onClose);
        }                     
    });
    
    $('.jlthemeswitcher-toggle').click(function(){
        if($('.jlthemeswitcher-container').is(':visible')){
            closeThemeSwitcher(options.onClose);
        } else {
            openThemeSwitcher(options.width,options.onOpen);
        }                     
    });
    
    if(!options.autoOpen){
       $('.jlthemeswitcher-container').css({
        'display':'none'
    }); 
    } else {
        openThemeSwitcher(options.width,options.onOpen);
    }
    }
    
    if(!options.closeIcon){
        $('.jlthemeswitcher-close-icon').hide();
        
    }
    
    function switchTheme(cssLink,themeName){
		var cssLink = $('<link href="'+cssLink+'" type="text/css" rel="Stylesheet" class="jlthemeswitcher-theme" />');
        $.cookie(options.cookieName, themeName, options.cookieOptions);
		$("head").append(cssLink);				
		if( $("link.jlthemeswitcher-theme").size() > 3){
			$("link.jlthemeswitcher-theme:first").remove();
		}	
	}
    
    function previewTheme(cssLink,themeName){
		var cssLink = $('<link href="'+cssLink+'" type="text/css" rel="Stylesheet" class="jlthemeswitcher-theme" />');
		$("head").append(cssLink);				
		if( $("link.jlthemeswitcher-theme").size() > 3){
			$("link.jlthemeswitcher-theme:first").remove();
		}	
	}
    
    function openThemeSwitcher(width, onOpen){        
        $('.jlthemeswitcher-container').slideDown('slow',
        function(){
            $('div.jlthemeswitcher').scrollLeft(0);
            var div = $('div.jlthemeswitcher'),
            ul = $('ul.jlthemeswitcher');
            var divWidth = div.width();
            var lastLi = ul.find('li:last-child');
            var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth();
            var pos = $('div.jlthemeswitcher').find('li:contains('+ $.cookie(options.cookieName) +')').offset().left;
            var left = (pos - div.offset().left) - (div.width()/2) + (lastLi.width()/2);
            $('div.jlthemeswitcher').animate({
                scrollLeft: left
                }, 'slow');
        try{
           onOpen(); 
        } catch(e){}           
        });                       
    }
    
    function closeThemeSwitcher(onClose){
        $('div.jlthemeswitcher').animate({
            scrollLeft: 0
          }, 'slow');
        $('.jlthemeswitcher-container').slideUp('slow');
        try{
           onClose(); 
        } catch(e){}                              
    }    
};


/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};