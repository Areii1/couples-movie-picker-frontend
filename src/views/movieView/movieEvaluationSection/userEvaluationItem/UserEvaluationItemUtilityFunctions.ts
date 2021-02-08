const getRedColor = (score: number): number => {
  if (score >= 50) {
    const scorePercent = score / 100;
    return 255 - Math.floor(scorePercent * 2);
  } else {
    const scorePercent = (-1 * score) / 100;
    return 120 - Math.floor(scorePercent * 80);
  }
};
const getGreenColor = (score: number): number => {
  if (score >= 50) {
    const scorePercent = score / 100;
    return 186 - Math.floor(scorePercent * 85);
  } else {
    const scorePercent = (-1 * score) / 100;
    return 175 - Math.floor(scorePercent * 46);
  }
};
const getBlueColor = (score: number): number => {
  if (score >= 50) {
    const scorePercent = score / 100;
    return 166 - Math.floor(scorePercent * 112);
  } else {
    const scorePercent = (-1 * score) / 100;
    return 255 - Math.floor(scorePercent * 2);
  }
};

export const getScoreTextColor = (score: number): string => {
  return `rgb(${getRedColor(score)},${getGreenColor(score)},${getBlueColor(score)})`;
};
