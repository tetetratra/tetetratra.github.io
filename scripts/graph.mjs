import { createHash } from 'node:crypto';
export const normalize = value => value.normalize('NFKC').trim().toLowerCase();
const idFor = key => createHash('sha256').update(key).digest('hex').slice(0,16);

export function makeGraph(pages) {
  const nodes = pages.map(page=>({...page, id:idFor('page:'+page.file), references:0}));
  const byTitle = new Map();
  for (const node of nodes) if (!byTitle.has(normalize(node.title))) byTitle.set(normalize(node.title),node);
  const edges = [], seen = new Set();
  for (const source of [...nodes]) for (const tag of source.tags) {
    const key = normalize(tag);
    let target = byTitle.get(key);
    if (!target) {
      target = {id:idFor('tag:'+key),title:tag,tags:[],preview:[],references:0,isTag:true};
      nodes.push(target);byTitle.set(key,target);
    }
    const pair = source.id+':'+target.id;
    if (source.id === target.id || seen.has(pair)) continue;
    seen.add(pair);edges.push({source:source.id,target:target.id});target.references++;
  }
  layout(nodes,edges);
  return {nodes,edges};
}

// 同じ入力なら同じ座標になり、拡大時には再配置しない。
function layout(nodes,edges) {
  const byId = new Map(nodes.map(node=>[node.id,node]));
  const outgoing = new Map(nodes.map(node=>[node.id,[]]));
  for (const edge of edges) outgoing.get(edge.source).push(byId.get(edge.target));
  const hubs = nodes.filter(node=>node.references>=3).sort((a,b)=>b.references-a.references||a.id.localeCompare(b.id));
  const anchors = new Map();
  hubs.forEach((hub,i)=>{
    const angle=i*2.399963229728653, radius=270*Math.sqrt(i);
    hub.x=Math.cos(angle)*radius;hub.y=Math.sin(angle)*radius*.78;
    anchors.set(hub.id,hub);
  });
  const groups = new Map();
  for (const node of nodes.filter(node=>!anchors.has(node.id))) {
    const targets = outgoing.get(node.id).sort((a,b)=>b.references-a.references||a.id.localeCompare(b.id));
    let anchor = targets.find(target=>anchors.has(target.id));
    if (!anchor) {
      const sources=edges.filter(edge=>edge.target===node.id).map(edge=>edge.source);
      anchor=sources.flatMap(id=>outgoing.get(id)).filter(target=>anchors.has(target.id)).sort((a,b)=>b.references-a.references)[0];
    }
    anchor ||= hubs[parseInt(node.id.slice(0,8),16)%Math.max(1,hubs.length)] || {id:'origin',x:0,y:0};
    const group=groups.get(anchor.id)||[];group.push(node);groups.set(anchor.id,group);
    node.group=anchor.id;
  }
  for (const [key,group] of groups) {
    const anchor=anchors.get(key)||{x:0,y:0};
    group.sort((a,b)=>b.references-a.references||a.id.localeCompare(b.id));
    group.forEach((node,i)=>{
      const angle=i*2.399963229728653+parseInt(node.id.slice(0,4),16)/65536;
      const radius=90+43*Math.sqrt(i);
      node.x=anchor.x+Math.cos(angle)*radius;node.y=anchor.y+Math.sin(angle)*radius;
    });
  }
}

export function preview(body) {
  return body.split('\n').filter(line=>line.trim()&&!/^\s*(```|~~~|!\[|\|[\s:-]+\|)/.test(line))
    .map(line=>line.trim().replace(/^[-*#>]+\s*/, '').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*`]/g,''))
    .filter(Boolean).slice(0,8).map(line=>line.slice(0,200));
}
