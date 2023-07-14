function Pagination({ pageNumber, totalPages, setPageNumber }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <nav aria-label="...">
        <ul className="pagination">
          {pageNumber > 0 ? (
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
              >
                Previous
              </button>
            </li>
          ) : (
            <li className="page-item disabled">
              <button
                className="page-link"
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
              >
                Previous
              </button>
            </li>
          )}

          {/* Tạo vòng lặp */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li className="page-item" key={index}>
              <button
                className="page-link"
                onClick={() => {
                  setPageNumber(index);
                }}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {pageNumber < totalPages - 1 ? (
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              >
                Next
              </button>
            </li>
          ) : (
            <li className="page-item disabled">
              <button
                className="page-link"
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              >
                Next
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
