const apiKey = "369ad8d6e8129b73efd80f3cb40610da";
export const getMovieDetails = (movieId: string) =>
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
