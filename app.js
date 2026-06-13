/* shared behaviour: nav, reveal, gallery render, filter, lightbox */
(function(){
  const $=(s,c=document)=>c.querySelector(s);
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];

  /* nav scroll + burger */
  const nav=$('.nav');
  if(nav){
    const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>40);
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
    const burger=$('.burger',nav),links=$('.links',nav);
    if(burger)burger.addEventListener('click',()=>links.classList.toggle('show'));
    $$('.links a',nav).forEach(a=>a.addEventListener('click',()=>links.classList.remove('show')));
  }

  /* reveal on scroll */
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  const observeReveals=()=>$$('.reveal:not(.in)').forEach(el=>io.observe(el));
  observeReveals();

  /* ---------- works gallery ---------- */
  const grid=$('#grid');
  const ERA_LABEL={era1:'Beginnings',era2:'Real time',era3:'On the road',era4:'The figure',era5:'From imagination',era6:'A handwriting',graphic:'Digital & graphic'};
  if(grid && window.PORTFOLIO){
    const all=PORTFOLIO.all;
    const render=(filter)=>{
      grid.innerHTML='';
      all.filter(x=>filter==='all'||x.era===filter).forEach(x=>{
        const fig=document.createElement('figure');
        fig.className='reveal';
        fig.dataset.full='images/'+x.file;
        fig.dataset.era=x.era;
        const img=document.createElement('img');
        img.loading='lazy';img.src='images/'+x.file;img.alt=ERA_LABEL[x.era]||'Artwork by Vaishnavi Murthy';
        fig.appendChild(img);grid.appendChild(fig);
      });
      observeReveals();bindLightbox();
    };
    /* filters */
    const fbar=$('#filters');
    if(fbar){
      const eras=['all',...Object.keys(ERA_LABEL).filter(e=>all.some(x=>x.era===e))];
      eras.forEach((e,i)=>{
        const b=document.createElement('button');
        b.textContent=e==='all'?'All works':ERA_LABEL[e];
        b.dataset.era=e;if(i===0)b.classList.add('on');
        b.addEventListener('click',()=>{$$('button',fbar).forEach(x=>x.classList.remove('on'));b.classList.add('on');render(e);window.scrollTo({top:grid.offsetTop-160,behavior:'smooth'});});
        fbar.appendChild(b);
      });
    }
    render('all');
  }

  /* ---------- lightbox ---------- */
  const lb=$('#lb'),lbImg=$('#lbImg'),lbCount=$('#lbCount');
  let items=[],idx=0;
  function bindLightbox(){
    $$('figure[data-full]').forEach(f=>{
      if(f._bound)return;f._bound=true;
      f.addEventListener('click',()=>{
        items=$$('figure[data-full]').filter(x=>x.offsetParent!==null);
        idx=items.indexOf(f);show();
      });
    });
  }
  function show(){
    if(!lb)return;
    const f=items[idx];lbImg.src=f.dataset.full;
    if(lbCount)lbCount.textContent=(idx+1)+' / '+items.length;
    lb.classList.add('open');document.body.style.overflow='hidden';
  }
  function close(){lb.classList.remove('open');document.body.style.overflow='';}
  function step(d){idx=(idx+d+items.length)%items.length;show();}
  if(lb){
    $('#lbClose').addEventListener('click',close);
    $('#lbPrev').addEventListener('click',e=>{e.stopPropagation();step(-1);});
    $('#lbNext').addEventListener('click',e=>{e.stopPropagation();step(1);});
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);
    });
  }
  bindLightbox();
})();
