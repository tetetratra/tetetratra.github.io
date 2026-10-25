import { readFile, readdir, mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { makeGraph,preview } from './graph.mjs';
const source=process.env.KNOWLEDGE_DIR || '../scrapbox-notes';
const files=(await readdir(source+'/notes')).filter(file=>file.endsWith('.md')).sort();
const pages=[];
for(const file of files){
  const text=await readFile(source+'/notes/'+file,'utf8');
  const match=text.match(/^---\ntags: (.+)\n---\s*\n# ([^\n]+)\n([\s\S]*)$/);
  if(!match)throw Error('記事形式が不正: '+file);
  pages.push({file,title:match[2],tags:JSON.parse(match[1]).split(',').map(t=>t.trim()).filter(Boolean),preview:preview(match[3])});
}
const graph=makeGraph(pages);
await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('site','dist',{recursive:true});
const version=createHash('sha256').update(await readFile('site/app.js')).update(await readFile('site/style.css')).digest('hex').slice(0,12);
const html=(await readFile('site/index.html','utf8')).replace('./style.css', './style.css?v='+version).replace('./app.js','./app.js?v='+version);
await writeFile('dist/index.html',html);
await writeFile('dist/graph.json',JSON.stringify(graph));await writeFile('dist/.nojekyll','');
console.log(`記事${pages.length}件、ノード${graph.nodes.length}件、参照${graph.edges.length}件`);
