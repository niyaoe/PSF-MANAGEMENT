const Pagination = ({
    page,
    totalPages,
    onPageChange
}) => {
    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    return (
        <div>
            <button
                onClick={handlePrevious}
                disabled={page === 1}
            >
                Previous
            </button>

            <span>
                Page {page} of {totalPages}
            </span>

            <button
                onClick={handleNext}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;