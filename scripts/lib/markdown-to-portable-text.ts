/**
 * Minimal Markdown -> Portable Text converter for the one-off blog migration.
 *
 * Covers what the existing posts actually use: headings, paragraphs, bullet/numbered lists,
 * blockquotes, fenced code, and inline bold/italic/code/links. Anything it can't classify is
 * kept as a paragraph, so no prose is ever dropped.
 */

interface Span {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface Block {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Span[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  language?: string;
  code?: string;
}

let counter = 0;
const key = () => `k${(counter++).toString(36)}`;

/** Split a line into spans, honouring **bold**, *italic*, `code`, and [text](href). */
function toSpans(text: string): { children: Span[]; markDefs: Block["markDefs"] } {
  const children: Span[] = [];
  const markDefs: NonNullable<Block["markDefs"]> = [];

  // One pass over the inline tokens we support; order matters (code before emphasis).
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const push = (value: string, marks: string[]) => {
    if (value) children.push({ _type: "span", _key: key(), text: value, marks });
  };

  while ((match = pattern.exec(text)) !== null) {
    push(text.slice(lastIndex, match.index), []);
    const token = match[0];

    if (token.startsWith("`")) {
      push(token.slice(1, -1), ["code"]);
    } else if (token.startsWith("**") || token.startsWith("__")) {
      push(token.slice(2, -2), ["strong"]);
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const defKey = key();
        markDefs.push({ _key: defKey, _type: "link", href: linkMatch[2] });
        push(linkMatch[1], [defKey]);
      } else {
        push(token, []);
      }
    } else {
      push(token.slice(1, -1), ["em"]);
    }
    lastIndex = pattern.lastIndex;
  }
  push(text.slice(lastIndex), []);

  if (children.length === 0) push(text, []);
  return { children, markDefs };
}

function textBlock(text: string, style: string, listItem?: string): Block {
  const { children, markDefs } = toSpans(text);
  return {
    _type: "block",
    _key: key(),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    children,
    markDefs: markDefs ?? [],
  };
}

export function markdownToPortableText(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.split("\n");
  let i = 0;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(textBlock(paragraph.join(" ").trim(), "normal"));
      paragraph = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith("```")) {
      flushParagraph();
      const language = line.trim().replace(/^```/, "").trim() || "text";
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ _type: "codeBlock", _key: key(), language, code: code.join("\n") });
      continue;
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      // h1 in body text would clash with the page title, so demote it.
      const level = Math.min(Math.max(heading[1].length, 2), 4);
      blocks.push(textBlock(heading[2].trim(), `h${level}`));
      i++;
      continue;
    }

    // Pipe table: consume the contiguous run of | rows, skipping the |---| separator.
    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushParagraph();
      const rows: { _key: string; _type: "tableRow"; cells: string[] }[] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const raw = lines[i].trim();
        if (!/^\|[\s:|-]+\|$/.test(raw)) {
          rows.push({
            _key: key(),
            _type: "tableRow",
            cells: raw.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()),
          });
        }
        i++;
      }
      if (rows.length) {
        blocks.push({ _type: "table", _key: key(), hasHeader: true, rows } as unknown as Block);
      }
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      flushParagraph();
      blocks.push(textBlock(line.replace(/^>\s?/, "").trim(), "blockquote"));
      i++;
      continue;
    }

    // List item
    const bullet = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      flushParagraph();
      const text = (bullet ? bullet[1] : numbered![1]).trim();
      blocks.push(textBlock(text, "normal", bullet ? "bullet" : "number"));
      i++;
      continue;
    }

    // Horizontal rule — no Portable Text equivalent here, so drop it.
    if (/^\s*([-*_])\s*\1\s*\1[\s\S]*$/.test(line.trim()) && line.trim().length >= 3 && !line.trim().match(/[a-z0-9]/i)) {
      flushParagraph();
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    paragraph.push(line.trim());
    i++;
  }

  flushParagraph();
  return blocks;
}
