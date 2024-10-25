import React from 'react';
import { Page } from './Page'; // Assuming you want to use Page here

export const PagesList = ({ pages, onPageClick }) => {
  console.log(onPageClick);
  
  return (
    <div>
      {pages.map((page) => (
        <p key={page.slug} onClick={() => onPageClick(page.slug)}>
          {page.title} {/* Assuming you want to display the title here */}
        </p>
      ))}
    </div>
  );
};
