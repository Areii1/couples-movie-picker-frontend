import styled from "styled-components";
import { sizingScale, borderRadius } from "../../../styles/Variables";

export const MovieListTriggerButton = styled.button`
  width: 100%;
  background-color: white;
  text-align: start;
  padding: ${`${sizingScale[2]}px`} ${`${sizingScale[3]}px`};
  border-radius: ${`${borderRadius}px`};
  border: 1px solid gray;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

export const MovieList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: ${`${sizingScale[4]}px`} 0 ${`${sizingScale[7]}px`} 0;
  width: 100%;
`;

export const MovieListItem = styled.li`
  padding: ${`${sizingScale[1]}px`} ${`${sizingScale[2]}px`};
  background-color: lightgray;
  border-radius: ${`${borderRadius}px`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid gray;
  margin: ${`${sizingScale[4]}px`} 0;
`;

export const Text = styled.p`
  margin: 0;
  color: gray;
`;

export const LikedMoviesWrapper = styled.div`
  margin-top: ${`${sizingScale[5]}px`};
  text-align: start;
`;

export const MovieListWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
`;
