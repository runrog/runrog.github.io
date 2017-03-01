/*
*  ============================
*  Jquery custom plugin library
*  ============================
*   Author: Roger Avalos
*  ============================
*/

//Global variables
var mobile = 'screen and (min-width:50px) and (max-width:600px)';
var tablet = 'screen and (min-width:601px) and (max-width:992px)';
var desktop = 'screen and (min-width : 993px)';
var win = $(window);

/* Accordian
* ======================= */
(function($){
 'use strict';
 $.fn.accordion = function(){
   var accordion = $(this);
     accordion.find('.accordion-section-title').click(function(e) {
         e.preventDefault();
         var _this = $(this);
         var thisAttr = _this.attr('href');
         var accordion = _this.parent().parent();
         if($(e.target).is('.active-accordion')) {
            collapseSection(accordion);
         }else {
           collapseSection(accordion);
           _this.addClass('active-accordion');
           _this.parent().find('.' + thisAttr.split('#')[1]).slideDown(150).addClass('open');
         }
     });
     function collapseSection(el) {
         $(el).find('.accordion-section-title').removeClass('active-accordion');
         $(el).find('.accordion-section-content').slideUp(150).removeClass('open');
     }
   return this;
 };
}(jQuery));


/* Carousel
* ======================= */
(function($){
 'use strict';
 $.fn.carousel = function(){
   var carousel = $(this);
   carousel.each(function(){
     var _this = $(this);
     var newContainerWidth = 0;
     var totalImages = _this.find('.carousel-content .carousel-content-item').length;
     var visibleOption = _this.attr('data-carousel-visible');
     var delayOption = _this.attr('data-carousel-delay');
     var controlsOption = _this.attr('data-carousel-controls');
     var fullSlider = _this.find('.carousel-content');
     var visibleNum, interval, viewContainerWidth, fullSliderWidth, currentMargin;
     var thisImg = 0;
     var newMargin = 0;
     var buffer = 10;

     if(typeof delayOption !== typeof undefined && delayOption !== false){
       if(delayOption === ''){
        delayOption = 2 * 1000;
      }else{
        delayOption = ~~(delayOption) * 1000;
      }
     }else{
       //set default delay
       delayOption = 2 * 1000;
     }

     if(typeof controlsOption !== typeof undefined && controlsOption !== false){
       if(controlsOption === ''){
         controlsOption = 'show';
       }else{
         controlsOption = controlsOption;
       }
     }else{
       //set default controls option
       controlsOption = 'show';
     }

     if(controlsOption.match(/hide/gi)){
       _this.find('.carousel-left-button').hide();
       _this.find('.carousel-right-button').hide();
       _this.find('.carousel-image-container').css('width','100%');
     }

     var resizeTimer;
     win.resize(function(){
       clearTimeout(resizeTimer);
       resizeTimer = setTimeout(setWidths, 250);
     });
     setWidths();
     function setWidths(){
       if(window.matchMedia(mobile).matches){
         visibleNum = 1;
       }else{
         if(typeof visibleOption !== typeof undefined && visibleOption !== false){
           if(visibleOption === ''){
             visibleNum = 4;
           }else{
             visibleNum = ~~(visibleOption);
           }
         }else{
           //set default visible image number
           visibleNum = 4;
         }
       }
       viewContainerWidth = _this.find('.carousel-image-container').outerWidth();
       newContainerWidth = 0;
       _this.find('.carousel-content .carousel-content-item').each(function(){
         $(this).find('img').css('width', viewContainerWidth / visibleNum);
         newContainerWidth += ~~($(this).outerWidth());
       });
       //newContainerWidth = Math.ceil(newContainerWidth);
       newContainerWidth = newContainerWidth + buffer; //add some buffer room (to avoid last image not shown sometimes)
       fullSlider.css('width',newContainerWidth);
       thisImg = 0;
       newMargin = 0;
       fullSliderWidth = fullSlider.outerWidth();
       currentMargin = _this.find('.carousel-content .carousel-content-item').eq(thisImg).outerWidth();
       fullSlider.css({'marginLeft': newMargin});
     }

     scootchLeft();

     var backMargin, forwardMargin, oldMargin;
     var nbSpeed = 150; //next and back animation speeds slightly faster

     _this.find('.carousel-left-button').click(moveBack);

     _this.find('.carousel-right-button').click(moveNext);

     //for touch swiping (leaving available for all Viewports)
     _this.on('swipeleft', moveNext);
     _this.on('swiperight', moveBack);

     function moveNext(){
       clearInterval(interval);
       oldMargin = newMargin;
       forwardMargin = newMargin += viewContainerWidth;
       //if you reach the end of slider
       if(forwardMargin >= (fullSliderWidth - viewContainerWidth)){
         forwardMargin = ((fullSliderWidth - viewContainerWidth) - buffer);
         thisImg = totalImages - (visibleNum);
         fullSlider.animate({'marginLeft': -(forwardMargin)},nbSpeed);
       }
       //if not at end of slider
       else{
         thisImg = thisImg += (visibleNum); //add to the img index number
         fullSlider.animate({'marginLeft': -(forwardMargin)},nbSpeed);
       }
       newMargin = forwardMargin;
     }

     function moveBack(){
       clearInterval(interval);
       oldMargin = newMargin;
       backMargin = newMargin -= viewContainerWidth;
       if(backMargin <= 0 || backMargin < ~~(currentMargin)){
         backMargin = 0;
         thisImg = 0;
         fullSlider.animate({'marginLeft': -(backMargin)},nbSpeed);
       }else{
         //reset img index number
         thisImg -= visibleNum;
         fullSlider.animate({'marginLeft': -(backMargin)},nbSpeed);
       }
       newMargin = backMargin;
     }

     _this.mouseover(function(){
       clearInterval(interval);
     }).mouseout(function(){
       scootchLeft();
     });

     function scootchLeft(){
       clearInterval(interval);
       interval = setInterval(function(){
         newMargin += currentMargin;
         if(newMargin > newContainerWidth){
           newMargin = 0;
         }
         if(thisImg == totalImages - (visibleNum)){
           newMargin = 0;
         }
         fullSlider.animate({'marginLeft': -(newMargin)});
         thisImg++;
         if(thisImg > totalImages - (visibleNum)){
           thisImg = 0;
         }
       },delayOption);
     }
   });
   return this;
 };
}(jQuery));


/* Content Slider
* ======================= */
(function($){
  'use strict';
  $.fn.contentSlider = function(){
    var contentSlider = $(this);
    contentSlider.each(function(){
      var slideDelay = $(this).attr('data-slider-delay');
      if(typeof slideDelay !== typeof undefined && slideDelay !== false){
        if(slideDelay === ''){
          slideDelay = 4000;
        }
        if(slideDelay.match(/none/gi)){
          slideDelay = false;
        }
        else{
          slideDelay = ~~(slideDelay) * 1000;
        }
      }else{
        slideDelay = 4000;
      }
      var totalImages, interval, _this;
      _this = $(this);
      totalImages = _this.find('.contentSlider-item').length;

      _this.append('<div class="contentSlider-bullets"></div>');

      _this.find('.contentSlider-item').each(function(){
        var img = $(this); img.addClass('item-' + img.index());
        img.parent().find('.contentSlider-bullets').append('<a href="#" class="contentSlider-bullet b-' +
        img.index() + '"></a>');
      });

      //set next / back buttons if no bullets
      _this.append('<a class="contentSlider-next-btn"></a>');
      _this.append('<a class="contentSlider-back-btn"></a>');

      //show / hide controls according to options;
      var controlOption = _this.attr('data-slider-controls');
      if(typeof controlOption !== typeof undefined && controlOption !== false){
        if(controlOption.match(/hide/gi)){
          _this.find('.contentSlider-next-btn, .contentSlider-back-btn').hide();
        }
      }

      //set both 1st bullet and 1st image active
      _this.find('.contentSlider-item:first-child').show().css('opacity','1');
      _this.find('.contentSlider-bullet:first-child').addClass('active');

      //style bullets according to options
      var bullets = _this.find('.contentSlider-bullets');
      var bulletOption = _this.attr('data-slider-bullets');
      if(typeof bulletOption !== typeof undefined && bulletOption !== false){
        if(bulletOption.match(/right/gi) || bulletOption.match(/left/gi)){
          if(bulletOption.match(/right/gi)){
            bullets.addClass('contentSlider-bullets-right');
          }
          if(bulletOption.match(/left/gi)){
            bullets.addClass('contentSlider-bullets-left');
          }
          //if bullets are left or right, vertically center them
          bullets.css('marginTop', -(bullets.outerHeight() / 2));
        }
        if(bulletOption.match(/bottom/gi)){
          bullets.addClass('contentSlider-bullets-bottom');
        }
      }else{
        //default bullets position
        bullets.addClass('contentSlider-bullets-bottom');
      }

      //pause slider if hovered over slider
      _this.mouseover(function(){
        clearInterval(interval);
      });
      //continue slider if hovered off
      _this.mouseleave(function(){
        moveNext(_this);
      });

      //init the auto sliding
      moveNext(_this);

      var effect;
      var effectOption = _this.attr('data-slider-effect');
      if(typeof effectOption !== typeof undefined && effectOption !== false){
        if(effectOption ===''){
          effectOption = 'slide';
        }else{
          effectOption = effectOption;
        }
      }else{
        effectOption = 'slide';
      }

      if(effectOption.match(/slide/gi)){
        var sliderWidth = ~~(_this.outerWidth());
        effect = {'marginLeft' : -(sliderWidth)};
        _this.find('.contentSlider-item').each(function(){
          $(this).css('opacity','1');
        });
      }else if(effectOption.match(/fade/gi)){
        effect = {'opacity': 0};
      }

      var animateSpeed = 400;
      var fadeBack = {opacity: 1};
      var imgNum = 0;

      //change slide via next button
      _this.find('.contentSlider-next-btn').click(function(){
       next(_this);
      });

      //change slide via back button
      _this.find('.contentSlider-back-btn').click(function(){
       back(_this);
      });

      //for touch swiping
        _this.on('swipeleft', function(){
          next(_this);
        });
        _this.on('swiperight', function(){
          back(_this);
        });

      //change slide via bullets then reset interval
      _this.find('.contentSlider-bullet').click(function(e){
        e.preventDefault();
        var el, bulletNum; el = $(this); bulletNum = el.index();
        el.addClass('active').siblings().removeClass('active');
        if(effectOption.match(/slide/gi)){
          _this.find('.contentSlider-item.item-' + bulletNum).show().css('margin-left', 0).siblings('.contentSlider-item').hide();
        }else if(effectOption.match(/fade/gi)){
          _this.find('.contentSlider-item.item-' + bulletNum).show().css('opacity','1').siblings('.contentSlider-item').hide().css('opacity','0');
        }
        imgNum = bulletNum;
        moveNext(_this);
      });

      function moveNext(el){
        clearInterval(interval);
        if($.isNumeric(slideDelay)){
          interval = setInterval(function(){
            next(el);
          },slideDelay);
        }
      }

      function next(element){
        //if slide option, recalculate container width on resize
        if(effectOption.match(/slide/gi)){
          var resizeTimer;
          win.resize(function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){
              sliderWidth = ~~(_this.outerWidth());
              effect = {'marginLeft' : -(sliderWidth)};
            }, 250);
          });
        }
        var currentSlide = element.find('.contentSlider-item.item-' + imgNum);
        currentSlide.animate(effect, animateSpeed); //animation here
        hideDelay(currentSlide);
        imgNum++;
        if(imgNum > totalImages - (1)){
          imgNum = 0;
          var lastSlide = element.find('.contentSlider-item.item-' + totalImages -(1));
          if(effectOption.match(/slide/gi)){
            element.find('.contentSlider-item.item-' + imgNum).show().css('margin-left', sliderWidth);
            element.find('.contentSlider-item.item-' + imgNum).animate({'marginLeft' : 0}, animateSpeed);
          }
          lastSlide.animate(effect, animateSpeed); //animation here
          hideDelay(lastSlide);
        }
        var nextSlide = element.find('.contentSlider-item.item-' + imgNum);
        if(effectOption.match(/slide/gi)){
          nextSlide.show().css('margin-left', sliderWidth).animate({'marginLeft' : 0}, animateSpeed);
        }else if (effectOption.match(/fade/gi)) {
          showDelay(nextSlide);
        }
        element.find('.contentSlider-bullet.b-' + imgNum).addClass('active').siblings().removeClass('active');
      }

      function back(element){
        var currentSlide = element.find('.contentSlider-item.item-' + imgNum);
        if(effectOption.match(/slide/gi)){
          currentSlide.animate({'marginLeft' : sliderWidth}, animateSpeed);
        }else if(effectOption.match(/fade/gi)){
          currentSlide.animate(effect, animateSpeed); //animation here
        }
        hideDelay(currentSlide);
        imgNum--;
        //if at the beginning reset to last slide
        if(imgNum < 0){
          imgNum = totalImages - (1);
        }
        //If at the end reset to 1st slide
        if(imgNum > totalImages - (1)){
          imgNum = 0;
          var lastSlide = element.find('.contentSlider-item.item-' + totalImages -(1));
          if(effectOption.match(/slide/gi)){
            lastSlide.css('margin-left',-(sliderWidth));
            lastSlide.animate({'marginLeft' : 0}, animateSpeed);
          }else if (effectOption.match(/fade/gi)) {
            lastSlide.animate(effect, animateSpeed); //animation here
          }
          hideDelay(lastSlide);
        }
        var previousSlide = element.find('.contentSlider-item.item-' + imgNum);
        if(effectOption.match(/slide/gi)){
          previousSlide.show().css('margin-left',-(sliderWidth)).animate({'marginLeft' : 0}, animateSpeed);
        }else if (effectOption.match(/fade/gi)) {
          showDelay(previousSlide);
        }
        element.find('.contentSlider-bullet.b-' + imgNum).addClass('active').siblings().removeClass('active');
      }

      function hideDelay(e){
        setTimeout(function(){
          e.hide();
        },animateSpeed);
      }

      function showDelay(e){
        setTimeout(function(){
          e.show();
          if(effectOption.match(/fade/gi)){
            e.animate(fadeBack,animateSpeed);
          }
        },animateSpeed);
      }
    });
    return this;
  };
}(jQuery));


/* Countdown
* ======================= */
(function($){
 'use strict';
 $.fn.countDown = function(){
   var countDown = $(this);
   countDown.each(function(){
     var counterEnd = $(this).attr('data-countdown-end');
     var endArray;
     var index = 0;
     var totalEndTimes = 0;
     //set the endtime
     if(typeof counterEnd !== typeof undefined && counterEnd !== false){
       if(counterEnd === ''){
         counterEnd = 'May 25 2017 18:40:18 GMT-0400';
       }else{
         endArray = counterEnd.split('|');
         totalEndTimes = endArray.length;
         counterEnd = endArray[index];
       }
     }else{
       counterEnd = 'May 25 2017 18:40:18 GMT-0400';
     }

     function timeRemaining(endtime){
       var t = Date.parse(endtime) - Date.parse(new Date());
       var seconds = Math.floor( (t/1000) % 60 );
       var minutes = Math.floor( (t/1000/60) % 60 );
       var hours = Math.floor( (t/(1000*60*60)) % 24 );
       var days = Math.floor( t/(1000*60*60*24) );
       return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
     }
     function runClock(id,endtime){
     var clock = $(id);

     // get spans where our clock numbers are held
     var daysSpan = clock.find('.days');
     var hoursSpan = clock.find('.hours');
     var minutesSpan = clock.find('.minutes');
     var secondsSpan = clock.find('.seconds');

     function updateClock(){
       var t = timeRemaining(endtime);
       // update the numbers in each part of the clock
       daysSpan.html(t.days);
       hoursSpan.html(('0' + t.hours).slice(-2));
       minutesSpan.html(('0' + t.minutes).slice(-2));
       secondsSpan.html(('0' + t.seconds).slice(-2));

       //If time ends
       //console.log(t.total);
       if(t.total<=0){
         clearInterval(timeinterval);
         countDownEnd();
         /*setTimeout(function(){
           if(totalEndTimes > 1){
             index++;
             counterEnd = endArray[index];
             console.log(counterEnd);
             //timeinterval = setInterval(updateClock,1000);
             //runClock(thisClock,counterEnd);
           }
           //reset end time to next (), check for repeat dates
           //change end time with a function
         },2000); //this would be: current time - (counterEnd + durationLength)*/
       }
     }
     function countDownEnd(){
       console.log('countdown ended');
     }
     updateClock();
      var timeinterval = setInterval(updateClock,1000);
     }
     var thisClock = this;
     runClock(thisClock,counterEnd);
   });
   return this;
 };
}(jQuery));


/* Equal Heights
* ======================= */
(function($){
  'use strict';
  $.fn.equalHeights = function(){
    var resizeTimer;
    win.resize(function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setHeights, 250);
    });
    setHeights();
    function setHeights(){
      $('.eq-height').each(function(){
        var largestHeight = 0;
        var ehEl = $(this).children();
        if (window.matchMedia(desktop).matches || window.matchMedia(tablet).matches) {
          ehEl.css('min-height','1px');
          ehEl.each(function(){
            var colHeight = $(this).outerHeight();
            if(colHeight > largestHeight){
              largestHeight = colHeight;
            }
          });
          ehEl.css('min-height',largestHeight);
        }else{
          ehEl.css('min-height','1px');
        }
      });
    }
    return this;
  };
}(jQuery));


/* Footer Nav
* ======================= */
(function($){
  'use strict';
  $.fn.footerNav = function(){
    var footerLink = $(this).find('.footer-nav .footer-topLink');

    footerLink.click(function(e){
      var _this = $(this);
      //if mobile
      if(window.matchMedia(mobile).matches){
        e.preventDefault();
        //if there us even a dropdown menu
        if(_this.next('ul').length){
          _this.next('ul').slideToggle(300);
          _this.parent().siblings().find('ul.footer-subLinks').slideUp();
        }
      }
    });

    var resizeTimer;
    win.resize(function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(footerLinkDisplays, 250);
    });

    function footerLinkDisplays(){
      if(window.matchMedia(desktop).matches || window.matchMedia(tablet).matches){
        footerLink.next('ul').show();
      }else if(window.matchMedia(mobile).matches){
        footerLink.next('ul').hide();
      }
    }
    return this;
  };
}(jQuery));


/* Image Gallery
* ======================= */
(function($){
  'use strict';
  $.fn.imageGallery = function(){
    var index,
        totalImages,
        thisImg,
        displayNum,
        legend,
        backBtn,
        nextBtn,
        closeBtn,
        isGalleryModal;
    var body = $('body');
    var imageGallery = $(this);
    imageGallery.each(function(){
      var _this = $(this);
      var newBuild = _this.html();
      isGalleryModal = false;

      _this.find('.imageGallery-img').click(function(e){
        e.preventDefault();
        totalImages = ~~(_this.find('.imageGallery-img').length);
        isGalleryModal = true;
        if($(this).parent().attr('class').match(/pg-page-/gi)){
          index = ~~($(this).closest('.imageGallery').find('.imageGallery-img').index(this));
        }else{
          index = ~~($(this).index());
        }
        displayNum = index + 1;

        var modal = '<div class="model-overlay modal-gallery">' +
        '<div class="close row"><a class="close-modal" href="#">' +
        '<img src="images/close-x.svg"></a></div><div class="modal-content modal-wide">' +
        '<div class="gallery-controls row"><span class="legend">' + displayNum + ' / ' + totalImages + '</span>' +
        '<button class="btn-general back"><i class="fa fa-chevron-left" aria-hidden="true">' +
        '</i></button><button class="btn-general next"><i class="fa fa-chevron-right" aria-hidden="true">' +
        '</i></button></div>' + newBuild + '</div></div>';

        $(modal).insertAfter('body');
        body.next('.model-overlay').fadeIn();

        thisImg = body.next('.modal-gallery').find('.imageGallery-img');
        backBtn = body.next('.modal-gallery').find('.back');
        nextBtn = body.next('.modal-gallery').find('.next');
        legend = body.next('.modal-gallery').find('.legend');
        closeBtn = body.next('.modal-gallery').find('.close-modal');

        if(index === 0){
          backBtn.css('visibility','hidden');
        }
        if( index === (totalImages - 1)){
          nextBtn.css('visibility','hidden');
        }
        //if paginated, remove page wrappers in modal
        if(thisImg.parent().attr('class').match(/pg-page-/gi)){
          thisImg.unwrap();
          thisImg = body.next('.modal-gallery').find('.imageGallery-img'); //reset variable
        }
        //show clicked image
        thisImg.siblings().removeClass('block');
        thisImg.eq(index).addClass('block');

        nextBtn.click(moveNext);
        backBtn.click(moveBack);
        thisImg.on('swipeleft', moveNext);
        thisImg.on('swiperight', moveBack);

        closeBtn.click(function(e){
          e.preventDefault();
          isGalleryModal = false;
          var modalToggle = $(this);
          modalToggle.parent().parent().fadeOut(300);
          setTimeout(function(){
            modalToggle.parent().parent().remove();
          }, 300);
        });
      });
    });
    //callbacks
    function moveBack(e){
      e.preventDefault();
      if(index > 0){
        thisImg.eq(index).removeClass('block');
        index--; displayNum = index + 1;
        thisImg.eq(index).addClass('block');
        legend.html(displayNum + ' / ' + totalImages);
        if(index === 0){
          backBtn.css('visibility','hidden');
        }
        if(index < (totalImages - 1)){
          nextBtn.css('visibility','visible');
        }
      }
    }
    function moveNext(e){
      e.preventDefault();
      if(index <= (totalImages - 2)){
        thisImg.eq(index).removeClass('block');
        index++; displayNum = index + 1;
        thisImg.eq(index).addClass('block');
        legend.html(displayNum + ' / ' + totalImages);
        if(index == (totalImages - 1)){
          nextBtn.css('visibility','hidden');
        }
        if(index > 0){
          backBtn.css('visibility','visible');
        }
      }
    }
    //for keyboard controls
    $(document).keydown(function(e){
      if(isGalleryModal){
        if (e.keyCode == 39) {
          moveNext(e);
        }
        if (e.keyCode == 37) {
          moveBack(e);
        }
      }
    });
    return this;
  };
}(jQuery));


/* Main Navigation
* ======================= */
(function($){
  'use strict';
  $.fn.mainNav = function(){

    var _this = $(this);
    var body = $('body');
    var menuLayout = _this.attr('data-menu-layout');
    var menuSlide = _this.attr('data-menu-slide');
    var logoPosition = _this.attr('data-menu-logo');

    if(typeof menuLayout !== typeof undefined && menuLayout !== false){
      if (menuLayout === ''){
        menuLayout = 'default';
      }else{
        menuLayout = menuLayout;
      }
    }else{
      //set default menu type
      menuLayout = 'default';
    }

    if(typeof menuSlide !== typeof undefined && menuSlide !== false){
      if (menuSlide === ''){
        menuLayout = 'right';
      }else{
        menuSlide = menuSlide;
      }
    }else{
      //set default menu slide direction
      menuSlide = 'right';
    }

    if(typeof logoPosition !== typeof undefined && logoPosition !== false){
      if (logoPosition === ''){
        logoPosition = 'default';
      }else{
        logoPosition = logoPosition;
      }
    }else{
      //set default menu type
      logoPosition = 'default';
    }

    var logo = _this.find('.nav-main-topLink.nav-main-logo');
    if(logoPosition.match(/center/gi)){
      logo.addClass('hide');
      $('<div class="nav-center-logo" style="position:' + _this.css('position') + ';">' + logo.html() + '</div>').insertBefore(_this);
    }else{
      logo.addClass('block');
    }

    //Build slide out menu and insert in DOM after body
    $('.slide-trigger').click(function(e){
      e.preventDefault();
      var el = $(this);
      //to allow multiple slide out menus. dynamically recheck the slide direction
      menuSlide = el.closest('.nav-main').attr('data-menu-slide');
      $('<div class="slide-menu slide-' + menuSlide + '"><div class="close-container"><a class="close-menu" href="#">'+
      '<i class="fa fa-times fa-lg"></i></a></div><div class="nav-main"></div></div>').insertAfter(body);

      var slideMenu = body.next('.slide-menu');
      slideMenu.find('.nav-main').prepend(el.closest('.nav-main').html());

      slideMenu.find('.nav-main .nav-main-dropdownBtn').each(function(){
        var el = $(this);
        var display = el.parent().find('ul').first().css('display');
        if(display.match(/none/gi)){
          el.removeClass('arrow-up');
        }
        else if(display.match(/block/gi)){
          el.removeClass('arrow-up');
          el.parent().find('ul').first().hide();
        }
      });

      clickDD(body.next('.slide-menu').find('.nav-main .nav-main-dropdownBtn'));

      var slideTopLink = slideMenu.find('.nav-main-topLink').not('.nav-main-topLink.nav-main-logo');

      if(menuLayout.match(/default/gi)){
        slideTopLink.removeClass('desktop-only').addClass('no-desktop');
      }

      if(menuLayout.match(/minimal/gi)){
        //Show only hamburger in top nav
        slideTopLink.removeClass('hide');
        //show all links in slide menu
        slideMenu.find('.nav-main .nav-main-topLink').addClass('block');
      }

      if(menuLayout.match(/show-all/gi)){
        //all including hamburger
        slideTopLink.removeClass('desktop-only');
        slideMenu.find('.nav-main .nav-main-topLink').addClass('no-desktop');
      }

      //Always hide logo and hamburger in slide menu
      slideMenu.find('.nav-main .nav-main-topLink.nav-main-logo').removeClass('block no-desktop desktop-only').addClass('hide');
      slideMenu.find('.nav-main .nav-main-topLink .nav-main-open').parent().removeClass('block no-desktop desktop-only').addClass('hide');

      var slideDirection = menuSlide;
      var oT, pos;
      if (slideDirection.match(/right/)){
        pos = 'right';
        slideOutMenu(pos);
      }
      if (slideDirection.match(/left/)){
        pos = 'left';
        slideOutMenu(pos);
      }
      if (slideDirection.match(/top/)){
        pos = 'top';
        slideOutMenu(pos);
      }
      if (slideDirection.match(/center/)){
        pos = 'center';
        slideOutMenu(pos);
      }
    });

    function slideOutMenu(position){
      var newSlideMenu = body.next('.slide-menu');
      var closeTrigger = newSlideMenu.find('.close-menu');
      var size, coords, fast, slow;
      var resizeTimer;
      //resize slide out menu on screen resizing
      win.resize(function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
          if(position == 'right' || position == 'left'){
            size = newSlideMenu.width();
          }
          if(window.matchMedia(desktop).matches){
            if(menuLayout.match(/default/gi)){
              if(newSlideMenu.is(':visible')){
                closeTrigger.trigger('click');
              }
            }
          }
        }, 250);
      });
        fast = 200;
        slow = 600;
        if(position == 'top'){
          size = newSlideMenu.height();
          newSlideMenu.show().animate({'top':'0'},fast);
        }
        if(position == 'center'){
          if(!$('.mask-center').length){
            newSlideMenu.wrap('<div class="mask-center"></div>');
          }
          newSlideMenu.slideDown(fast);
        }
        if(position == 'left' || position == 'right'){
          size = newSlideMenu.width();
          if(position == 'left'){
            newSlideMenu.show().animate({'left':'0'},fast);
          }
          if(position == 'right'){
            newSlideMenu.show().animate({'right':'0'},fast);
          }
        }
        if(position != 'center'){
          $('body').append('<div class="mask"></div>');
          $('.mask').fadeIn(fast);
        }else{
          $('.mask-center').fadeIn(fast);
        }
        closeTrigger.click(closeMenu);
        $('.mask, .mask-center').click(closeMenu);
        $('.slide-menu').click(function(e){
          e.stopPropagation();
        });

        function closeMenu(e){
          e.preventDefault();
          if(position == 'right'){
            coords = {'right' : '-' + size + 'px'};
          }
          if(position == 'left'){
            coords = {'left' : '-' + size + 'px'};
          }
          if(position == 'top'){
            coords = {'top' : '-' + size + 'px'};
          }
          if(position == 'center'){
            body.next('.mask-center').fadeOut(fast);
            setTimeout(function(){
              body.next('.mask-center').remove();
            },fast);
          }else{
            $('.mask').fadeOut(fast).remove();
          }
          newSlideMenu.animate(coords,fast).fadeOut(fast);
          setTimeout(function(){
            newSlideMenu.remove();
          },fast);
          fast = 0;
          slow = 0;
        }
    }

    //Set top nav bar layout options
    if(menuLayout.match(/default/gi)){
      _this.find('.nav-main-topLink').not('.nav-main-topLink.nav-main-logo').addClass('desktop-only');
      _this.find('.nav-main-topLink .nav-main-open').parent().removeClass('desktop-only').addClass('no-desktop');
    }

    if(menuLayout.match(/minimal/gi)){
      //Show only hamburger in top nav
      _this.find('.nav-main-topLink').not('.nav-main-topLink.nav-main-logo').addClass('hide');
      _this.find('.nav-main-topLink .nav-main-open').parent().removeClass('hide').addClass('block');
      //show all links in slide menu
    }

    if(menuLayout.match(/show-all/gi)){
      //all including hamburger
      _this.find('.nav-main-topLink').not('.nav-main-topLink.nav-main-logo').addClass('desktop-only');
      _this.find('.nav-main-topLink .nav-main-open').parent().removeClass('desktop-only').addClass('block');
    }

    if(menuLayout.match(/no-slide/gi)){
      //no hamburger
      _this.find('.nav-main-topLink .nav-main-open').parent().addClass('hide');
    }

    clickDD($('.nav-main .nav-main-dropdownBtn'));
    var slideSpeed = 150;
    function clickDD(btn){
      $(btn).not('.side-menu .nav-main .nav-main-dropdownBtn').click(function(e){
        e.preventDefault();
        var ddButton = $(this);
        ddButton.toggleClass('arrow-up');
        ddButton.parent().find('ul').first().slideToggle(slideSpeed);
        ddButton.not('.slide-menu .nav-main .nav-main-dropdownBtn').parent().siblings().find('.nav-main-dropdownBtn').next('ul').not(ddButton).slideUp(slideSpeed);
      });
    }

    $('.section').click(function(){
      _this.find('.nav-main-dropdownBtn').each(function(){
        var ddUl = $(this).parent().find('ul').first();
        if(ddUl.is(':visible')){
          ddUl.slideUp(slideSpeed);
        }
      });
    });

    //To add a class to a fixed nav after scrolling past a certain point
    var topSection = $('.section').first();
    var checkPoint;
    if (topSection.length){
      checkPoint = topSection.offset().top + topSection.height();
    }else{
      checkPoint = null;
    }

    var nav = _this;
    var centerLogo = $('.nav-center-logo');

    if(nav.css('position') == 'fixed'){
      if (window.pageYOffset > checkPoint){
        nav.addClass('nav-after');
      }else{
        nav.removeClass('nav-after');
      }
      win.on('scroll',function(){
        stop = Math.round(win.scrollTop());
        if (stop > checkPoint) {
            nav.addClass('nav-after');
            centerLogo.addClass('nav-center-logoAfter');
        } else {
            nav.removeClass('nav-after');
            centerLogo.removeClass('nav-center-logoAfter');
       }
      });
    }
    return this;
  };
}(jQuery));


/* Google Maps Styling
* ======================= */
(function($){
  'use strict';
  $.fn.styleMap = function(){
    var googleMap = $(this);
    googleMap.each(function(){
      var _this = $(this);
      var mapNode = _this.find('.google-container');
      var latitude, longitude;

      //if map exists on page, run the api
      if (mapNode.length){

        var addressSection = _this.find('.google-map-address');

        //Set an address no matter the condition
        var address = _this.attr('data-map-address');
        if (typeof(address) !== 'undefined' && address !== null){
          if(address === ''){
            address = 'San Antonio, Tx';
          }else{
            address = address;
          }
        }else{
          //set default address
          address = 'San Antonio, Tx';
        }

        addressSection.html(address);
        var map_zoom = 15;
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': address}, function(results, status) {

          //set your google maps parameters
          if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
          }

          //google map custom marker icon - .png fallback for IE11
          var is_internetExplorer11= navigator.userAgent.toLowerCase().indexOf('trident') > -1;
          var marker_url = ( is_internetExplorer11 ) ? 'images/cd-icon-location.png' : 'images/cd-icon-location.svg';

          //define the basic color of your map, plus a value for saturation and brightness
          function convertRGB(rgb) {
              if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

              rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
              function hex(x) {
                  return ("0" + parseInt(x).toString(16)).slice(-2);
              }
              return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
          }

          var lessBaseColor = convertRGB(addressSection.css('background-color'));
          var	mainColor = lessBaseColor,

          saturationValue = -20,
          brightnessValue = 5;

          var style= [
          {
            //set saturation for the labels on the map
            elementType: "labels",
            stylers: [
              {saturation: saturationValue}
            ]
          },
          {
            //point of interest - don't show these lables on the map
            featureType: "poi",
            elementType: "labels",
            stylers: [
              {visibility: "off"}
            ]
          },
          {
            //don't show highways lables on the map
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [
                {visibility: "off"}
            ]
          },
          {
            //don't show local road lables on the map
            featureType: "road.local",
            elementType: "labels.icon",
            stylers: [
              {visibility: "off"}
            ]
          },
          {
            //don't show arterial road lables on the map
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
              {visibility: "off"}
            ]
          },
          {
            //don't show road lables on the map
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
              {visibility: "off"}
            ]
          },
          //style different elements on the map
          {
            featureType: "transit",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "poi.government",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "poi.sport_complex",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "poi.attraction",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "poi.business",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "transit",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "transit.station",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "landscape",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]

          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              { hue: mainColor },
              { visibility: "on" },
              { lightness: brightnessValue },
              { saturation: saturationValue }
            ]
          }
          ];

        //set google map options
        var map_options = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: map_zoom,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            styles: style,
        };

        //inizialize the map
        var googleContainer = _this.find('.google-container').get(0);
        var map = new google.maps.Map(googleContainer, map_options);
        //add a custom marker to the map
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude, longitude),
          map: map,
          visible: true,
          icon: marker_url,
        });

        //add custom buttons for the zoom-in/zoom-out on the map
        function CustomZoomControl(controlDiv, map) {
          //grap the zoom elements from the DOM and insert them in the map
          var controlUIzoomIn= _this.find('.google-zoom-in').get(0),
              controlUIzoomOut= _this.find('.google-zoom-out').get(0);
          controlDiv.appendChild(controlUIzoomIn);
          controlDiv.appendChild(controlUIzoomOut);
          controlDiv.classList.add("zoom-wrapper");

          // Setup the click event listeners and zoom-in or out according to the clicked element
          google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
              map.setZoom(map.getZoom()+1);
          });
          google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
              map.setZoom(map.getZoom()-1);
          });
        }

        var zoomControlDiv = document.createElement('div');
        var zoomControl = new CustomZoomControl(zoomControlDiv, map);

        //insert the zoom div on the top left of the map
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
        });
      }
    });
    return this;
  };
}(jQuery));


/* Modal
* ======================= */
(function($){
  'use strict';
  $.fn.modal = function(){
      var modalTrigger = $(this).find('.modal-trigger');
      var body = $('body');
      modalTrigger.click(function(e){
        e.preventDefault();
          var el = $(this).parent();
          var mB = el.find('.model-overlay');
          var nB = $('<div class="model-overlay">' + mB.html() + '</div>');
          buildModal(nB, el);
      });
      //Auto show announcement modal
      if($(this).hasClass('announcement')){
        //disabled for demo
        /*var el = $(this);
        var mB = $('.announcement').find('.model-overlay');
        var nB = $('<div class="model-overlay">' + mB.html() + '</div>');
        buildModal(nB, el);*/
      }

      function buildModal(newBuild, _this){
        newBuild.insertAfter('body');
        var modalOverlay = body.next('.model-overlay');
        var modalContent = modalOverlay.find('.modal-content');

        if(_this.hasClass('announcement')){
          modalOverlay.addClass('an-message');
          body.addClass('blur');
          if (window.matchMedia(desktop).matches || window.matchMedia(tablet).matches) {
            modalContent.animate({'marginTop':'110px'},200);
          }else{
            modalContent.animate({'marginTop':'20px'},200);
          }
        }else{
          modalContent.animate({'marginTop':'30px'},200);
        }
        modalOverlay.fadeIn(500);

        //init the site search and focus if a search modal
        if(_this.find('.modal-search-bar').length){
          modalContent.find('.modal-search-bar').siteSearch().focus();
        }

        modalOverlay.find('.close-modal').click(closeModal);
        modalOverlay.click(closeModal);
        modalOverlay.find('.modal-content').click(function(e){
          e.stopPropagation();
        });
        function closeModal(e){
          modalOverlay.fadeOut(500);
          if(body.hasClass('blur')){
            body.removeClass('blur');
          }
          setTimeout(function(){
            modalOverlay.remove();
          },500);
          e.preventDefault();
        }
      }
    return this;
  };
}(jQuery));


/* Multi Step
* ======================= */
(function($){
  'use strict';
  $.fn.multiStep = function(){
    var multiStep = $(this);
    multiStep.find('.multiStep-step').each(function(){
      var _this = $(this);
      var indexNum = _this.index() + 1;
      var stepLabel = _this.attr('data-step-label');
      _this.parent().prev('.multiStep-progress').append('<span class="step' + indexNum +
      '"><div class="step-num"></div></span>');
      _this.parent().prev('.multiStep-progress').find('.step' + indexNum).append(stepLabel);
      _this.parent().prev('.multiStep-progress').find('.step' + indexNum).find('.step-num').html(indexNum);
      var nextBtn = $('<button class="btn-general next-btn">Next</button>');
      var backBtn = $('<button class="btn-general back-btn">Back</button>');
      var msRow = _this.find('.multiStep-btn-row');
      var msProgress = _this.parent().prev('.multiStep-progress');
      if(_this.is(':first-child')){
        _this.addClass('active');
        msProgress.find('.step' + indexNum).addClass('active');
        msRow.prepend(nextBtn);
      }
      if(_this.is(':last-child')){
        msRow.prepend(backBtn);
      }
      if(_this.is(':not(:first-child)') && _this.is(':not(:last-child)')){
        msRow.prepend(nextBtn);
        msRow.prepend(backBtn);
      }
      //next click event
      _this.find('.next-btn').click(function(e){
        if(!_this.is(':animated')){
          e.preventDefault();
          _this.css('height', _this.outerHeight());
          _this.css('width', _this.outerWidth());
          _this.addClass('position-absolute');
          _this.animate({
            marginLeft: '-200px',
            opacity: 0
          }, 300);
          _this.next().addClass('active');
          setTimeout(function(){
            _this.removeClass('active');
          },300);
          msProgress.find('.step' + indexNum).next().addClass('active');
        }
      });
      //back click event
      _this.find('.back-btn').click(function(e){
        if(!_this.prev().is(':animated')){
          e.preventDefault();
          _this.removeClass('active');
          _this.prev().removeClass('position-absolute');
          _this.prev().addClass('active');
          _this.prev().animate({
            marginLeft: '0px',
            opacity: 1
          }, 300);
          setTimeout(function(){
            _this.prev().css('height','');
            _this.prev().css('width', '');
          },300);
          msProgress.find('.step' + indexNum).removeClass('active');
        }
      });
    });
    return this;
  };
}(jQuery));


/* Pagination
* ======================= */
(function($){
  'use strict';
  $.fn.pagination = function(){
    var pagination = $(this);
    pagination.each(function(){
      var _this = $(this);
      var pageItems = _this.children();
      var totalItems = pageItems.length;
      var itemLimit = _this.attr('data-paginate-items');

      //insert pagination markup
      var paginationUl;
      var isTable = false;
      if(_this.parent().is('table')){
        isTable = true;
        $('<ul class="pagination"><div class="numbers"></div></ul>').insertAfter(_this.parent());
        paginationUl = _this.parent().next('.pagination').find('.numbers');
        _this.parent().next('.pagination').prepend('<li class="back"><a href="#"></a></li>');
        _this.parent().next('.pagination').append('<li class="next"><a href="#"></a></li>');
      }else{
        $('<ul class="pagination"><div class="numbers"></div></ul>').insertAfter(_this);
        paginationUl = _this.next('.pagination').find('.numbers');
        _this.next('.pagination').prepend('<li class="back"><a href="#"></a></li>');
        _this.next('.pagination').append('<li class="next"><a href="#"></a></li>');
      }

      if(typeof itemLimit !== typeof undefined && itemLimit !== false){
        if(itemLimit === ''){
          itemLimit = 9;
        }else{
          itemLimit = ~~(itemLimit);
        }
      }else{
        //set default item limit
        itemLimit = 9;
      }
      var item = 0;
      for(var i = 0; i < totalItems; i += itemLimit) {
        item++;
        if(isTable === true){
          pageItems.slice(i, i + itemLimit).addClass('pg-page-' + item);
        }else{
          pageItems.slice(i, i + itemLimit).wrapAll('<div class="pg-page-' + item + '"></div>');
        }
        paginationUl.append('<li><a href="#" class="pg-link-' + item + '">' + item + '</a></li>');
      }

      var pgLink = paginationUl.find('[class^="pg-link-"]'); //*
      var pages = pgLink.length;

      if(pages < 2){
        if(isTable === true){
          elpFirst = _this.parent().next('.pagination').hide();
        }else{
          elpFirst = _this.next('.pagination').hide();
        }
      }

      _this.find('[class^="pg-page-"]').each(function(){
        var i = $(this).index() + 1;
        if(pages > 11){
          if (i > 5){
            paginationUl.find('.pg-link-' + i).parent().hide();
          }
        }
      });
      paginationUl.find('.pg-link-' + pages).parent().show();

      //insert ellipses
      paginationUl.find('li:first-child').addClass('active');
      $('<li class="pagination-ellipsis-last" style="display:none;">&hellip;</li>').insertBefore(paginationUl.find('li:last-child'));
      $('<li class="pagination-ellipsis-first" style="display:none;">&hellip;</li>').insertAfter(paginationUl.find('li:first-child'));

      var index = 1;
      var thisPage;
      var elpFirst, elpLast;
      if(isTable === true){
        elpFirst = _this.parent().next('.pagination').find('.pagination-ellipsis-first');
        elpLast = _this.parent().next('.pagination').find('.pagination-ellipsis-last');
      }else{
        elpFirst = _this.next('.pagination').find('.pagination-ellipsis-first');
        elpLast = _this.next('.pagination').find('.pagination-ellipsis-last');
      }

      if (pages > 11){
        elpLast.show();
      }

      var backBtn = paginationUl.parent().find('.back');
      var nextBtn = paginationUl.parent().find('.next');

      backBtn.attr('disabled','disabled'); //start the back button as disabled

      pgLink.click(function(e){
        e.preventDefault();
        var el = $(this);
        el.parent().addClass('active').siblings().removeClass('active');
        index = ~~(el.attr('class').split('-')[2]);
        if(pages > 11){
          updatePagination(index, el.attr('class'));
        }
        //make the clicked page link page visible
        thisPage = _this.find('.pg-page-' + index);
        if(isTable === true){
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        }else{
          if(!thisPage.is(':visible')){
            thisPage.show().siblings().hide();
          }
        }
        if(index == 1){
          if(!backBtn.is('[disabled]')){
            backBtn.attr('disabled','disabled');
          }
        }else{
          backBtn.removeAttr('disabled');
        }
        if(index == pages){
          if(!nextBtn.is('[disabled]')){
            nextBtn.attr('disabled','disabled');
          }
        }else{
          nextBtn.removeAttr('disabled','disabled');
        }
      });

      backBtn.click(function(e){
        e.preventDefault();
        var el = $(this);
        index--;
        if(pages > 11){
          updatePagination(index, el.attr('class'));
        }
        if(index < 1){
          index = 1;
        }else if(index == 1) {
          el.attr('disabled','disabled');
        }
        //make the previous page visible
        thisPage = _this.find('.pg-page-' + index);
        if(isTable === true){
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        }else{
          if(!thisPage.is(':visible')){
            thisPage.show().siblings().hide();
          }
        }
        paginationUl.find('.pg-link-' + index).parent().addClass('active').siblings().removeClass('active');
        if(nextBtn.is('[disabled]')){
          nextBtn.removeAttr('disabled');
        }
      });
      nextBtn.click(function(e){
        e.preventDefault();
        var el = $(this);
        index++;
        if(pages > 11){
          updatePagination(index, el.attr('class'));
        }
        if(index > pages){
          index = pages;
        }else if(index == pages){
          el.attr('disabled','disabled');
        }
        paginationUl.find('.pg-link-' + index).parent().addClass('active').siblings().removeClass('active');
        //make the next page visible
        thisPage = _this.find('.pg-page-' + index);
        if(isTable === true){
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        }else{
          if(!thisPage.is(':visible')){
            thisPage.show().siblings().hide();
          }
        }
        if(backBtn.is('[disabled]')){
          backBtn.removeAttr('disabled');
        }
      });
      //update callback
      function updatePagination(inx, btn){
        var newIndex = inx + 2;
        var oldIndex = inx - 3;
        //when clicking on page number links
        if(!btn.match(/next/gi) && !btn.match(/back/gi)){
          if(inx > 5 && inx < (pages - 4)){
            paginationUl.find('.pg-link-' + inx).parent().siblings().hide();
            elpLast.show(); elpFirst.show();
            //basicaly create this layout: < 1... 5 6 [7] 8 9...20 >
            paginationUl.find('.pg-link-1' + ', .pg-link-' + (inx + 1) + ', .pg-link-' + (inx + 2) +
            ', .pg-link-' + (inx - 1) + ', .pg-link-' + (inx - 2) + ', .pg-link-' + pages).parent().show();
          }
          //to control the last group of page links: < 1...12 14 [15] 16 17 18 >
          if(inx > (pages - 5) && inx <= (pages - 2)){
            elpLast.hide();
            paginationUl.find('.pg-link-' + (inx - 3)).parent().hide();
            paginationUl.find('.pg-link-' + (inx - 2) + ', .pg-link-' + (pages - 1) + ', .pg-link-' + (pages - 2)).parent().show();
            if(inx == (pages - 4) || inx == (pages - 3)){
              paginationUl.find('.pg-link-' + (inx - 3) + ', .pg-link-' + (inx - 4)).parent().hide();
              paginationUl.find('.pg-link-' + (inx + 1) + ', .pg-link-' + (inx - 1)).parent().show();
            }
          }
          if(inx > (pages - 3)){
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); //hide all page links
            paginationUl.find('.pg-link-1' + ', .pg-link-' + (pages - 4) + ', .pg-link-' + (pages - 3) +
            ', .pg-link-' + (pages - 2) + ', .pg-link-' + (pages - 1) + ', .pg-link-' + pages).parent().show();
          }
          //if clicking very last page link
          if(inx == pages){
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); //hide all page links
            //then show last 5
            paginationUl.find('.pg-link-1' + ', .pg-link-' + pages + ', .pg-link-' + (pages - 1) + ', .pg-link-' + (pages - 2) +
            ', .pg-link-' + (pages - 3) + ', .pg-link-' + (pages - 4)).parent().show();
          }
          //to control first group of page links: < 1 2 3 5 [5] 6 7...18 >
          if (inx > 2 && inx < 6){ //3-5
            elpFirst.hide();
            paginationUl.find('.pg-link-' + (inx + 3)).parent().hide();
            paginationUl.find('.pg-link-' + (inx + 1) + ', .pg-link-' + (inx - 1) + ', .pg-link-' +
            (inx - 2) + ', .pg-link-2').parent().show();
            if(inx == 4 || inx == 5){
              paginationUl.find('.pg-link-' + (inx + 2)).parent().show();
              paginationUl.find('.pg-link-' + (inx + 4)).parent().hide();
            }
          }
          if(inx == 1 || inx == 2 || inx == 3){
            paginationUl.find('.pg-link-6, .pg-link-7').parent().hide();
          }
          //in case clicking very first page link from random location
          if(inx == 1){
            //set up first 5
            elpLast.show();
            elpFirst.hide();
            pgLink.parent().hide(); //hide all page links
            //then show first 5
            paginationUl.find('.pg-link-1, .pg-link-2, .pg-link-3, .pg-link-4, .pg-link-5' + ', .pg-link-' + pages).parent().show();
          }
        }
        if(btn.match(/next/gi)){
          //update newer buttons
          if (inx >= 4 && inx < (pages - 2)){
              paginationUl.find('.pg-link-' + newIndex).parent().show();
              if(inx >= (pages - 4)){
                elpLast.hide();
                paginationUl.find('.pg-link-' + (pages - 1)).parent().show();
              }
          }
          //update older buttons
          if(inx > 5 && inx < (pages - 1)){
            elpFirst.show();
            paginationUl.find('.pg-link-' + oldIndex).parent().hide();
            paginationUl.find('.pg-link-' + 2).parent().hide();
          }
        }
        if(btn.match(/back/gi)){
          if(inx > 5 && inx < (pages - 2)){
            newIndex = newIndex + 1;
            oldIndex = oldIndex + 1;
            paginationUl.find('.pg-link-' + oldIndex).parent().show();
            paginationUl.find('.pg-link-' + newIndex).parent().hide();
            paginationUl.find('.pg-link-' + pages).parent().show(); //always show last page btn
            if(inx == (pages - 4)){
              paginationUl.find('.pg-link-' + (pages - 1)).parent().show();
            }
            if(inx == (pages - 5)){
              paginationUl.find('.pg-link-' + (pages - 1)).parent().hide();
              elpLast.show();
            }
          }else if (inx <= 5) { //when you navigate back into the lower numbers again
            paginationUl.find('.pg-link-' + 2 + ', .pg-link-' + 3).parent().show();
            elpFirst.hide();
            if(inx <= 5 && inx >= 3){
              paginationUl.find('.pg-link-' + (newIndex + 1)).parent().hide();
            }
          }
        }
      }
    });
    return this;
  };
}(jQuery));


/* Site Search (Client Side)
* ======================= */
(function($){
  'use strict';
  $.fn.siteSearch = function(){
    var _this = $(this);
    var searchFile = _this.attr('data-search-file');
    if(typeof searchFile !== typeof undefined && searchFile !== false){
      if(searchFile === ''){
        searchFile = 'js/site-search.json';
      }else{
        searchFile = searchFile;
      }
    }else{
      searchFile = 'js/site-search.json';
    }
    searchFile = $.getJSON(searchFile)
    .done(function(data) {
      //only insert search container if not there
      if(!_this.next('.searchResults-container').length){
        $('<div class="searchResults-container"></div>').insertAfter(_this);
      }
      var srContainer = _this.next('.searchResults-container');
      srContainer.addClass('hide');
      _this.keyup(function(){
        var searchResults = '';
        var searchedData = $(this).val();
        if(searchedData !== ''){
          searchedData = new RegExp(searchedData, "gi");
          $(data).each(function(key, val){
            if(val.pagetitle.match(searchedData) || val.metadata.match(searchedData)){
              searchResults += '<a href="' + val.href + '" class="searchResult-link"><div class="searchResult"><strong>' + val.pagetitle;
              searchResults += '</strong><br/>' + val.metadata + '</div></a>';
              srContainer.removeClass('hide');
            }
          });
          srContainer.html(searchResults);
        }else{
          srContainer.addClass('hide');
          srContainer.html('');
        }
      });
    })
    .fail(function() {
      //console.log( "No site search file or JSON syntax is wrong." );
    });
    return this;
  };
}(jQuery));


/* Responsive Tables
* ======================= */
(function($){
  'use strict';
  $.fn.responsiveTables = function(){
    var table = $(this);
    var resizeTimer;
    win.resize(function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(responsiveTables, 250);
    });
    responsiveTables();
    function responsiveTables(){
      var headTitle = [];
      table.each(function(){
        var _this = $(this);
        if(window.matchMedia(mobile).matches){
          _this.find('thead tr td').each(function(){
            headTitle.push($(this).text());
          });
          _this.find('tbody tr td').each(function(){
            $(this).find('b.mobile-title').remove();
            $(this).prepend('<b class="mobile-title">' + headTitle[$(this).index()] + ': </b>');
          });
        }
        else if(window.matchMedia(desktop).matches || window.matchMedia(tablet).matches) {
          _this.find('tbody tr td b.mobile-title').each(function(){
            $(this).remove();
          });
        }
      });
    }
    return this;
  };
}(jQuery));


/* Tabs
* ======================= */
(function($){
  'use strict';
  $.fn.tabs = function(){
    var tabs = $(this);
    var sectionBg = tabs.closest('.section').css('backgroundColor');
    if(sectionBg == 'rgba(0, 0, 0, 0)' || sectionBg == 'transparent'){
      sectionBg = '#ffffff';
    }
    tabs.each(function(){
      var _this = $(this);
      var tabLink = _this.find('.tabs-menu li');

      //set first tab active
      _this.find('.tabs-menu li').first().addClass('active').css('border-bottom','1px solid ' + sectionBg);
      _this.find('.tab-content div:first-child').addClass('active');

      tabLink.click(function(){
        var contentID = $(this).find('a').prop('hash').split('#')[1];
        var li = $(this);li.addClass('active');li.siblings().removeClass('active');
        li.css('border-bottom','1px solid ' + sectionBg);
        li.siblings().css('border-bottom','1px solid transparent');
        var tabContent = li.parent().parent().find('.tab-content .' + contentID);
        tabContent.addClass('active').siblings().removeClass('active');
      });
      tabLink.find('a').click(function(e){e.preventDefault();});
    });
    return this;
  };
}(jQuery));


/* Tooltips
* ======================= */
(function($){
  'use strict';
  $.fn.tooltip = function(){
    var tip  = $(this),
        body = $('body');
    tip.each(function(){
      var _this = $(this);
      var ttPos = _this.attr('data-tooltip-position');
      var ttContent = _this.attr('data-tooltip-content');
      var toolTip,
          liveTip,
          liveTipWidth,
          liveTipHeight,
          liveTipArrow,
          liveArrowHeight,
          liveArrowWidth,
          triggerHeight,
          triggerWidth,
          triggerOffsetLeft,
          triggerOffsetTop;

      if(typeof ttPos !== typeof undefined && ttPos !== false){
        if(ttPos === ''){
          ttPos = 'top';
        }else{
          ttPos = ttPos;
        }
      }else{
        ttPos = 'top';
      }

      if(typeof ttContent !== typeof undefined && ttContent !== false){
        if(ttContent === ''){
          ttContent = 'Content Here';
        }else{
          ttContent = ttContent;
        }
      }else{
        ttContent = 'Content Here';
      }

      _this.mouseover(function(){
        if (window.matchMedia(desktop).matches){
          buildTip();
        }
      });
      _this.mouseleave(function(){
        if (window.matchMedia(desktop).matches){
          body.next('.tip').removeClass('active-tip').remove();
        }
      });
      _this.click(function(){
        if (window.matchMedia(tablet).matches || window.matchMedia(mobile).matches) {
          if(!body.next('.tip').length){
            buildTip();
          }else{
            body.next('.tip').removeClass('active-tip').remove();
          }
        }
      });

      function buildTip(){
        triggerHeight = ~~(_this.outerHeight());
        triggerWidth = ~~(_this.outerWidth());
        triggerOffsetLeft = ~~(_this.offset().left);
        triggerOffsetTop = ~~(_this.offset().top);

        toolTip = $('<span class="tip">' + ttContent + '<div class="tooltip-arrow"></div></span>');
        if(!body.next('.tip').length){
          toolTip.insertAfter(body);
        }

        liveTip = body.next('.tip');
        liveTipArrow = liveTip.find('.tooltip-arrow');
        liveTipWidth = ~~(liveTip.outerWidth());
        liveTipHeight = ~~(liveTip.outerHeight());

        //set arrow class here based on position
        if(ttPos.match(/top/gi)){
          liveTipArrow.addClass('at');
        }else if (ttPos.match(/bottom/gi)) {
          liveTipArrow.addClass('ab');
        }else if (ttPos.match(/right/gi)) {
          liveTipArrow.addClass('ar');
        }else if (ttPos.match(/left/gi)) {
          liveTipArrow.addClass('al');
        }

        liveArrowHeight = ~~(liveTip.find('.tooltip-arrow').outerHeight());
        liveArrowWidth = ~~(liveTip.find('.tooltip-arrow').outerWidth());

        if(ttPos.match(/top/gi) || ttPos.match(/bottom/gi)){
          if(liveTipWidth <= triggerWidth){
            liveTip.css('left', (triggerOffsetLeft) + ((triggerWidth - liveTipWidth) / 2));
          }else if (liveTipWidth > triggerWidth) {
            liveTip.css('left', (triggerOffsetLeft) - ((liveTipWidth - triggerWidth) / 2));
          }
          if(ttPos.match(/top/gi)){
            liveTip.css('top', (triggerOffsetTop - liveTipHeight) - (liveArrowHeight));
          }else if (ttPos.match(/bottom/gi)) {
            liveTip.css('top', (triggerOffsetTop + triggerHeight) + (liveArrowHeight));
          }
        }
        if(ttPos.match(/right/gi) || ttPos.match(/left/gi)){
          if(triggerHeight >= liveTipHeight){
            liveTip.css('top', (triggerOffsetTop) + ((triggerHeight - liveTipHeight) / 2));
          }else if (triggerHeight < liveTipHeight) {
            liveTip.css('top', (triggerOffsetTop) - ((liveTipHeight - triggerHeight) / 2));
          }
          if(ttPos.match(/right/gi)){
            liveTip.css('left', (triggerOffsetLeft + triggerWidth) + liveArrowWidth);
          }else if (ttPos.match(/left/gi)) {
            liveTip.css('left', (triggerOffsetLeft) - (liveTipWidth + liveArrowWidth));
          }
          //vertically center arrows for left/right positioned tips
          liveTipArrow.css('top', (liveTipHeight / 2) - (liveArrowHeight / 2));
        }
        liveTip.addClass('active-tip');
      }
    });
    return this;
  };
}(jQuery));


/* Form Validator
* ======================= */
(function($){
  'use strict';
  $.fn.formValidate = function(){
    var form = $(this);
    form.each(function(){
      var _this = $(this);
      _this.submit(function(e){
        _this.find('input[type=text], input[type=email], input[type=number], textarea, select')
        .not('.checkbox-group input').not('.radio-group input').each(function(){
          var el = $(this);
          var inputType = el.attr('type');
          var msg, typeMessage;
          var newMsgElement = $('<div class="validator-message">' +
          '<div class="validator-message-required"></div>' +
          '<div class="validator-message-type"></div>' +
          '<div class="validator-message-min"></div>' +
          '<div class="validator-message-max"></div>' +
          '<div class="validator-message-value"></div>' +
          '<div class="validator-message-regex"></div>' +
          '</div>');

          if(!el.next('.validator-message').length){
            newMsgElement.insertAfter(el);
          }

            if(el.attr('data-validator') == 'required'){
              el.keyup(function(){
                if(el.val() !== ''){
                  el.removeClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-required').fadeOut();
                }else{
                  el.addClass('validator-required-border');
                  var msgAttr = el.attr('data-validator-msg');
                  if(typeof msgAttr !== typeof undefined && msgAttr !== false){
                      msg = el.attr('data-validator-msg');
                  }else{
                      msg = 'This value is required.';
                  }
                  el.next('.validator-message').find('.validator-message-required').html(msg).fadeIn();
                }
              });
              //key up functions for blank value validation
              el.keyup(function(){
                if(el.val() !== ''){
                  el.removeClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-required').fadeOut();
                }else{
                  el.addClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-required').html(msg).fadeIn();
                }
              });//end key up
            }

            if(el.attr('data-validator') == 'required' && el.val() == ''){
              e.preventDefault();
              el.addClass('validator-required-border');

              //set the error message
              var msgAttr = el.attr('data-validator-msg');

              //check for custom msg, if none assign the default
              if(typeof msgAttr !== typeof undefined && msgAttr !== false){
                  msg = el.attr('data-validator-msg');
              }else{
                  msg = 'This value is required.';
              }

              el.next('.validator-message').find('.validator-message-required').html(msg).fadeIn();

            } //end if for blank value validation

            //min, max validation
            var minAttr = el.attr('data-validator-min');
            var maxAttr = el.attr('data-validator-max');
            var minMsg, maxMsg, inputValue;

            if(typeof minAttr !== typeof undefined && minAttr !== false || typeof maxAttr !== typeof undefined && maxAttr !== false){

                //if min attribute exists
                if(typeof minAttr !== typeof undefined && minAttr !== false){
                  minAttr = el.attr('data-validator-min');
                  if(inputType == 'number'){
                    minMsg = 'Value must be at least ' + minAttr + '.';
                    inputValue = ~~(el.val());
                  }else{
                    minMsg = 'There is a minimun limit of ' + minAttr + ' charachters for this value.';
                    inputValue = el.val().length;
                  }
                }
                //if max attribute exists
                if(typeof maxAttr !== typeof undefined && maxAttr !== false){
                  maxAttr = el.attr('data-validator-max');
                  if(inputType == 'number'){
                    inputValue = ~~(el.val());
                    maxMsg = 'Value must not be greater than ' + maxAttr + '.';
                  }else{
                    maxMsg = 'There is a maximum limit of ' + maxAttr + ' charachters for this value.';
                    inputValue = el.val().length;
                  }
                }

                //if user input is less than the min value
                if(el.val() !== '' || el.attr('data-validator') == 'required'){

                  if(inputValue < minAttr){
                    e.preventDefault();
                    el.addClass('validator-required-border');
                    el.next('.validator-message').find('.validator-message-min').html(minMsg).fadeIn();
                  }
                  el.keyup(function(){
                    if(inputType == 'number'){
                      inputValue = ~~(el.val());
                    }else{
                      inputValue = el.val().length;
                    }
                    if(el.val() !== ''){
                      if(inputValue < minAttr){
                        el.addClass('validator-required-border');
                        el.next('.validator-message').find('.validator-message-min').html(minMsg).fadeIn();
                      }else{
                        if(typeof maxAttr == typeof undefined && maxAttr == false){
                          el.removeClass('validator-required-border');
                        }
                        if(typeof maxAttr !== typeof undefined && maxAttr !== false && inputValue <= maxAttr){
                          el.removeClass('validator-required-border');
                        }
                        el.next('.validator-message').find('.validator-message-min').fadeOut();
                      }
                    }
                  });

                  //if user input is more than the max value
                  if(inputValue > maxAttr){
                    e.preventDefault();
                    el.addClass('validator-required-border');
                    el.next('.validator-message').find('.validator-message-max').html(maxMsg).fadeIn();
                  }
                  el.keyup(function(){
                    if(inputType == 'number'){
                      inputValue = ~~(el.val());
                    }else{
                      inputValue = el.val().length;
                    }
                    if(el.val() !== ''){
                      if(inputValue > maxAttr){
                        el.addClass('validator-required-border');
                        el.next('.validator-message').find('.validator-message-max').html(maxMsg).fadeIn();
                      }else{
                        if(typeof minAttr == typeof undefined && minAttr == false){
                          el.removeClass('validator-required-border');
                        }
                        if(typeof minAttr !== typeof undefined && minAttr !== false && inputValue >= minAttr){
                          el.removeClass('validator-required-border');
                        }
                        el.next('.validator-message').find('.validator-message-max').fadeOut();
                      }
                    }
                  });
                }
            } //end min, max validation

            //number value only check
            var valAttr = el.attr('data-validator-value');
            var valMsg;

            if(typeof valAttr !== typeof undefined && valAttr !== false && valAttr.match(/number/i)){
              valAttr = el.attr('data-validator-value');
              valMsg = 'Value must be an integer.';

              if(el.val() !== '' || el.attr('data-validator') == 'required'){

                if(!$.isNumeric(el.val())){
                  e.preventDefault();
                  el.addClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-value').html(valMsg).fadeIn();
                }
                el.keyup(function(){
                  if(el.val() !== ''){
                    if(!$.isNumeric(el.val())){
                      el.addClass('validator-required-border');
                      el.next('.validator-message').find('.validator-message-value').html(valMsg).fadeIn();
                    }else{
                      el.removeClass('validator-required-border');
                      el.next('.validator-message').find('.validator-message-value').fadeOut();
                    }
                  }
                });
              }
            }

            //regex value only check
            var regexAttr = el.attr('data-validator-regex');
            var regexMsg;

            if(typeof regexAttr !== typeof undefined && regexAttr !== false){
              regexAttr = el.attr('data-validator-regex');
              regexAttr = new RegExp(regexAttr);
              regexMsg = 'Value not entered in a correct format.';

              if(el.val() !== '' || el.attr('data-validator') == 'required'){

                if(!el.val().match(regexAttr)){
                  e.preventDefault();
                  el.addClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-regex').html(regexMsg).fadeIn();
                }
                el.keyup(function(){
                  if(el.val() !== ''){
                    if(!el.val().match(regexAttr)){
                      el.addClass('validator-required-border');
                      el.next('.validator-message').find('.validator-message-regex').html(regexMsg).fadeIn();
                    }else{
                      el.removeClass('validator-required-border');
                      el.next('.validator-message').find('.validator-message-regex').fadeOut();
                    }
                  }
                });
              }
            }

            //email validation
            if(inputType == 'email' && el.attr('data-validator') == 'required'){

              if(typeof msgAttr !== typeof undefined && msgAttr !== false){
                  msg = el.attr('data-validator-msg');
              }else{
                  msg = 'This value is required.';
              }
              var emailFormat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
              if(!el.val().match(emailFormat)){
                e.preventDefault();
                var emailMsg = 'Valid email required';

                el.next('.validator-message').find('.validator-message-type').html(emailMsg).fadeIn();
              }
              el.keyup(function(){
                if(el.val().match(emailFormat)){
                  el.removeClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-type').fadeOut();
                }else{
                  el.addClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-type').html(emailMsg).fadeIn();
                }
              });
            } //end email validation

            //select (dropdown) validation
            if(el.is('select')){
              el.change(function(){
                if(el.val() !== ''){
                  el.removeClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-required').fadeOut();
                }else{
                  el.addClass('validator-required-border');
                  el.next('.validator-message').find('.validator-message-required').html(msg).fadeIn();
                }
              });
            } //end select validation

        });

        //checkbox and radio validation
        _this.find('.checkbox-group, .radio-group').each(function(){
          var el = $(this), type, findType;
          var newMsgElement = $('<div class="validator-message"><div class="validator-message-required"></div></div>');

          if(el.hasClass('radio-group')){
            findType = el.find('input[type=radio]');
            type = 'input[type=radio]';
          }

          if(el.hasClass('checkbox-group')){
            findType = el.find('input[type=checkbox]');
            type = 'input[type=checkbox]';
          }

          if(el.attr('data-validator') == 'required' && el.find(type + ':checked').length <= 0){
            e.preventDefault();
            findType.addClass('validator-required-border');

            if(!el.find('.validator-message').length){
              el.append(newMsgElement);
            }

            //set the error message
            var msgAttr = el.attr('data-validator-msg');
            var msg;

            //check for custom msg, if none assign the default
            if(typeof msgAttr !== typeof undefined && msgAttr !== false){
                msg = el.attr('data-validator-msg');
            }else{
                msg = 'You must check at least one.';
            }
            el.find('.validator-message').find('.validator-message-required').html(msg).fadeIn();

            //on checked
            findType.change(function(){
              if(el.find(type + ':checked').length > 0){
                findType.removeClass('validator-required-border');
                el.find('.validator-message').find('.validator-message-required').fadeOut();
              }else{
                findType.addClass('validator-required-border');
                el.find('.validator-message').find('.validator-message-required').html(msg).fadeIn();
              }
            });
          }
        });
      });
    });
    return this;
  };
}(jQuery));


/* Video Player
* ======================= */
(function($){
  'use strict';
  $.fn.videoPlayer = function(){
    var videoContainer = $(this);
    videoContainer.each(function(){
      var _this = $(this);
      var video = _this.find('.video').get(0);
      var thisNode = _this.get(0);
      var controlsContainer = _this.find('.video-controls');
      var playBtn = _this.find('.play');
      var pauseBtn = _this.find('.pause');
      var volume = _this.find('.volume-slider');
      var mute = _this.find('.mute');
      var progress = _this.find(".progress");
      var progressBar = _this.find(".progressBar");
      var fullScreenBtn = _this.find('.full-screen');
      var timeElapsed = _this.find('.current-time');
      var totalTime = _this.find('.total-time');
      var timeContainer = _this.find('.video-time');
      var sliderContainer = _this.find('.volume-slider-container');
      var overlay = _this.find('.video-overlay');
      var initialOverlayBg = overlay.css('background-color');
      var overlayPlayBtn = overlay.find('.video-playBtn');

      //bind the control toggling only once after clicking on video
      _this.one('click', toggleControls);

      //don't let the following buttons trigger the control toggles.
      pauseBtn.click(stopP);
      fullScreenBtn.click(stopP);
      mute.click(stopP);
      timeContainer.click(stopP);
      sliderContainer.click(stopP);


      overlay.click(function(){
        if (video.paused || video.ended) {
          video.play();
          overlay.css('background-color','transparent');
          if(overlayPlayBtn.is(':visible')){
            overlayPlayBtn.fadeOut();
          }
        }else{
          video.pause();
          overlay.css('background-color', initialOverlayBg);
          if(!overlayPlayBtn.is(':visible')){
            overlayPlayBtn.fadeIn();
          }
        }
      });

      playBtn.click(playVideo);
      pauseBtn.click(pauseVideo);
      volume.change(setVolume);
      mute.click(toggleMute);
      fullScreenBtn.click(toggleFullScreen);

      //set timeElapsed to 0 at first
      timeElapsed.html('0:00');

      //wait for the video meta data to come in, then show total time
      video.addEventListener('durationchange', function() {
        var totalSeconds = parseInt(video.duration % 60);
        var totalMinutes = parseInt(video.duration / 60, 10);
        var totalHours = parseInt(totalMinutes / 60, 10);
        if(totalSeconds < 10){
          totalSeconds = ':0' + totalSeconds;
        }else{
          totalSeconds = ':' + totalSeconds;
        }
        if(totalHours > 0){
          totalHours = totalHours + ':';
        }else{
          totalHours = '';
        }
        totalTime.html(totalHours + totalMinutes + totalSeconds);
        if(_this.parent().hasClass('video-feature-container')){
          _this.parent().find('.video-duration').html('0:00');
          _this.parent().find('.video-totalTime').html(totalHours + totalMinutes + totalSeconds);
        }
      }, false);

      //Updates time of video for progress
      video.addEventListener("timeupdate", function(){
        var value = 0;
        var minutes = parseInt(video.currentTime / 60, 10);
        var seconds = parseInt(video.currentTime % 60);
        var hours = parseInt(minutes / 60, 10);
        if (video.currentTime > 0) {
           value = Math.floor((100 / video.duration) * video.currentTime);
        }
        if(seconds < 10){
          seconds = ':0' + seconds;
        }else{
          seconds = ':' + seconds;
        }
        if(hours > 0){
          hours = hours + ':';
        }else{
          hours = '';
        }
        progress.css('width', value + '%');
        timeElapsed.html(hours + minutes + seconds);
        if(_this.parent().hasClass('video-feature-container')){
            _this.parent().find('.video-duration').html(hours + minutes + seconds);
        }
      }, false);

      //When video is over, show the overlay and play button again
      video.addEventListener('ended', function(){
        overlay.css('background-color', initialOverlayBg);
        if(!overlayPlayBtn.is(':visible')){
          overlayPlayBtn.fadeIn();
        }
      }, false);

      //Enable the dragging events to update/change the video time
      var progressDrag = false;
      var doc = $(document);
      progressBar.on('vmousedown', function(e) {
        progressDrag = true;
        updateProgress(e.pageX);
      });

      doc.on('vmouseup', function(e) {
        if(progressDrag){
          progressDrag = false;
          updateProgress(e.pageX);
        }
      });
      doc.on('vmousemove', function(e) {
        if(progressDrag){
          updateProgress(e.pageX);
        }
      });

      //****video callbacks****//

      //stoping propagation
      function stopP(e){
        e.stopPropagation();
      }

      //Update progress for dragging on time bar
      function updateProgress(p){
        var dur = video.duration;
        var pos = p - progressBar.offset().left;
        var perc = 100 * pos / progressBar.width();

        if(perc > 100) {
            perc = 100;
        }
        if(perc < 0) {
            perc = 0;
        }

        video.currentTime = dur * perc / 100;
        progress.css('width', perc + '%');
      }

      function toggleControls(){
        var hideControls;
        _this.on('vmousemove', function(e) {
            if(controlsContainer.hasClass('slide-down')){
              controlsContainer.removeClass('slide-down');
              progress.removeClass('solo-progress');
              progressBar.removeClass('solo-progress');
              clearTimeout(hideControls);
              hideControls = setTimeout(function(){
                if(!controlsContainer.hasClass('slide-down')){
                    controlsContainer.addClass('slide-down');
                    progress.addClass('solo-progress');
                    progressBar.addClass('solo-progress');
                }
              },3000);
            }
        });
        _this.find('.video-control-bar').on('vmouseover', function(e) {
          clearTimeout(hideControls);
        });
        _this.find('.video-control-bar').on('mouseleave', function(e) {
          clearTimeout(hideControls);
          hideControls = setTimeout(function(){
            if(!controlsContainer.hasClass('slide-down')){
                controlsContainer.addClass('slide-down');
                progress.addClass('solo-progress');
                progressBar.addClass('solo-progress');
            }
          },3000);
        });
        _this.mouseleave(function(){
            clearTimeout(hideControls);
            if(!controlsContainer.hasClass('slide-down')){
                controlsContainer.addClass('slide-down');
                progress.addClass('solo-progress');
                progressBar.addClass('solo-progress');
            }
        });
      }

      function playVideo() {
       if (video.paused || video.ended) {
          video.play();
          overlay.css('background-color','transparent');
          if(overlayPlayBtn.is(':visible')){
            overlayPlayBtn.fadeOut();
          }
       }
      }

      function pauseVideo() {
          video.pause();
          overlay.css('background-color', initialOverlayBg);
          if(!overlayPlayBtn.is(':visible')){
            overlayPlayBtn.fadeIn();
          }
      }

      function setVolume() {
         video.volume = volume.val();
      }

      function toggleMute() {
         video.muted = !video.muted;
         mute.toggleClass('mute-off');
      }

      function toggleFullScreen() {
          if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
              if (thisNode.requestFullScreen) {
                  thisNode.requestFullScreen();
              } else if (thisNode.mozRequestFullScreen) {
                  thisNode.mozRequestFullScreen();
              } else if (thisNode.webkitRequestFullScreen) {
                  thisNode.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
              } else if (thisNode.msRequestFullscreen) {
                  thisNode.msRequestFullscreen();
              }
          } else {
              if (document.cancelFullScreen) {
                  document.cancelFullScreen();
              } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
              } else if (document.webkitCancelFullScreen) {
                  document.webkitCancelFullScreen();
              } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
              }
          }
      }
    });
    return this;
  };
}(jQuery));


/* Anchor Scrolling
* ======================= */
(function($){
  'use strict';
  $.fn.anchorScroll = function(){
    var _this = $(this);
    _this.find('a').click(function(e){
      var _this = $(this.hash);
      if(typeof _this.offset() !== typeof undefined && _this.offset() !== false){
        e.preventDefault();
        $('html,body').animate({scrollTop:_this.offset().top}, 500);
      }
    });
    return this;
  };
}(jQuery));


/* Back To Top Scrolling
* ======================= */
(function($){
  'use strict';
  $.fn.topScroll = function(){
    var _this = $(this);
    var topScrollBtn = $('.topScroll-button');
    _this.scroll(function(){
      if (_this.scrollTop() > 500) {
        if (!topScrollBtn.is(':visible')){
          topScrollBtn.fadeIn();
        }
      } else {
        if (topScrollBtn.is(':visible')){
          topScrollBtn.fadeOut();
        }
      }
    });
    topScrollBtn.click(function(e){
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 'slow');
      return false;
    });
    return this;
  };
}(jQuery));


/* Filtering and Sorting
* ======================= */
(function($){
  'use strict';
  $.fn.sortFilter = function(){
    var sortFilter = $(this);
    sortFilter.each(function(){
      var _this = $(this);
      var filterContainer;
      var isTable = false;
      if(_this.next().is('table')){
        isTable = true;
        filterContainer = _this.next('table').find('.filter-container');
      }else{
        filterContainer = _this.next('.filter-container');
      }
      var filterBtn = _this.find('button');
      var filterSearch = _this.find('.search');
      var filterSearchAttr = filterSearch.attr('data-filter-search');
      var animationSpeed = 200;

      if(typeof filterSearchAttr !== typeof undefined && filterSearchAttr !== false){
        if(filterSearchAttr.match(/true/gi)){
          var searchContentContainer = filterContainer;
          searchContentContainer.children().each(function(){
            $(this).addClass('search-element-parent');
          });
          //store the initial pagination states for resetting
          var initialState;
          searchContentContainer.ready(function(){
            if (searchContentContainer.hasClass('paginate')){
              if (isTable === true){
                initialState = _this.next('table').find('.filter-container').html();
              }else{
                initialState = _this.next('.filter-container').html();
              }
            }
          });
          filterSearch.keyup(function(){
            var searchedElement = searchContentContainer.find('.search-element-parent');
            var input = $(this).val();
            var thisText = input.toString();
            var searchedText = new RegExp(thisText, 'gim');
            //var searchedText = new RegExp('(?![^<]*>)' + thisText + '\b(?![^ <>])', 'gim');
            var newText;
            searchedElement.each(function(){
              var el = $(this);
              var elText = el.text();
              //var elText = el.html();
              //elText = elText.replace('<mark class="search-result">','').replace('</mark>','');
              if (elText.match(searchedText)){
                if(!el.is(':visible')){
                  if(isTable === true){
                    el.removeClass('hide');
                    el.addClass('show-tr');
                  }else{
                    if(filterContainer.hasClass('paginate')){
                      if(!el.parent().is(':visible')){
                        el.parent().show();
                      }
                    }
                    el.fadeIn();
                  }
                }
                if(input !== ''){
                  /*stashing for future use (highlighting text)
                  need to not get <tag text>
                  elText = elText.replace(new RegExp('(?![^<>]*>) *' + thisText + '*([^<> \d])', "igm"),'<mark class="search-result">' + thisText + '</mark>');
                  el.html(elText);*/
                }
              }else{
                if(isTable === true){
                  el.removeClass('show-tr');
                  el.addClass('hide');
                }else{
                  el.fadeOut();
                }
              }
              if(input === ''){
                if(filterContainer.hasClass('paginate')){
                  searchContentContainer.html(initialState);
                  if(isTable === true){
                    searchContentContainer.parent().next('.pagination').find('.pg-link-1').trigger('click');
                  }else{
                    searchContentContainer.next('.pagination').find('.pg-link-1').trigger('click');
                  }
                }
              }
            });
          });
        }
      }
      var filterContainerContent;
      filterContainer.ready(function(){
        filterContainerContent = filterContainer.html();
      });
      filterBtn.each(function(){
        var thisBtn = $(this);
        var thisBtnAttr = thisBtn.attr('data-filter-category');
        var thisResetAttr = thisBtn.attr('data-filter-reset');
        var thisSortAttr = thisBtn.attr('data-filter-sort');
        //if reset button is present
        if(typeof thisResetAttr !== typeof undefined && thisResetAttr !== false && thisResetAttr.match(/true/gi)){
          thisBtn.click(function(){
            filterContainer.html(filterContainerContent);
            if(filterContainer.hasClass('paginate')){
              filterContainer.next('.pagination').find('.pg-link-1').trigger('click');
            }
            filterContainer.find('[data-filter-category]').each(function(){
              var el = $(this);
              if(!el.is(':visible')){
                setTimeout(function(){
                  el.fadeIn(animationSpeed);
                }, animationSpeed);
              }
            });
          });
        }
        //if a data-filter-category exists on a button
        if(typeof thisBtnAttr !== typeof undefined && thisBtnAttr !== false){
          thisBtn.click(function(){
          filterContainer.find('[data-filter-category]').each(function(){
            var el = $(this);
            var filterContentAttr = el.attr('data-filter-category');
            if(filterContentAttr !== thisBtnAttr){
              el.fadeOut(animationSpeed);
            }else{
              if(filterContainer.hasClass('paginate')){
                if(!el.parent().is(':visible')){
                  el.parent().show();
                }
              }
              setTimeout(function(){
                el.fadeIn(animationSpeed);
              },animationSpeed);
            }
          });
          });
        }
        //if a data-filter-sort exists on a button
        if(typeof thisSortAttr !== typeof undefined && thisSortAttr !== false){
          thisBtn.click(function(){
            var newBuild = sortContent('[data-filter-sort]', 'data-filter-sort', thisSortAttr);
            filterContainer.html(newBuild);
          });
        }
      });
      function sortContent(el, attr, sortBtn){
        return $(filterContainer.find(el).toArray().sort(function(a, b){
          var top = new Date($(a).attr(attr));
          var bottom = new Date($(b).attr(attr));
          if(sortBtn.match(/newest/gi)){
            return bottom - top;
          }else if(sortBtn.match(/oldest/gi)){
            return top - bottom;
          }
        }));
      }
    });
    return this;
  };
}(jQuery));
