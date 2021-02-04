export const getTrendingMovies = () =>
  fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=369ad8d6e8129b73efd80f3cb40610da&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1",
  );
