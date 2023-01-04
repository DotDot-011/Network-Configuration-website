import React from 'react';

interface PageNavProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PageNav: React.FC<PageNavProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = Array.from(Array(totalPages).keys()).map((x) => x + 1);

  return (
    <ul>
      {pageNumbers.map((pageNumber) => (
        <li key={pageNumber}>
          <button
            onClick={() => onPageChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PageNav;
