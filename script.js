
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
toggle?.addEventListener('click',()=>{const o=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(o));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const dialog=document.getElementById('lightbox'),dialogImg=document.getElementById('lightbox-img');
document.getElementById('lightbox-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});

const grid=document.getElementById('gallery-grid'),filters=document.getElementById('gallery-filters');
function render(items,category='Toutes'){
  const list=category==='Toutes'?items:items.filter(x=>x.category===category);
  grid.innerHTML='';
  list.forEach(item=>{
    const b=document.createElement('button');
    b.className='gallery-item'; b.type='button';
    b.innerHTML=`<img src="${item.image}" alt="${item.title||'Réalisation'}" loading="lazy"><span class="gallery-caption"><strong>${item.title||'Réalisation'}</strong><small>${item.category||''}</small></span>`;
    b.addEventListener('click',()=>{dialogImg.src=item.image;dialogImg.alt=item.title||'Réalisation';dialog.showModal();});
    grid.appendChild(b);
  });
}
fetch('/content/gallery.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{
  const items=Array.isArray(data.items)?data.items:[];
  const cats=['Toutes',...new Set(items.map(x=>x.category).filter(Boolean))];
  filters.innerHTML='';
  cats.forEach((cat,i)=>{
    const b=document.createElement('button'); b.textContent=cat; if(i===0)b.className='active';
    b.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(items,cat);});
    filters.appendChild(b);
  });
  render(items);
}).catch(()=>grid.innerHTML='<p>La galerie est momentanément indisponible.</p>');

if(window.netlifyIdentity){
  window.netlifyIdentity.on('init',user=>{
    if(!user&&window.location.hash.includes('invite_token'))window.netlifyIdentity.open('signup');
  });
}
