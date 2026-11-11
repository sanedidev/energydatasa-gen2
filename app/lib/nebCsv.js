// Shared CSV export/import for NEB section data - one CSV per section per
// year, full 23-commodity-column fidelity (not the display-narrowed subset
// a page might render), so an edit-offline-reupload round-trip never loses
// data. Replaces the 3x duplicated, lossy inline export logic that used to
// live in each page component.
import structure from "@/app/data/neb-structure.json";

const COMMODITY_IDS = structure.commodities.map((c) => c.id);
const HEADER = ["row_id", "row_label", "isTotal", "total", ...COMMODITY_IDS];

function csvEscape(value) {
    const s = String(value ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function cell(v) {
    return v === null || v === undefined ? "" : String(v);
}

export function csvFilename({ sectionId, year }) {
    return `SA_NEB_${year}_${sectionId}.csv`;
}

export function exportSectionCsv(section) {
    const lines = [HEADER];
    section.rows.forEach((row) => {
        lines.push([
            row.id,
            row.label,
            row.isTotal ? "true" : "false",
            cell(row.values?.total),
            ...COMMODITY_IDS.map((id) => cell(row.values?.[id])),
        ]);
    });
    return lines.map((cols) => cols.map(csvEscape).join(",")).join("\r\n") + "\r\n";
}

export function downloadSectionCsv(section, year) {
    const csv  = exportSectionCsv(section);
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = csvFilename({ sectionId: section.id, year });
    a.click();
    URL.revokeObjectURL(url);
}

// Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas,
// embedded newlines, and "" as an escaped quote. Good enough for a file
// this tool itself exports or a spreadsheet app saves - not a general CSV
// library.
function parseCsvText(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ",") {
            row.push(field); field = "";
        } else if (c === "\n" || c === "\r") {
            if (c === "\r" && text[i + 1] === "\n") i++;
            row.push(field); field = "";
            if (row.length > 1 || row[0] !== "") rows.push(row);
            row = [];
        } else {
            field += c;
        }
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
}

// Reject-and-report, never silently reshape: the header's commodity-id set
// and the file's row-id set must each exactly match neb-structure.json's
// known set for this section. isTotal is read back from the structure
// template, not the file, so an import can never turn an ordinary row into
// a (read-only, specially-styled) total row or vice versa.
export function parseSectionCsv({ text, sectionId }) {
    const template = structure.sections.find((s) => s.id === sectionId);
    if (!template) return { ok: false, errors: [`Unknown section: ${sectionId}`] };

    const parsedRows = parseCsvText(text.replace(/^﻿/, ""));
    if (parsedRows.length === 0) return { ok: false, errors: ["File is empty."] };

    const [header, ...dataRows] = parsedRows;
    const headerTrimmed = header.map((h) => h.trim());
    if (headerTrimmed.length !== HEADER.length || headerTrimmed.some((h, i) => h !== HEADER[i])) {
        const headerCommodityIds = headerTrimmed.slice(4);
        const unknown = headerCommodityIds.filter((id) => !COMMODITY_IDS.includes(id));
        const missing = COMMODITY_IDS.filter((id) => !headerCommodityIds.includes(id));
        const errors = [];
        if (unknown.length) errors.push(`Unknown column(s): ${unknown.join(", ")}`);
        if (missing.length) errors.push(`Missing column(s): ${missing.join(", ")}`);
        if (!errors.length) errors.push("Header doesn't match the expected format (row_id, row_label, isTotal, total, <23 commodity columns>).");
        return { ok: false, errors };
    }

    const expectedRowIds = template.rows.map((r) => r.id);
    const fileRowIds = dataRows.map((r) => (r[0] ?? "").trim());
    const unknownRows = fileRowIds.filter((id) => !expectedRowIds.includes(id));
    const missingRows = expectedRowIds.filter((id) => !fileRowIds.includes(id));
    if (unknownRows.length || missingRows.length) {
        const errors = [];
        if (unknownRows.length) errors.push(`Unknown row id(s): ${unknownRows.join(", ")}`);
        if (missingRows.length) errors.push(`Missing row id(s): ${missingRows.join(", ")}`);
        return { ok: false, errors };
    }

    const rowById = Object.fromEntries(template.rows.map((r) => [r.id, r]));
    const cellErrors = [];
    const byId = {};

    dataRows.forEach((cols) => {
        const rowId = (cols[0] ?? "").trim();
        const tmpl = rowById[rowId];
        const values = {};

        function readNumber(raw, columnName) {
            const trimmed = (raw ?? "").trim();
            if (trimmed === "") return null;
            const n = Number(trimmed);
            if (!Number.isFinite(n)) {
                cellErrors.push(`Row "${rowId}", column "${columnName}": "${raw}" is not a number.`);
                return null;
            }
            return n;
        }

        values.total = readNumber(cols[3], "total");
        COMMODITY_IDS.forEach((id, i) => { values[id] = readNumber(cols[4 + i], id); });

        byId[rowId] = {
            id: tmpl.id,
            label: tmpl.label,
            subsector: tmpl.subsector,
            ...(tmpl.isTotal ? { isTotal: true } : {}),
            values,
        };
    });

    if (cellErrors.length) return { ok: false, errors: cellErrors.slice(0, 25) };

    // Re-ordered to the template's row order, not necessarily the file's.
    const rows = expectedRowIds.map((id) => byId[id]);
    return { ok: true, rows };
}

// For the import preview: every cell that actually changed, old -> new.
export function diffSectionRows(currentRows, importedRows) {
    const currentById = Object.fromEntries(currentRows.map((r) => [r.id, r]));
    const columns = ["total", ...COMMODITY_IDS];
    const changes = [];
    importedRows.forEach((row) => {
        const current = currentById[row.id];
        columns.forEach((col) => {
            const before = current?.values?.[col] ?? null;
            const after  = row.values?.[col] ?? null;
            if (before !== after) {
                changes.push({ rowId: row.id, rowLabel: row.label, column: col, before, after });
            }
        });
    });
    return changes;
}
