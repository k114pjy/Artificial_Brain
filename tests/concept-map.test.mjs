import test from 'node:test';
import assert from 'node:assert/strict';
import { concepts, edges } from '../concepts.js';
import { layers, buildMapModel, graphMarkup } from '../concept-map.js';

test('existing concept links and saved review IDs remain valid', () => {
  const legacy = ['data','variable','list','array','matrix','mean','group','derivative','loss','gradient','neuron','network','backprop','evaluation'];
  const ids = new Set(concepts.map(c => c.id));
  assert.equal(ids.size, concepts.length);
  for (const id of legacy) assert.ok(ids.has(id), `Existing concept ${id} must be preserved`);
  const pairs = new Set();
  for (const [from,to,label] of edges) {
    assert.ok(ids.has(from) && ids.has(to));
    assert.notEqual(from,to);
    const pair = [from,to].sort().join('/');
    assert.ok(!pairs.has(pair), `Duplicate edge ${pair}`);
    pairs.add(pair);
    assert.ok(label.length);
  }
  for (const c of concepts) {
    assert.ok(layers.some(l => l.id === c.layer));
    assert.ok(c.category && c.english && c.summary && c.why && c.source, `${c.id} has incomplete content`);
    assert.equal(new URL(c.url).protocol, 'https:');
    assert.ok(edges.some(([from,to]) => from === c.id || to === c.id), `${c.id} is disconnected`);
  }
});

test('each selection highlights exactly its direct educational relationships', () => {
  for (const c of concepts) {
    const model = buildMapModel(concepts,edges,c.id);
    assert.equal(model.nodes.filter(n => n.selected).length,1);
    assert.equal(model.nodes.find(n => n.selected).id,c.id);
    const neighbors = new Set();
    for (const [from,to] of edges) {
      if (from === c.id) neighbors.add(to);
      if (to === c.id) neighbors.add(from);
    }
    assert.deepEqual(model.related,neighbors);
    for (const link of model.links) {
      assert.equal(link.active,link.from === c.id || link.to === c.id);
      assert.ok(!link.path.includes('NaN'));
    }
    for (const n of model.nodes) assert.equal(n.related,neighbors.has(n.id));
  }
});

test('three-layer layout keeps every concept and label within the map', () => {
  const model = buildMapModel(concepts,edges,'gradient');
  for (const layer of layers) {
    const nodes = model.nodes.filter(n => n.layer === layer.id);
    assert.ok(nodes.length > 0);
    for (const [i,node] of nodes.entries()) {
      assert.equal(node.x,layer.x);
      assert.ok(node.x >= 0 && node.x + 200 <= 960);
      assert.ok(node.y >= 110 && node.y <= 670);
      if (i) assert.ok(node.y - nodes[i-1].y >= 64, 'Touch targets must not overlap');
    }
  }
});

test('unknown bookmarks fall back to gradient descent and the map has keyboard links', () => {
  assert.equal(buildMapModel(concepts,edges,'removed-id').selected.id,'gradient');
  const html = graphMarkup(concepts,edges,'gradient');
  assert.ok(html.includes('aria-current="true"'));
  for (const c of concepts) assert.ok(html.includes(`href="#map/${c.id}"`));
  assert.ok(!/<canvas|WebGL|brain3d|three\./.test(html));
});
