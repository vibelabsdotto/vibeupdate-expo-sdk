import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../src/markdown.js';

describe('safe markdown', () => {
  it('parses headings, paragraphs, lists, bold, italic and safe links', () => {
    const blocks = parseMarkdown('# Title\n\nHello **bold** and *italic* [site](https://example.com).\n\n- one\n- [mail](mailto:hi@example.com)');
    expect(blocks.map((block) => block.type)).toEqual(['heading', 'paragraph', 'list']);
    expect(JSON.stringify(blocks)).toContain('https://example.com');
    expect(JSON.stringify(blocks)).toContain('mailto:hi@example.com');
  });

  it.each(['http://example.com', 'javascript:alert(1)', 'file:///tmp/a', 'myapp://secret', '/relative'])('keeps %s non-clickable', (url) => {
    const serialized = JSON.stringify(parseMarkdown(`[unsafe](${url})`));
    expect(serialized).not.toContain('"type":"link"');
    expect(serialized).toContain('unsafe');
  });

  it('rejects HTML and images without exposing their URL', () => {
    const serialized = JSON.stringify(parseMarkdown('<script>alert(1)</script><b>safe text</b> ![secret](https://example.com/tracker.png)'));
    expect(serialized).not.toContain('<script>');
    expect(serialized).not.toContain('<b>');
    expect(serialized).not.toContain('tracker.png');
    expect(serialized).toContain('safe text');
    expect(serialized).toContain('secret');
  });
});
