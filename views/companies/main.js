//var myNav = document.getElementById('navbar');
//window.onscroll = function() {
//if (document.body.scrollTop >= 200) {
//    myNav.classList.add(".scrolled");

// }

//};
//const nav = document.getElementById('navbar');
//window.onscroll = function() {
//if (document.body.scrollTop >= 200 || document.documentElement.scrollTop >= 200) {
//   nav.classList.add("scrolled");
// nav.classList.remove("nav-transparent");
//} else {
//   nav.classList.add("nav-transparent");
//  nav.classList.remove("scrolled");
//}
//};
(window).scroll(function() {
    ('navbar').toggleClass('scrolled', (this).scrollTop() > 200);
});