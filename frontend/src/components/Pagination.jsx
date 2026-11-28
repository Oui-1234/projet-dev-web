import Button from "./Button";

export default function Pagination({ page, hasNext, onPageChange }) {
    return <div className="pagination">
        <Button content="Précédent" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        <span>Page {page}</span>
        <Button content="Suivant" disabled={!hasNext} onClick={() => onPageChange(page + 1)} />
    </div>
}