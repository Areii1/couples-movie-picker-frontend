import styled from "styled-components";
import { borderRadius, shadowColor, sizingScale } from "../../styles/Variables";

export const Wrapper = styled.div`
  background-color: white;
  border-radius: ${`${borderRadius}px`};
  box-shadow: 10px 5px 5px ${shadowColor};
  margin: ${`${sizingScale[3]}px`} auto 0 auto;
`;

export const List = styled.ul`
  padding: 0;
  list-style-type: none;
  display: flex;
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
