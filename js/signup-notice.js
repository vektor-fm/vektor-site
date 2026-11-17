// A rejected sign-up must say so (2026-11-17).
//
// The signup Worker (vektor-producer, funnel/ig-dm-webhook/src/signup.js) sends the
// reader back to the page they came from with ?e=email (bad address) or ?e=captcha
// (Turnstile check failed). The page used to show nothing, so the reader believed
// they were on the list. This puts one line above the first sign-up form that is
// actually on screen (the sticky bar on issue pages), in the page's own .note
// style, announced to screen readers.
//
// Loaded on every page with a signup form by scripts/turnstile.mjs (the same pass
// that adds the Turnstile widget), so built and hand-authored pages share one copy.
// thanks.html handles its own ?e= flags (rate, blocked, api ...) inline.
(function(){
  var e; try{ e=new URLSearchParams(location.search).get('e'); }catch(x){ return; }
  var MSG={
    email:'That address did not go through. Check it and try again.',
    captcha:'The spam check did not finish. Reload the page and try again.'
  };
  if(!Object.prototype.hasOwnProperty.call(MSG, e)){ return; }
  function show(){
    var forms=document.querySelectorAll('form[action$="/signup"]'), f=null;
    for(var i=0;i<forms.length;i++){
      if(!forms[i].closest('[hidden]') && forms[i].getClientRects().length){ f=forms[i]; break; }
    }
    if(!f){ return; }
    var p=document.createElement('p');
    p.className='note signup-error';
    p.setAttribute('role','alert');
    p.style.cssText='color:inherit; margin:0 0 var(--p-s); flex:1 1 100%;';
    f.parentNode.insertBefore(p, f);
    p.textContent=MSG[e];
    try{ p.scrollIntoView({block:'center'}); }catch(x){ p.scrollIntoView(); }
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', show); } else { show(); }
})();
