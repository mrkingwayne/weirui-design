(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(pointer: fine)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LAB={all:'全部',living:'客廳',kitchen:'餐廚',bedroom:'臥室',storage:'系統櫃・收納',process:'施工・交屋',other:'公設・其他'};
const SRC={facebook:'臉書',instagram:'IG',threads:'Threads'};
gsap.registerPlugin(ScrollTrigger,Flip);
// loader
const li=$('#loader i');li.style.width='60%';
function done(){li.style.width='100%';setTimeout(()=>{$('#loader').classList.add('done');intro()},250)}
// hero slideshow
const heroImgs=[0,167,86,2,113,196];const sl=$('#slides'),dots=$('#dots');let hi=0,ht;
heroImgs.forEach((n,i)=>{const im=new Image();im.src=`img/${n}.jpg`;im.alt='作品主視覺';if(!i)im.className='on';sl.appendChild(im);
 const d=document.createElement('i');if(!i)d.className='on';d.onclick=()=>show(i);dots.appendChild(d)});
function show(i){const ims=sl.children,ds=dots.children;ims[hi].classList.remove('on');ds[hi].classList.remove('on');hi=(i+ims.length)%ims.length;ims[hi].classList.add('on');ds[hi].classList.add('on');clearTimeout(ht);ht=setTimeout(()=>show(hi+1),6000)}
sl.children[0].complete?setTimeout(done,300):(sl.children[0].onload=done,setTimeout(done,2500));
ht=setTimeout(()=>show(1),6000);
function intro(){if(RM)return;gsap.from('#h1 .w span',{yPercent:110,duration:1.1,stagger:.15,ease:'power4.out'});gsap.from('.hp,.kick',{y:20,opacity:0,duration:.9,delay:.4,stagger:.1})}
// nav + progress
addEventListener('scroll',()=>{$('#nav').classList.toggle('s',scrollY>40);const h=document.documentElement;$('#bar').style.transform=`scaleX(${scrollY/(h.scrollHeight-innerHeight)})`},{passive:true});
if(!RM){
 gsap.to('#slides',{yPercent:18,ease:'none',scrollTrigger:{trigger:'header',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('#aboutimg',{yPercent:-15,ease:'none',scrollTrigger:{trigger:'#about',scrub:true}});
 gsap.to('#cbg',{yPercent:12,ease:'none',scrollTrigger:{trigger:'#contact',scrub:true}});
 if(FINE)$('header').addEventListener('mousemove',e=>{gsap.to('#slides',{x:(e.clientX/innerWidth-.5)*-24,y:(e.clientY/innerHeight-.5)*-16,duration:1.2})});
}
function reveal(){$$('.rv').forEach(el=>{if(el.dataset.r)return;el.dataset.r=1;if(RM){el.style.opacity=1;el.style.transform='none';return}
 gsap.to(el,{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}})})}
// services spotlight
$$('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));
// process
const steps=[['線上諮詢','私訊「估價」，提供平面圖、需求與預算，先初步評估。'],['現場丈量','到府丈量並了解屋況、管線與生活習慣。'],['平面配置','提出格局與收納配置，討論到滿意為止。'],['3D 渲染・報價','3D 呈現完工樣貌，並提供逐項列明的報價單。'],['簽約施工','依圖施工，定期回報進度，關鍵工程拍照記錄。'],['驗收交屋','逐項驗收、清潔完成後交屋，後續問題持續服務。']];
const hs=$('#hs');hs.innerHTML=steps.map((s,i)=>`<div class="st"><div class="n">0${i+1}</div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('');
const desk=matchMedia('(min-width:900px)').matches&&!RM;
if(desk){$('#phint').textContent='（往下捲動，流程橫向前進）';hs.style.overflow='visible';hs.style.scrollSnapType='none';
 const dist=()=>hs.scrollWidth-hs.parentElement.clientWidth+44;
 gsap.to(hs,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#process',start:'top top',end:()=>'+='+dist(),pin:true,scrub:.6,invalidateOnRefresh:true,onUpdate:s=>$('#pb').style.width=s.progress*100+'%'}});
 gsap.from('.st',{opacity:0,y:60,stagger:.08,duration:.8,scrollTrigger:{trigger:'#process',start:'top 70%'}});
}else hs.addEventListener('scroll',()=>{$('#pb').style.width=(hs.scrollLeft/(hs.scrollWidth-hs.clientWidth))*100+'%'},{passive:true});
// cursor + magnetic
if(FINE&&!RM){document.body.classList.add('cur-on');const c1=$('.cur'),c2=$('.cur2');
 addEventListener('mousemove',e=>{gsap.set(c1,{x:e.clientX,y:e.clientY});gsap.to(c2,{x:e.clientX,y:e.clientY,duration:.35})});
 document.addEventListener('mouseover',e=>{const t=e.target.closest('.fc,.gc,.strip');c2.classList.toggle('big',!!t);c2.textContent=t?(t.classList.contains('strip')?'拖曳':'查看'):''});
 $$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.35,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))});
}
// data
fetch('cases.json').then(r=>r.json()).then(cases=>{
 const feat=cases.filter(c=>c.feat),fe=$('#feat');
 fe.innerHTML=feat.map(c=>`<div class="fc rv" data-i="${cases.indexOf(c)}"><img loading="lazy" src="img/${c.imgs[0]}.jpg" alt="${c.name}"><span class="cnt">${c.imgs.length} 張</span><div class="ov"><small>${c.sub}</small><h3>${c.name}</h3><div class="more">查看案場 →</div></div></div>`).join('');
 // tilt
 if(FINE&&!RM)$$('.fc').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
 // grid
 const g=$('#g');g.innerHTML=cases.map((c,i)=>`<div class="gc" data-i="${i}" data-c="${c.cats.join(' ')}"><img loading="lazy" src="img/${c.imgs[0]}_t.jpg" alt="${c.name}"><div class="ov"><b>${c.name}</b><span>${c.sub}・${c.imgs.length} 張</span></div></div>`).join('');
 const f=$('#f');['all','living','kitchen','bedroom','storage','process','other'].forEach(k=>{const b=document.createElement('button');b.textContent=LAB[k];b.dataset.k=k;if(k=='all')b.className='on';
  b.onclick=()=>{const st=Flip.getState('.gc');$$('#f button').forEach(x=>x.classList.toggle('on',x===b));$$('.gc').forEach(el=>el.classList.toggle('hide',k!='all'&&!el.dataset.c.split(' ').includes(k)));
   if(RM)return;Flip.from(st,{duration:.6,ease:'power2.inOut',scale:true,absolute:true,onEnter:e=>gsap.fromTo(e,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.5}),onLeave:e=>gsap.to(e,{opacity:0,scale:.8,duration:.4})})};f.appendChild(b)});
 document.addEventListener('click',e=>{const t=e.target.closest('.fc,.gc');if(t)openCase(cases[+t.dataset.i])});
 // strip
 const pool=feat.flatMap(c=>c.imgs.slice(1,4));const tr=$('#track');const html=pool.map(n=>`<img loading="lazy" src="img/${n}_t.jpg" alt="作品" draggable="false">`).join('');tr.innerHTML=html+html;
 let x=0,v=RM?0:-.5,drag=false,lx=0;const strip=$('#strip');
 function loop(){const w=tr.scrollWidth/2;if(!drag)x+=v;if(x<-w)x+=w;if(x>0)x-=w;tr.style.transform=`translate3d(${x}px,0,0)`;requestAnimationFrame(loop)}loop();
 strip.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;strip.classList.add('drag');strip.setPointerCapture(e.pointerId)});
 strip.addEventListener('pointermove',e=>{if(!drag)return;x+=e.clientX-lx;lx=e.clientX});
 const up=()=>{drag=false;strip.classList.remove('drag')};strip.addEventListener('pointerup',up);strip.addEventListener('pointercancel',up);
 reveal();ScrollTrigger.refresh();
 window.__cases=cases;
});
reveal();
// viewer
let ms,ts;const cv=$('#cv');
function openCase(c){
 $('#cvt').textContent=c.name;$('#cvs').textContent=c.sub.toUpperCase();$('#cvsrc').textContent='來源：'+c.src.map(s=>SRC[s]).join('、');
 $('#cvm').innerHTML=c.imgs.map(n=>`<div class="swiper-slide"><img src="img/${n}.jpg" loading="lazy" alt="${c.name}"><div class="swiper-lazy-preloader"></div></div>`).join('');
 $('#cvth').innerHTML=c.imgs.map(n=>`<div class="swiper-slide"><img src="img/${n}_t.jpg" loading="lazy" alt=""></div>`).join('');
 ms&&ms.destroy(true,true);ts&&ts.destroy(true,true);
 ts=new Swiper('#cv .thumbs',{slidesPerView:'auto',spaceBetween:8,freeMode:true,watchSlidesProgress:true});
 ms=new Swiper('#cv .main',{spaceBetween:10,keyboard:{enabled:true},grabCursor:true,speed:RM?0:500,navigation:{nextEl:'#cv .swiper-button-next',prevEl:'#cv .swiper-button-prev'},thumbs:{swiper:ts},
  on:{slideChange(s){$('#cvn').textContent=`${s.activeIndex+1} / ${c.imgs.length}`}}});
 $('#cvn').textContent=`1 / ${c.imgs.length}`;cv.classList.add('on');document.body.style.overflow='hidden';
}
function closeCase(){cv.classList.remove('on');document.body.style.overflow=''}
$('#cvx').onclick=closeCase;addEventListener('keydown',e=>{if(e.key=='Escape'&&cv.classList.contains('on'))closeCase()});
window.__open=i=>openCase(window.__cases[i]);
})();
