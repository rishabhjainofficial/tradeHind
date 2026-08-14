import React from 'react';

interface SpecsTableProps {
  specifications: Record<string, string>;
}

export default function SpecsTable({ specifications }: SpecsTableProps) {
  const entries = Object.entries(specifications);

  if (!entries || entries.length === 0) {
    return <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No technical specifications available.</p>;
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              style={{
                background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                borderBottom: idx === entries.length - 1 ? 'none' : '1px solid #e2e8f0',
              }}
            >
              <td
                style={{
                  padding: '0.65rem 1rem',
                  fontWeight: 600,
                  color: '#475569',
                  width: '40%',
                  borderRight: '1px solid #e2e8f0',
                }}
              >
                {key}
              </td>
              <td style={{ padding: '0.65rem 1rem', color: '#0f172a', fontWeight: 500 }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
