import { ProcessedMatchedMovies } from "./MatchesView";

export const getSortedMatchedMovies = (
  matchedMovies: Array<ProcessedMatchedMovies | undefined>,
) => {
  return matchedMovies.sort(
    (a: ProcessedMatchedMovies | undefined, b: ProcessedMatchedMovies | undefined) => {
      if (a && b) {
        if (a.commonScore < b.commonScore) {
          return 1;
        } else if (a.commonScore > b.commonScore) {
          return -1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
  );
};
