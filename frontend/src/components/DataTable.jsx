export default function DataTable({ columns, rows, actions, emptyMessage = "Aucune donnée"}) {
    if (rows === undefined) return <p>Chargement...</p>;
    const nbColumns = columns.length + (actions ? 1 : 0);

    return <table className="data-table">
        <thead>
            <tr>
                {columns.map(column => <th key={column.key}>{column.label}</th>)}
                {actions && <th>Actions</th>}
            </tr>
        </thead>
        <tbody>
            {rows.length === 0 && <tr>
                <td colSpan={nbColumns}>{emptyMessage}</td>
                </tr>}
            {rows.map(row => <tr key={row.id}>
                {columns.map(column => <td key = {column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                </td>)}
                {actions && <td>{actions(row)}</td>}
            </tr>)}
        </tbody>
    </table>
}