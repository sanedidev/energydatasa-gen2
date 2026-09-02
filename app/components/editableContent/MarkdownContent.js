"use client";

function parseInline(text) {
    const parts = [];
    const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        if (m[1] !== undefined)
            parts.push(<strong key={m.index} className="font-semibold text-slate-800">{m[1]}</strong>);
        else
            parts.push(<em key={m.index} className="italic">{m[2]}</em>);
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

export default function MarkdownContent({ text }) {
    if (!text?.trim()) return null;

    const lines = text.split("\n");
    const nodes = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }

        if (line.startsWith("# ")) {
            nodes.push(<h1 key={i} className="mt-4 mb-1 text-xl font-bold text-slate-900">{parseInline(line.slice(2))}</h1>);
            i++; continue;
        }
        if (line.startsWith("## ")) {
            nodes.push(<h2 key={i} className="mt-3 mb-1 text-base font-semibold text-slate-900">{parseInline(line.slice(3))}</h2>);
            i++; continue;
        }
        if (line.startsWith("### ")) {
            nodes.push(<h3 key={i} className="mt-2 mb-0.5 text-sm font-semibold text-slate-800">{parseInline(line.slice(4))}</h3>);
            i++; continue;
        }
        if (/^[-*] /.test(line)) {
            const items = [];
            while (i < lines.length && /^[-*] /.test(lines[i])) {
                items.push(<li key={i}>{parseInline(lines[i].slice(2))}</li>);
                i++;
            }
            nodes.push(<ul key={`ul${i}`} className="list-disc pl-5 space-y-0.5 text-sm text-slate-600">{items}</ul>);
            continue;
        }
        if (/^\d+\. /.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+\. /.test(lines[i])) {
                items.push(<li key={i}>{parseInline(lines[i].replace(/^\d+\. /, ""))}</li>);
                i++;
            }
            nodes.push(<ol key={`ol${i}`} className="list-decimal pl-5 space-y-0.5 text-sm text-slate-600">{items}</ol>);
            continue;
        }
        nodes.push(<p key={i} className="text-sm text-slate-600 leading-relaxed">{parseInline(line)}</p>);
        i++;
    }

    return <div className="space-y-1.5">{nodes}</div>;
}
