import React from "react";
import { Hospital } from "services/nara.types";
import styled from "styled-components";

const HospDiv = styled.div`
  position: fixed;
  top: 5em;
  left: 0em;
`;

type HospitalProps = {
  hospitals: Array<Hospital>;
  findHospital: Function;
};

export const HospitalBox = (props: HospitalProps) => {
  // const [pageNum, setPageNum] = useState(1);
  // const { hasMore, list, isLoading } = useFetch(pageNum);
  // const observerRef = useRef<IntersectionObserver>();

  // const observer = (node) => {
  //   if (isLoading) return;
  //   if (observerRef.current) observerRef.current.disconnect();

  //   observerRef.current = new IntersectionObserver(([entry]) => {
  //     if (entry.isIntersecting && hasMore) {
  //       setPageNum((page) => page + 1);
  //     }
  //   });

  //   node && observerRef.current.observe(node);
  // };

  const hospClickHandler = (hosp, e) => {
    props.findHospital(hosp);
    e.preventDefault();
  };
  return (
    <>
      <HospDiv>
        <ul style={{ height: "15px;" }}>
          {props.hospitals.map((hosp) => {
            return (
              <li>
                <a
                  href=""
                  onClick={(e) => {
                    hospClickHandler(hosp, e);
                  }}
                >
                  {hosp.yadmNm}
                </a>
              </li>
            );
          })}
        </ul>
      </HospDiv>
    </>
  );
};
