import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef(null); // Ref for input focus

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // Focus on mount
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        if (!query.trim()) return; // Prevent empty searches

        try {
            const response = await axios.get('http://localhost:5000/search', {
                params: { query }
            });
            setResults(response.data.results);
        } catch (err) {
            setError('Error fetching search results');
            setResults([]); // Clear results on error
        }
    };

    const [typedText, setTypedText] = useState('');
    const headerText = "Hello! What do you want to search from Tiktok?";
    const typingSpeed = 50; // Adjust typing speed (milliseconds)

    useEffect(() => {
        let timer;
        if (typedText.length < headerText.length) {
            timer = setTimeout(() => {
                setTypedText(headerText.substring(0, typedText.length + 1));
            }, typingSpeed);
        }
        return () => clearTimeout(timer); 
    }, [typedText]);

    return (
      
        <div>
            <h1 className="typing-header">
                {typedText}
            </h1>
            <form onSubmit={handleSearch} className="search-form">
                <div className="input-wrapper"> {/* Wrapper for shadow/border */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        ref={inputRef} // Attach the ref
                    />
                    <button type="submit" className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="results-container">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div key={index} className="result-item"> {/* Improved class name */}
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                                {result.title}
                            </a>
                        </div>
                    ))
                ) : query.trim() && !error ? (
                    <div className="no-results">No results found.</div>
                ) : null}
            </div>
        </div>
    );
};

export default App;