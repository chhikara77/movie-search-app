// MovieSearch.js
import React, { useState, useEffect } from 'react';
import './moviesearch.css'; // Import your CSS file for styling

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('a');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_KEY = '4e44d9029b1270a757cddc766a1bcb63&language=en-US'; // Replace with your API key
  const API_URL = `https://api.themoviedb.org/3/search/movie`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}?api_key=${API_KEY}&query=${searchQuery}&page=${currentPage}`
      );

      if (response.ok) {
        const data = await response.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page === 'prev' ? currentPage - 1 : page === 'next' ? currentPage + 1 : page);
  };
  
  const renderPaginationButtons = () => {
    const totalButtons = 10; 
    const halfButtons = Math.floor(totalButtons / 2);
  
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(startPage + totalButtons - 1, totalPages);
  
    if (endPage - startPage + 1 < totalButtons) {
      startPage = Math.max(1, endPage - totalButtons + 1);
    }
  
    const buttons = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  
    if (startPage > 1) {
      buttons.unshift('prev');
    }
  
    if (endPage < totalPages) {
      buttons.push('next');
    }
  
    return buttons;
  };

  return (
    <div className="movie-search-container">
      <div className='header'>
        <div className='logo'>
        <h2>MOVIE SEARCH</h2>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={fetchData}>Search</button>
        </div>
        <div className='for-login'></div>
      </div>


      {loading ? (
       <div className="loader"></div>
      ) : (
        <div className='movie-list-container'>
          <div className="movie-list">
            {movies.map((movie) => (
              <div className="movie-cards">
                <img src={`https://image.tmdb.org/t/p/original${movie?movie.poster_path:""}`} />
                <div className="cards-overlay">
                    <div className="card-title">{movie?movie.original_title:""}</div>
                    <div className="card-runtime">
                        {movie?movie.release_date:""}
                    </div>
                    <div className="card-description">{movie ? movie.overview.slice(0,250)+"..." : ""}</div>
                </div>
            </div>
            ))}
          </div>

          <div className="pagination">
          {renderPaginationButtons().map((button, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(button)}
      className={button === 'prev' || button === 'next' ? '' : currentPage === button ? 'active' : ''}
    >
      {button === 'prev' ? 'Prev' : button === 'next' ? 'Next' : button}
    </button>
  ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
