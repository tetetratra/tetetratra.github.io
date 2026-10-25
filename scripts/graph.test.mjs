import test from 'node:test';import assert from 'node:assert/strict';
import { makeGraph,preview } from './graph.mjs';
const page=(title,tags)=>({file:title+'.md',title,tags,preview:[]});
test('同名タグは実ページに統合し、自己参照・重複を除いて参照元ページ数を数える',()=>{
 const graph=makeGraph([page('Ruby',[]),page('A',['Ruby','ruby','A']),page('B',['Ruby','仕事術']),page('C',['Ruby','仕事術'])]);
 assert.equal(graph.nodes.filter(n=>n.title==='Ruby').length,1);assert.equal(graph.nodes.find(n=>n.title==='Ruby').references,3);
 assert.equal(graph.nodes.find(n=>n.title==='仕事術').references,2);assert.equal(graph.edges.length,5);
 for(const e of graph.edges)assert.notEqual(e.source,e.target);
});
test('配置は入力から決定され、全段階で同じノード座標を使える',()=>{
 const input=[page('A',['X']),page('B',['X']),page('C',['X'])];assert.deepEqual(makeGraph(input),makeGraph(input));
 for(const n of makeGraph(input).nodes){assert(Number.isFinite(n.x));assert(Number.isFinite(n.y));}
});
test('抜粋は8項目までで、Markdownのリンク先や画像を混入させない',()=>{
 const text='- [リンク](https://example.test)\n![図](asset.png)\n```ruby\nrails s -p 3001\n```\n'+Array(10).fill('- メモ').join('\n');
 const lines=preview(text);assert.equal(lines.length,8);assert.equal(lines[0],'リンク');assert(lines.includes('rails s -p 3001'));assert(!lines.join('').includes('asset.png'));
});
