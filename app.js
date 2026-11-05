(function(){

  // 見出しを行ごとのマスクに分解
  document.querySelectorAll('.sec h2').forEach(function(h){
    h.innerHTML=h.innerHTML.split(/<br\s*\/?>/).map(function(t){return '<span class="ml"><span>'+t+'</span></span>'}).join('');
  });
  // 子要素の順番ディレイ
  [['.cards .card',.09],['.chips li',.1],['.steps li',.15],['.rows > div',.1],['.res li',.1],['.score div',.12]].forEach(function(g){
    var groups={};
    document.querySelectorAll(g[0]).forEach(function(el){
      var p=el.parentNode; p.__i=(p.__i||0); el.style.setProperty('--d',(p.__i*g[1]).toFixed(2)+'s'); p.__i++;
    });
  });
  // 帯・タグ：スクロールの速さで加速、背景の点がゆっくりずれる
  var lastY=window.scrollY, vel=0, tracks=[];
  function getTracks(){ tracks=document.getAnimations().filter(function(a){return a.animationName==='slide'}); }
  setTimeout(getTracks,300);
  window.addEventListener('scroll',function(){
    var y=window.scrollY; vel=Math.max(-12,Math.min(12,(y-lastY)*0.5)); lastY=y;
    document.body.style.setProperty('--bgy',(-y*0.25)+'px');
  },{passive:true});
  (function loop(){
    vel*=0.92;
    tracks.forEach(function(a){ a.playbackRate=1+Math.abs(vel)*0.9; });
    requestAnimationFrame(loop);
  })();

  // スクロールで要素を出す
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){io.observe(el)});
  } else { rv.forEach(function(el){el.classList.add('in')}); }

  // 数字のカウントアップ
  var cnt=document.querySelectorAll('[data-count]');
  var co=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return; co.unobserve(e.target);
      var el=e.target, to=+el.dataset.count, t0=performance.now(), d=900;
      (function step(t){ var p=Math.min(1,(t-t0)/d); el.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); })(t0);
    });
  },{threshold:.6});
  cnt.forEach(function(el){ el.textContent='0'; co.observe(el); });

  // 進捗バー
  var bar=document.getElementById('progress');
  function prog(){ var h=document.documentElement; var m=h.scrollHeight-h.clientHeight; bar.style.width=(m>0?h.scrollTop/m*100:0)+'%'; }
  window.addEventListener('scroll',prog,{passive:true}); prog();

  // INDEXの現在地
  var links=[].slice.call(document.querySelectorAll('#index a'));
  var map={};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
  var secs=Object.keys(map).map(function(id){return document.getElementById(id)}).filter(Boolean);
  var so=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ links.forEach(function(a){a.classList.remove('on')}); map[e.target.id].classList.add('on'); }
    });
  },{rootMargin:'-35% 0px -55% 0px'});
  secs.forEach(function(s){so.observe(s)});

  // FAQ（1つずつ開く）
  var qs=document.querySelectorAll('.q button');
  qs.forEach(function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      qs.forEach(function(x){x.setAttribute('aria-expanded','false')});
      b.setAttribute('aria-expanded',open?'false':'true');
    });
  });
})();
