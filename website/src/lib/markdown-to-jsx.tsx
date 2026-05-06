import React from 'react';

export function markdownToJsx(markdown: string): React.ReactNode {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold mt-4 mb-2">
          {parseInline(line.slice(4))}
        </h3>
      );
      i++;
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-semibold mt-6 mb-3">
          {parseInline(line.slice(3))}
        </h2>
      );
      i++;
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-semibold mt-8 mb-4">
          {parseInline(line.slice(2))}
        </h1>
      );
      i++;
    }
    // Lists
    else if (line.match(/^\s*[-*]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside mb-4 space-y-1">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
    }
    // Empty lines
    else if (line.trim() === '') {
      i++;
    }
    // Paragraphs
    else {
      let para = line;
      i++;
      while (i < lines.length && !lines[i].startsWith('#') && !lines[i].match(/^\s*[-*]\s/) && lines[i].trim() !== '') {
        para += ' ' + lines[i];
        i++;
      }
      elements.push(
        <p key={`p-${i}`} className="mb-4 text-gray-800 leading-relaxed">
          {parseInline(para)}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let current = '';
  let i = 0;

  while (i < text.length) {
    // Bold **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      if (current) parts.push(current);
      current = '';
      i += 2;
      let bold = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        bold += text[i];
        i++;
      }
      parts.push(
        <strong key={`b-${parts.length}`}>{bold}</strong>
      );
      i += 2;
    }
    // Italic *text* or _text_
    else if ((text[i] === '*' || text[i] === '_') && text[i - 1] !== '\\') {
      const marker = text[i];
      if (current) parts.push(current);
      current = '';
      i++;
      let italic = '';
      while (i < text.length && text[i] !== marker) {
        italic += text[i];
        i++;
      }
      if (text[i] === marker) {
        parts.push(
          <em key={`i-${parts.length}`}>{italic}</em>
        );
        i++;
      } else {
        current += marker + italic;
      }
    }
    // Links [text](url)
    else if (text[i] === '[') {
      if (current) parts.push(current);
      current = '';
      i++;
      let linkText = '';
      while (i < text.length && text[i] !== ']') {
        linkText += text[i];
        i++;
      }
      if (text[i] === ']' && text[i + 1] === '(') {
        i += 2;
        let url = '';
        while (i < text.length && text[i] !== ')') {
          url += text[i];
          i++;
        }
        parts.push(
          <a key={`a-${parts.length}`} href={url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {linkText}
          </a>
        );
        i++;
      } else {
        current += '[' + linkText + ']';
      }
    } else {
      current += text[i];
      i++;
    }
  }

  if (current) parts.push(current);
  return parts;
}
