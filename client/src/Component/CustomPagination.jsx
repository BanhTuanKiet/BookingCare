// src/components/shared/CustomPagination.jsx
import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  const renderItems = () => {
    const items = [];

    // Nút Previous
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
      />
    );

    // Trường hợp tổng số trang <= 5
    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            disabled={loading}
          >
            {page}
          </Pagination.Item>
        );
      }
    } else {
      items.push(
        <Pagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => onPageChange(1)}
          disabled={loading}
        >
          1
        </Pagination.Item>
      );

      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }

      for (
        let page = Math.max(2, currentPage - 1);
        page <= Math.min(totalPages - 1, currentPage + 1);
        page++
      ) {
        items.push(
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            disabled={loading}
          >
            {page}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          disabled={loading}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Nút Next
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
      />
    );

    return items;
  };

  return <Pagination>{renderItems()}</Pagination>;
};

export default CustomPagination;
