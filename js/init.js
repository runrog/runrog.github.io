$(document).ready(function(){
  $('.nav-main').mainNav();
  $('.modal').modal();
  $('.row').equalHeights();
  $('.footer').footerNav();
  $('.imageGallery').imageGallery();
  $('.anchor-scroll').anchorScroll();
  $('.filter-controls').sortFilter();
  $('.paginate').pagination();
  $(window).topScroll();
  //close menu if in tablet or mobile since this is a one page site w/anchor links
  $('.nav-main-topLink').click(function(){
    $('body').next('.slide-menu').find('.nav-main-topLink').click(function(){
      if(window.matchMedia(mobile).matches || window.matchMedia(tablet).matches){
        $(this).closest('.slide-menu').find('.close-menu').trigger('click');
      }
    });
  });
});
