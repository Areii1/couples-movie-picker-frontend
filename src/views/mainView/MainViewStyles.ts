import styled from "styled-components";
import { PrimaryHeadline } from "../../styles/Styles";
import { borderRadius, sizingScale } from "../../styles/Variables";

export const Wrapper = styled.div`
  width: 100%;
`;

export const Title = styled(PrimaryHeadline)`
  color: #808080;
  word-wrap: break-word;
`;

export const TitlePlaceholder = styled.div`
  margin: ${`${sizingScale[6]}px auto 0 auto`};
  height: ${`${sizingScale[5]}px`};
  width: ${`${sizingScale[10]}px`};
  background-color: #e9e9e9;
`;

export const DetailsSection = styled.div`
  margin: ${`${sizingScale[3]}px`} 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${`${sizingScale[13] - sizingScale[6] * 2}px`};
`;

export const ImagePlaceholder = styled.div`
  height: ${`${sizingScale[11]}px`};
  width: ${`${sizingScale[12]}px`};
  margin: auto;
  background-color: #e9e9e9;
  border-radius: ${`${borderRadius}px`};
`;

export const FireMeterWrapper = styled.div`
  margin: ${`${sizingScale[6]}px`} auto 0 auto;
`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TitleWrapper = styled.div`
  margin-top: ${`${sizingScale[5]}px`};
  display: flex;
  justify-content: center;
`;
