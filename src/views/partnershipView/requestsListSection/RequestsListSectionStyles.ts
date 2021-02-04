import styled from "styled-components";
import { sizingScale } from "../../../styles/Variables";

export const SectionWrapper = styled.div`
  margin-top: ${`${sizingScale[3]}px`};
  text-align: start;
`;

export const RequestList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const RequestListItem = styled.li`
  padding: 0;
`;
