import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="pagination" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '40px',
            marginBottom: '20px'
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-pagination"
                style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: currentPage === 1 ? '#cbd5e1' : 'var(--text-dark)',
                    fontWeight: '600',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                Trước
            </button>

            {getPageNumbers().map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`btn-pagination ${currentPage === number ? 'active' : ''}`}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: currentPage === number ? 'var(--primary)' : '#e2e8f0',
                        background: currentPage === number ? 'var(--primary)' : 'white',
                        color: currentPage === number ? 'white' : 'var(--text-dark)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-pagination"
                style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: currentPage === totalPages ? '#cbd5e1' : 'var(--text-dark)',
                    fontWeight: '600',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;
