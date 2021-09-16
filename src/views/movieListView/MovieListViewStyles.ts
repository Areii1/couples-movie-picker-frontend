import styled, { keyframes } from "styled-components";
import { borderRadius, sizingScale } from "../../styles/Variables";

export const MatchesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: ${`${sizingScale[13]}px`};
  margin: 0 0 0 ${`${sizingScale[6] * -1}px`};
`;

export const ImageOverlay = styled.div`
  width: ${`${sizingScale[13] / 2}px`};
  height: ${`${sizingScale[9]}px`};
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  opacity: 0;
`;

const hoverLighten = keyframes`
from {
  opacity: 0;
}
to {
  opacity: 0.3;
}
`;

export const MatchesListItem = styled.li`
  padding: 0;
  margin: 0;
  width: ${`${sizingScale[13] / 2}px`};
  height: ${`${sizingScale[9]}px`};
  position: relative;
  border: 1px solid white;
  overflow: hidden;
  :hover {
    #matches-view-image-overlay {
      animation: ${hoverLighten} 0.3s linear forwards;
    }
  }
`;

export const Image = styled.img`
  object-fit: cover;
  max-width: ${`${sizingScale[13] / 2}px`};
  max-height: ${`${sizingScale[11]}px`};
`;

export const TextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  width: ${`${sizingScale[7]}px`};
  border-bottom-right-radius: ${`${borderRadius}px`};
`;

export const DislikedMoviesListWrapper = styled.div`
  margin-top: ${`${sizingScale[7]}px`};
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ListPadding = styled.div`
  margin-top: ${`${sizingScale[7]}px`};
`;
