import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MovieSuggestion from './MovieSuggestion';
import './MovieDetail.css';
import NoImage from '../images/no.png'; // Assurez-vous que le chemin est correct

function MovieDetail() {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const apiKey = 'e79dc636a1494368d1855e984c4fdd2d';
  const apiKey2 ='eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNzlkYzYzNmExNDk0MzY4ZDE4NTVlOTg0YzRmZGQyZCIsInN1YiI6IjY1MTRhNDM4ZWE4NGM3MDBjYTA1ZGY5YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7pTEXn9GQRDWZH9t8qCNn0mQLHhnVY2ge_DU5I1aOs'
  const { id } = useParams();
  const navigate = useNavigate();
  const [actors, setActors] = useState({});

  const location = useLocation();
  const movieId = location.pathname.split("/")[2];
  console.log(movieId)
  const getActors = async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

    try {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + apiKey2,
        },
      });

      setActors(response.data);
    } catch (error) {
      console.error('Error fetching actor data:', error);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR`
        );

        setMovie(response.data);

        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=fr-FR`
        );

        const trailers = trailerResponse.data.results.filter(
          (video) => video.type === 'Trailer'
        );

        if (trailers.length > 0) {
          setTrailerKey(trailers[0].key);
        }

        // Récupérer des films similaires
        const similarMoviesResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=fr-FR`
        );

        setSuggestedMovies(similarMoviesResponse.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovieDetails();
    getActors(); // Appel de la fonction getActors
  }, [id, apiKey, movieId],apiKey2);

  return (
    <div className="movie-detail">
      {movie && (
        <div>
          <h2>{movie.title}</h2>
          <div className="movie-detail-content">
            <div className="movie-detail-poster">
              <img
                src={movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : NoImage} // Utilisation de NoImage ici
                alt={movie.title}
              />
            </div>
            <div className="movie-detail-info">
              <p className="movie-detail-description">{movie.overview}</p>
              <div className="movie-detail-info-secondaire">
                <p>Année : {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}</p>
                <p>Réalisateur : {movie.director ? movie.director : 'N/A'}</p>
                <p>Acteurs : {actors.cast ? actors.cast.map(actor => actor.name).join(', ') : 'N/A'}</p>
              </div>
            </div>
          </div>

          {trailerKey && (
            <div className="movie-trailer">
              <h3>Bande-annonce</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`Bande-annonce de ${movie.title}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <div className="actor-list">
            <div>
              <h3>CAST</h3>
            </div>
            <div className="wrap-actor">
              {actors.cast
                ? actors.cast.map((actor) => (
                    <div className="actor-display" key={actor.id}>
                      <p>{actor.name}</p>
                      {actor.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w780${actor.profile_path}`}
                          alt={actor.name}
                        />
                      )}
                    </div>
                  ))
                : ""}
            </div>
          </div>
          {/* Suggestions de films similaires */}
          {suggestedMovies.length > 0 && (
            <div className="suggested-movies">
              <h3>Films similaires</h3>
              <div className="suggested-movies-list">
                {suggestedMovies.map((suggestedMovie) => (
                  <MovieSuggestion key={suggestedMovie.id} movie={suggestedMovie} />
                ))}
              </div>
            </div>
          )}

          <div className="navigation">
            {/* Bouton de retour vers la page de recherche */}
            <button className="back-button" onClick={() => navigate(-1)}>Précédent</button>
            <button className="home-button" onClick={() => navigate('/')}>Accueil</button>
            <button className="next-button" onClick={() => navigate(+1)}>Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;


