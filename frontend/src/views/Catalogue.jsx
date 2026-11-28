import { useEffect, useState } from "react";
import apiFetch from "../api";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";

const ITEMS_PER_PAGE = 3;

export default function Catalogue() {
    const [equipments, setEquipments] = useState();
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    // Recharge la liste à chaque changement de page
    useEffect(() => {
        apiFetch(`/equipments?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}&sort=name`)
            .then(response => response.json())
            .then(data => setEquipments(data));
    }, [page]);

    return <>
        <h2>Catalogue</h2>
        <DataTable
            columns={[
                { key: "name", label: "Nom" },
                { key: "Category", label: "Catégorie", render: (row) => row.Category?.name },
                { key: "status", label: "Statut" }
            ]}
            rows={equipments}
            actions={(row) => <Button content="Tester la modale" onClick={() => setSelected(row)} />}
            emptyMessage="Aucun équipement"
        />
        <Pagination page={page} hasNext={equipments?.length === ITEMS_PER_PAGE} onPageChange={setPage} />
        <ConfirmModal
            message={selected && `Réserver ${selected.name} ?`}
            onConfirm={() => setSelected(null)}
            onCancel={() => setSelected(null)}
        />
    </>
}