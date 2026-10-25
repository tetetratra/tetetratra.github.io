const stage=document.querySelector('#graph'), canvas=stage.querySelector('canvas'), ctx=canvas.getContext('2d');
const layer=document.querySelector('#nodes'), detail=document.querySelector('#detail'), search=document.querySelector('#search');
const searchResults=document.querySelector('#search-results');
let graph,byId,adjacent, buttons=new Map(), selected, focusSet, width=innerWidth,height=innerHeight;
let zoom=1,baseScale=1,pan={x:0,y:0},queued=false,visible=[];
const pointers=new Map();let gesture, moved=false;
const normalize=value=>value.normalize('NFKC').trim().toLowerCase();
const threshold=()=>zoom<1.7?3:zoom<2.8?2:zoom<4.5?1:0;
const position=node=>({x:width/2+pan.x+node.x*baseScale*zoom,y:height/2+pan.y+node.y*baseScale*zoom});
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}
function reset(){zoom=1;pan={x:0,y:20};selected=undefined;focusSet=undefined;detail.hidden=true;search.value='';searchResults.hidden=true;const hubs=graph.nodes.filter(n=>n.references>=3);const extent=Math.max(...hubs.map(n=>Math.abs(n.x)),100);const extentY=Math.max(...hubs.map(n=>Math.abs(n.y)),100);baseScale=Math.max(width<641?.16:.12,Math.min((width-150)/(extent*2),(height-230)/(extentY*2)));schedule();}
function setZoom(value,x=width/2,y=height/2){const next=Math.max(.65,Math.min(value,16));const ratio=next/zoom;pan.x=(pan.x+width/2-x)*ratio+x-width/2;pan.y=(pan.y+height/2-y)*ratio+y-height/2;zoom=next;schedule();}
function render(){
  if(!graph)return;
  ctx.clearRect(0,0,width,height);
  const min=threshold();
  const candidates=graph.nodes.filter(n=>n.references>=min||n.id===selected).map(n=>({node:n,...position(n)}));
  visible=candidates.filter(p=>p.x>-220&&p.x<width+220&&p.y>55&&p.y<height-55);
  const visibleIds=new Set(visible.map(p=>p.node.id));
  for(const edge of graph.edges){
    if(!visibleIds.has(edge.source)||!visibleIds.has(edge.target))continue;
    const a=position(byId.get(edge.source)), b=position(byId.get(edge.target));
    const highlight=selected&&(edge.source===selected||edge.target===selected);
    ctx.strokeStyle=highlight?'#6d9c7a99':selected?'#c8d1c31c':'#b9c9b349';ctx.lineWidth=highlight?1.4:.7;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  const ordered=visible.sort((a,b)=>(b.node.id===selected)-(a.node.id===selected)||(focusSet?.has(b.node.id)||false)-(focusSet?.has(a.node.id)||false)||b.node.references-a.node.references||a.node.id.localeCompare(b.node.id));
  const occupied=[],shown=new Set();let labels=0;
  for(const p of ordered){
    const n=p.node, related=focusSet?.has(n.id), active=n.id===selected;
    const size=n.references>=10?4:n.references>=3?3:2;
    ctx.fillStyle=active?'#163f27':selected&&!related?'#a9b7a24d':n.references>=3?'#507b56':'#a6bca0';
    ctx.beginPath();ctx.arc(p.x,p.y,size,0,Math.PI*2);ctx.fill();
    const labelWidth=Math.min(width<641?170:210,32+[...n.title].reduce((sum,c)=>sum+(/[^\x00-\x7f]/.test(c)?12:7),0));
    const box={left:p.x-labelWidth/2-8,right:p.x+labelWidth/2+8,top:p.y-18,bottom:p.y+18};
    if(!active&&occupied.some(b=>box.left<b.right&&box.right>b.left&&box.top<b.bottom&&box.bottom>b.top))continue;
    occupied.push(box);shown.add(n.id);labels++;
    let button=buttons.get(n.id);
    if(!button){button=document.createElement('button');button.type='button';button.className='node';button.dataset.id=n.id;const dot=document.createElement('span');dot.className='node-dot';dot.setAttribute('aria-hidden','true');const title=document.createElement('span');title.className='node-title';title.textContent=n.title;button.append(dot,title);button.title=n.title;button.setAttribute('aria-label',`${n.title}、${n.references}ページから参照${n.preview.length?'、内容を開く':''}`);button.addEventListener('click',()=>{if(moved)return;open(n.id);});layer.append(button);buttons.set(n.id,button);}
    button.hidden=false;button.classList.toggle('hub',n.references>=3);button.classList.toggle('selected',active);button.classList.toggle('related',Boolean(related));button.classList.toggle('dim',Boolean(selected&&!related&&!active));button.setAttribute('aria-expanded',String(active&&!detail.hidden));button.style.left=p.x+'px';button.style.top=p.y+'px';
  }
  for(const [id,button] of buttons)if(!shown.has(id))button.hidden=true;
  document.querySelector('#level').textContent=min?`参照 ${min}件以上`:'すべてのページ';
  document.querySelector('#visible-count').textContent=`${visible.length}件`;
  document.querySelector('#zoom').value=Math.round(zoom*100)+'%';
  document.querySelector('#zoom-out').disabled=zoom<=.65;document.querySelector('#zoom-in').disabled=zoom>=16;
  if(selected&&!detail.hidden)placeDetail();
}
function placeDetail(){const p=position(byId.get(selected));const w=detail.offsetWidth;const h=detail.offsetHeight;let x=p.x+25,y=p.y-25;if(x+w>width-16)x=p.x-w-25;if(width<641){x=16;y=p.y+25;}x=Math.max(16,Math.min(x,width-w-16));y=Math.max(132,Math.min(y,height-h-80));detail.style.left=x+'px';detail.style.top=y+'px';}
function open(id){
  if(selected===id&&!detail.hidden){close();return;}
  selected=id;focusSet=new Set(adjacent.get(id));const n=byId.get(id);detail.hidden=false;
  document.querySelector('#detail-title').textContent=n.title;
  document.querySelector('#detail-kind').textContent=n.isTag?'TAG':'NOTE';
  document.querySelector('#detail-body').textContent=n.preview.join('\n');
  document.querySelector('#preview-note').hidden=!n.preview.length;
  document.querySelector('#detail-count').textContent=`${n.references}ページから参照`;
  const links=document.querySelector('#detail-links');links.replaceChildren();
  const targets=[...focusSet].map(id=>byId.get(id)).sort((a,b)=>b.references-a.references||a.title.localeCompare(b.title,'ja')).slice(0,6);
  for(const target of targets){const button=document.createElement('button');button.type='button';button.textContent=target.title;button.addEventListener('click',()=>{center(target);open(target.id);});links.append(button);}
  searchResults.hidden=true;schedule();
}
function close(){const id=selected;detail.hidden=true;selected=undefined;focusSet=undefined;schedule();buttons.get(id)?.focus({preventScroll:true});}
function center(node){pan={x:-node.x*baseScale*zoom,y:-node.y*baseScale*zoom};schedule();}
function showSearch(){const term=normalize(search.value);searchResults.replaceChildren();if(!term){searchResults.hidden=true;return;}const matches=graph.nodes.filter(n=>normalize(n.title).includes(term)).sort((a,b)=>(normalize(b.title)===term)-(normalize(a.title)===term)||b.references-a.references||a.title.localeCompare(b.title,'ja')).slice(0,100);for(const n of matches){const b=document.createElement('button');b.type='button';b.textContent=n.title;b.addEventListener('click',()=>{search.blur();center(n);open(n.id);});searchResults.append(b);}if(!matches.length){const p=document.createElement('p');p.textContent='一致するページがありません';searchResults.append(p);}searchResults.hidden=false;}
search.addEventListener('input',()=>{if(graph)showSearch();});
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();searchResults.querySelector('button')?.click();});
document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(zoom*1.5));
document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(zoom/1.5));
document.querySelector('#home').addEventListener('click',reset);
document.querySelector('#close-detail').addEventListener('click',close);
document.querySelector('#focus').addEventListener('click',()=>{if(zoom<3)setZoom(3);center(byId.get(selected));detail.hidden=true;schedule();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!detail.hidden)close();searchResults.hidden=true;search.blur();}if(e.key==='/'&&!e.target.closest('input')){e.preventDefault();search.focus();}});
stage.addEventListener('keydown',e=>{if(e.target!==stage)return;const delta={ArrowLeft:[50,0],ArrowRight:[-50,0],ArrowUp:[0,50],ArrowDown:[0,-50]}[e.key];if(delta){e.preventDefault();pan.x+=delta[0];pan.y+=delta[1];schedule();}if(['+','='].includes(e.key)){e.preventDefault();setZoom(zoom*1.5);}if(e.key==='-'){e.preventDefault();setZoom(zoom/1.5);}});
stage.addEventListener('wheel',e=>{e.preventDefault();if(e.ctrlKey||e.metaKey||Math.abs(e.deltaY)>Math.abs(e.deltaX)*2){setZoom(zoom*Math.exp(-e.deltaY*.002),e.clientX,e.clientY);}else{pan.x-=e.deltaX;pan.y-=e.deltaY;schedule();}},{passive:false});
function startGesture(){const points=[...pointers.values()];if(points.length===1)gesture={start:points[0],pan:{...pan}};else if(points.length>=2){const [a,b]=points;gesture={distance:Math.hypot(a.x-b.x,a.y-b.y),mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},pan:{...pan},zoom};}}
stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(!pointers.size)moved=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!e.target.closest('button'))stage.setPointerCapture(e.pointerId);startGesture();});
stage.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const points=[...pointers.values()];if(points.length>=2&&gesture.distance){const [a,b]=points;const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};const next=Math.max(.65,Math.min(gesture.zoom*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance,16));const ratio=next/gesture.zoom;pan.x=(gesture.pan.x+width/2-gesture.mid.x)*ratio+mid.x-width/2;pan.y=(gesture.pan.y+height/2-gesture.mid.y)*ratio+mid.y-height/2;zoom=next;moved=true;}else if(gesture.start){const dx=e.clientX-gesture.start.x,dy=e.clientY-gesture.start.y;if(Math.hypot(dx,dy)>5)moved=true;if(moved){pan.x=gesture.pan.x+dx;pan.y=gesture.pan.y+dy;}}if(moved){stage.classList.add('dragging');schedule();}});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size)startGesture();else{gesture=undefined;stage.classList.remove('dragging');setTimeout(()=>{moved=false;},0);}}
window.addEventListener('pointerup',endPointer);window.addEventListener('pointercancel',endPointer);
window.addEventListener('resize',resize);
try{const response=await fetch('./graph.json',{cache:'no-cache'});if(!response.ok)throw Error('読み込みエラー');graph=await response.json();byId=new Map(graph.nodes.map(n=>[n.id,n]));adjacent=new Map(graph.nodes.map(n=>[n.id,new Set()]));for(const edge of graph.edges){adjacent.get(edge.source).add(edge.target);adjacent.get(edge.target).add(edge.source);}resize();reset();document.querySelector('#loading').hidden=true;}catch(error){document.querySelector('#loading').textContent='読み込めませんでした。再読み込みしてください。';console.error(error);}
