import React from 'react';

export const Page = (props) => {
  const { page, onBack } = props;  

  return (
    <div>
      <h3>{page.title}</h3>
      {onBack && (
        <>
          <p><strong>Author:</strong> {page.author.name}</p> {/* Accessing the author's name */}
          <p><strong>Content:</strong> {page.content}</p> {/* Content is a string, so it can be rendered directly */}
          <p><strong>Tags:</strong> {page.tags.map(tag => tag.name).join(', ')}</p> {/* Mapping through tags to get their names */}
          <p><strong>Date Created:</strong> {new Date(page.createdAt).toLocaleDateString()}</p> {/* Formatting the createdAt date */}
          <button onClick={onBack}>Back to Wiki List</button>
        </>
      )}
    </div>
  );
};
