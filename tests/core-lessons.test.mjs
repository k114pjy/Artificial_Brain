import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculum } from '../curriculum.js';
import { coreLessons, realProjects, coreLessonPage } from '../core-lessons.js';
import { concepts } from '../concepts.js';

test('the twelve-stage outline and the eight core lessons keep valid learning links', () => {
  assert.equal(curriculum.length,12);
  assert.equal(Object.keys(coreLessons).length,8);
  const ids=new Set(concepts.map(c=>c.id));
  for (const [id,lesson] of Object.entries(coreLessons)) {
    assert.ok(lesson.basics && lesson.mechanics && lesson.code && lesson.reading && lesson.experiment);
    assert.ok(realProjects[id]?.code && realProjects[id]?.task);
    for (const related of lesson.links) assert.ok(ids.has(related),`${id} links to missing ${related}`);
    const page=coreLessonPage(id,concepts);
    assert.ok(page.includes('실제 공개 데이터 프로젝트'));
    assert.ok(page.includes('data-project-notes'));
    assert.ok(page.includes('https://doi.org/10.24432/C56C76'));
  }
});
