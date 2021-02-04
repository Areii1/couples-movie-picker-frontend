import styled from "styled-components";
import { borderRadius, shadowColor, sizingScale } from "../../styles/Variables";

export const List = styled.ul`
  width: ${`${sizingScale[11]}px`};
  list-style-type: none;
  padding: 0;
  background-color: white;
  display: flex;
  border-radius: ${`${borderRadius}px`};
  margin: ${`${sizingScale[3]}px`} auto 0 auto;
  box-shadow: 10px 5px 5px ${shadowColor};
`;

export const ListItem = styled.li`
  width: ${`${sizingScale[8]}px`};
  height: ${`${sizingScale[8]}px`};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const IconWrapper = styled.div`
  width: ${`${sizingScale[6]}px`};
  height: ${`${sizingScale[6]}px`};
`;
