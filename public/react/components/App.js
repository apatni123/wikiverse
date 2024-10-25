import React, { useEffect, useState } from 'react';
import { PagesList } from './PagesList';  
import { Page } from './Page';  
import apiURL from '../api';

export const App = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false); // Set to false initially
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    name: '',
    email: '',
    tags: '',
  });

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch(`${apiURL}/wiki`);
        const pagesData = await response.json();
        setPages(pagesData);
      } catch (err) {
        console.log('Oh no an error! ', err);
      }
    }

    fetchPages();
  }, []);

  const fetchPage = async (slug) => {
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      const pageData = await response.json();
      setSelectedPage(pageData);
    } catch (err) {
      console.log('Error fetching page: ', err);
    }
  };

  const handleBackToList = () => {
    setSelectedPage(null);
    setIsAddingArticle(false); // Ensure form is hidden when going back to list
  };

  const handleAddArticle = () => {
    setIsAddingArticle(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const articleData = {
      title: formData.title,
      content: formData.content,
      name: formData.name,
      email: formData.email,
      tags: formData.tags,
    };

    try {
      const response = await fetch(`${apiURL}/wiki`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        // Reset form data
        setFormData({
          title: '',
          content: '',
          name: '',
          email: '',
          tags: '',
        });
        setIsAddingArticle(false); // Hide the form
        fetchPages(); // Fetch updated list of pages
      } else {
        console.log('Error creating article:', response.statusText);
      }
    } catch (err) {
      console.log('Error submitting form:', err);
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
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Author Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Author Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Tags (space-separated):</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit Article</button>
          <button type="button" onClick={() => setIsAddingArticle(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <PagesList pages={pages} onPageClick={fetchPage} />
          <button onClick={handleAddArticle}>Add New Article</button>
        </>
      )}
    </main>
  );
};
