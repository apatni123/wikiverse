import React, { useEffect, useState } from 'react';
import { PagesList } from './PagesList';  
import { Page } from './Page';  
import apiURL from '../api';

export const App = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    name: '',
    email: '',
    tags: '',
  });

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`${apiURL}/wiki`);
        setPages(await response.json());
      } catch (err) {
        console.error('Error fetching pages:', err);
      }
    };

    fetchPages();
  }, []);

  const fetchPage = async (slug) => {
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      setSelectedPage(await response.json());
    } catch (err) {
      console.error('Error fetching page:', err);
    }
  };

  const handleBackToList = () => {
    setSelectedPage(null);
    setIsAddingArticle(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiURL}/wiki`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          name: '',
          email: '',
          tags: '',
        });
        setIsAddingArticle(false);
        await fetchPages();
      } else {
        console.error('Error creating article:', response.statusText);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <main>
      <h1>WikiVerse</h1>
      <h2>An interesting 📚</h2>
      {selectedPage ? (
        <Page page={selectedPage} onBack={handleBackToList} />
      ) : isAddingArticle ? (
        <form onSubmit={handleSubmit}>
          <h3>Add a New Article</h3>
          {['title', 'content', 'name', 'email', 'tags'].map((field, idx) => (
            <div key={idx}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              {field === 'content' ? (
                <textarea name={field} value={formData[field]} onChange={handleChange} required />
              ) : (
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== 'tags'}
                />
              )}
            </div>
          ))}
          <button type="submit">Submit Article</button>
          <button type="button" onClick={() => setIsAddingArticle(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <PagesList pages={pages} onPageClick={fetchPage} />
          <button onClick={() => setIsAddingArticle(true)}>Add New Article</button>
        </>
      )}
    </main>
  );
};
