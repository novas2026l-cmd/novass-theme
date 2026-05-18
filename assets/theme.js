(function(){
  'use strict';

  function initReveal(){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(function(el){observer.observe(el);});
  }

  function initHeader(){
    var header=document.querySelector('.site-header');
    if(!header)return;
    window.addEventListener('scroll',function(){
      header.style.boxShadow=window.scrollY>20?'0 2px 20px rgba(0,0,0,0.08)':'none';
    },{passive:true});
  }

  function initGallery(){
    document.querySelectorAll('.product-gallery-thumb').forEach(function(thumb){
      thumb.addEventListener('click',function(){
        var gallery=thumb.closest('.product-gallery');
        var mainImg=gallery&&gallery.querySelector('.product-gallery-main img');
        if(!mainImg)return;
        gallery.querySelectorAll('.product-gallery-thumb').forEach(function(t){t.classList.remove('active');});
        thumb.classList.add('active');
        var src=thumb.querySelector('img')&&thumb.querySelector('img').src;
        if(src){mainImg.style.opacity='0';setTimeout(function(){mainImg.src=src;mainImg.style.opacity='1';},180);mainImg.style.transition='opacity 0.18s ease';}
      });
    });
    document.querySelectorAll('.product-page-thumbs img').forEach(function(thumb){
      thumb.addEventListener('click',function(){
        var section=thumb.closest('.product-page-images');
        var mainImg=section&&section.querySelector('.main-image img');
        if(!mainImg)return;
        section.querySelectorAll('.product-page-thumbs img').forEach(function(t){t.classList.remove('active');});
        thumb.classList.add('active');
        mainImg.style.opacity='0';
        setTimeout(function(){mainImg.src=thumb.src;mainImg.style.opacity='1';},180);
        mainImg.style.transition='opacity 0.18s ease';
      });
    });
  }

  function initQuantity(){
    document.querySelectorAll('.product-quantity').forEach(function(wrap){
      var input=wrap.querySelector('input');
      var minus=wrap.querySelector('[data-action="minus"]');
      var plus=wrap.querySelector('[data-action="plus"]');
      if(!input)return;
      if(minus)minus.addEventListener('click',function(){var v=parseInt(input.value,10)||1;if(v>1)input.value=v-1;});
      if(plus)plus.addEventListener('click',function(){var v=parseInt(input.value,10)||1;input.value=v+1;});
    });
  }

  function initMobileMenu(){
    var toggle=document.querySelector('.header-menu-toggle');
    var nav=document.querySelector('.header-nav');
    if(!toggle||!nav)return;
    var open=false;
    toggle.addEventListener('click',function(){
      open=!open;
      nav.style.display=open?'flex':'';
      nav.style.flexDirection=open?'column':'';
      nav.style.position=open?'absolute':'';
      nav.style.top=open?'72px':'';
      nav.style.left=open?'0':'';
      nav.style.right=open?'0':'';
      nav.style.background=open?'var(--color-bg)':'';
      nav.style.padding=open?'24px':'';
      nav.style.borderBottom=open?'1px solid var(--color-border)':'';
      nav.style.zIndex=open?'99':'';
    });
  }

  function initAddToCart(){
    document.querySelectorAll('[data-add-to-cart]').forEach(function(form){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var btn=form.querySelector('[data-add-to-cart-btn]');
        if(!btn)return;
        var original=btn.textContent;
        btn.textContent='Agregando...';btn.disabled=true;
        var formData=new FormData(form);
        fetch('/cart/add.js',{method:'POST',body:formData})
          .then(function(r){
            if(r.ok){
              btn.textContent='✓ Agregado';btn.style.background='#2E7D32';
              updateCartCount();
              setTimeout(function(){btn.textContent=original;btn.style.background='';btn.disabled=false;},2000);
            }else{btn.textContent=original;btn.disabled=false;}
          }).catch(function(){btn.textContent=original;btn.disabled=false;});
      });
    });
  }

  function updateCartCount(){
    fetch('/cart.js').then(function(r){return r.json();}).then(function(cart){
      document.querySelectorAll('.cart-count').forEach(function(el){
        el.textContent=cart.item_count;
        el.style.display=cart.item_count>0?'flex':'none';
      });
    }).catch(function(){});
  }

  document.addEventListener('DOMContentLoaded',function(){
    initReveal();initHeader();initGallery();initQuantity();initMobileMenu();initAddToCart();updateCartCount();
  });
})();
