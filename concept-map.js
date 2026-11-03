export const layers = [
  { id: 'foundation', name: '기초 개념', subtitle: '배움을 시작하는 언어', x: 48 },
  { id: 'principle', name: '핵심 원리', subtitle: '데이터가 학습이 되는 과정', x: 398 },
  { id: 'application', name: '응용', subtitle: '실제 문제로 넓어지는 연결', x: 748 },
];

// Relationships are educational connections, not a directed execution graph.
export function buildMapModel(concepts, edges, selectedId = 'gradient') {
  const selected = concepts.find(c => c.id === selectedId) || concepts.find(c => c.id === 'gradient') || concepts[0];
  const related = new Set();
  const activeEdges = edges.filter(([from, to]) => from === selected.id || to === selected.id);
  for (const [from, to] of activeEdges) related.add(from === selected.id ? to : from);
  const nodes = concepts.map(c => {
    const layer = layers.find(l => l.id === c.layer);
    const siblings = concepts.filter(n => n.layer === c.layer);
    const index = siblings.findIndex(n => n.id === c.id);
    return { ...c, x: layer.x, y: 124 + index * (528 / Math.max(1, siblings.length - 1)), selected: c.id === selected.id, related: related.has(c.id) };
  });
  const byId = new Map(nodes.map(c => [c.id, c]));
  const links = edges.map(([from, to, label]) => {
    const a = byId.get(from), b = byId.get(to);
    if (!a || !b) throw new Error(`Unknown concept in relationship: ${from} / ${to}`);
    const sameLayer = a.x === b.x;
    const bend = sameLayer ? Math.max(12, a.x - 76) : (a.x + b.x) / 2;
    return {
      from, to, label, active: from === selected.id || to === selected.id,
      labelX: (a.x + b.x) / 8 + bend * .75, labelY: (a.y + b.y) / 2,
      showLabel: !sameLayer && Math.abs(a.y - b.y) > 48,
      path: `M ${a.x} ${a.y} C ${bend} ${a.y}, ${bend} ${b.y}, ${b.x} ${b.y}`,
    };
  });
  return { selected, nodes, links, related };
}

export function graphMarkup(concepts, edges, selectedId) {
  const model = buildMapModel(concepts, edges, selectedId);
  const { selected, nodes, links } = model;
  const currentLayer = layers.find(l => l.id === selected.layer);
  return `<div class="concept-map">
    <div class="map-meta"><span><i class="legend-dot"></i> 선택한 개념과 연결된 경로</span><span class="map-count">${concepts.length}개 개념 · ${edges.length}개 연결</span><a class="map-quick-detail" href="#concept-detail">상세 설명 ↓</a></div>
    <label class="map-select-label" for="concept-select">개념 바로 선택 <select id="concept-select">${layers.map(layer => `<optgroup label="${layer.name}">${concepts.filter(c => c.layer === layer.id).map(c => `<option value="${c.id}"${c.id === selected.id ? ' selected' : ''}>${c.name}</option>`).join('')}</optgroup>`).join('')}</select></label>
    <div class="map-scroll" tabindex="0" role="region" aria-label="개념 지도. 작은 화면에서는 좌우로 스크롤할 수 있습니다.">
      <div class="map-canvas">
        <svg class="map-connections" viewBox="0 0 960 720" aria-hidden="true" focusable="false">
          ${layers.map(l => `<line class="layer-guide" x1="${l.x}" y1="110" x2="${l.x}" y2="672"/>`).join('')}
          ${links.filter(l => !l.active).map(l => `<path class="map-edge" d="${l.path}" data-from="${l.from}" data-to="${l.to}"/>`).join('')}
          ${links.filter(l => l.active).map(l => `<path class="map-edge active" d="${l.path}" data-from="${l.from}" data-to="${l.to}"><title>${l.label}</title></path>`).join('')}
          ${links.filter(l => l.active && l.showLabel).slice(0,4).map(l => `<g class="edge-label" transform="translate(${l.labelX},${l.labelY})"><rect x="${-(l.label.length * 10 + 16) / 2}" y="-11" width="${l.label.length * 10 + 16}" height="22" rx="5"/><text text-anchor="middle" dominant-baseline="central">${l.label}</text></g>`).join('')}
        </svg>
        ${layers.map((l, i) => `<div class="layer-heading ${l.id === currentLayer.id ? 'current' : ''}" style="left:${l.x / 9.6}%;"><span class="layer-number">0${i + 1}</span><strong>${l.name}</strong><small>${l.subtitle}</small></div>`).join('')}
        ${nodes.map(c => `<a href="#map/${c.id}" class="map-node ${c.selected ? 'selected' : c.related ? 'related' : ''}" data-concept="${c.id}" style="left:${c.x / 9.6}%;top:${c.y / 7.2}%;"${c.selected ? ' aria-current="true"' : ''}><span class="node-dot" aria-hidden="true"></span><span class="node-name">${c.name}</span></a>`).join('')}
      </div>
    </div>
    <p class="map-mobile-hint">← 지도를 좌우로 밀어 연결을 살펴보세요 →</p>
    <div class="map-caption"><span class="connection-icon" aria-hidden="true">⌘</span><div><strong>하나의 개념에서, 더 넓은 이해로.</strong><p>점을 선택하고 아래의 연결 이유를 따라가 보세요.</p></div><a href="#concept-detail">설명 보기 <span aria-hidden="true">↗</span></a></div>
  </div>`;
}
