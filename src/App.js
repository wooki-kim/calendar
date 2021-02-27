import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const CalendarContainer = styled.section`
  max-width: 720px;
  margin: 0 auto;
`;
const CalendarHeaderGrid = styled.dt`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  text-align: center;
  vertical-align: middle;
  align-self: stretch;
  padding: 2rem 0;
  font-size: 24px;
  button {
    padding: 0.5rem;
    text-align: center;
    box-sizing: border-box;
    font-weight: 500;
    outline: 0;
  }
  span {
    align-self: center;
    font-weight: bold;
  }
`;

const CalendarGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 24px;
`;

const CalendarGridHead = styled(CalendarGrid)`
  font-weight: 100;
`;

const CalendarGridItem = styled.li`
  :nth-child(7n + 1) {
    color: #f0aac9 !important;
  }
  :nth-child(7n) {
    color: #aac9f0 !important;
  }
  opacity: ${(props) => (props.stateWeek === undefined ? "1" : "0.2")};

  box-sizing: border-box;
  min-height: 70px;
  color: ${(props) => (props.reserved ? "#d1aaf0" : "#3d3d3d")};

  :hover {
    cursor: pointer;
    position: relative;
    color: ${(props) => (props.reserved ? "#d1aaf0" : "#3d3d3d")};
  }

  :after {
    position: absolute;
    left: calc((100% / 2) - 25px);
    top: 12px;
    max-width: 0px;
    max-height: 20px;
    width: 50px;
    height: 50px;
    content: "";
    box-sizing: border-box;
    background: #aaf0d1;
    opacity: 0;
    z-index: -1;
    display: ${(props) => (props.reserved ? "none" : "block")};
  }

  :hover:after {
    transition: 0.3s all;
    position: absolute;
    left: calc((100% / 2) - 25px);
    top: 12px;
    max-width: 50px;
    max-height: 20px;
    width: 50px;
    height: 50px;
    content: "";
    box-sizing: border-box;
    background: #aaf0d1;
    opacity: 0.5;
    z-index: -1;
    display: ${(props) => (props.reserved ? "none" : "block")};
  }
`;

const CalendarGridHeadItem = styled(CalendarGridItem)`
  min-height: 60px;
`;

const Message = styled.span`
  font-size: 12px;
  display: block;
`;

function App() {
  const [now, setNow] = useState(dayjs());

  const defaultData = {
    year: now.year(),
    month: now.format("MM"),
    today: now.date(),
    days: [],
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  };
  const [rawData, setRawData] = useState(defaultData);
  
  useEffect(() => {
    let startWeek = now.subtract(1, "M").date(1);
    let lastWeek = now.date(now.daysInMonth());
    let defaultData = {
      year: now.year(),
      month: now.format("MM"),
      today: now.date(),
      days: [],
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    };
    let startWeekCount = startWeek.daysInMonth() - now.date(1).$W + 1;

    [...Array(now.date(1).$W)].map((value, index) => {
      defaultData.days.push({
        day: startWeekCount++,
        event: [],
        stateWeek: -1,
      });
    });

    [...Array(now.daysInMonth()).keys()].map((i) => {
      defaultData.days.push({ day: i + 1, event: [] });
    });
    [...Array(6 - lastWeek.$W)].map((value, index) => {
      defaultData.days.push({ day: index + 1, event: [], stateWeek: 1 });
    });

    defaultData.days[11].event.push("예약");

    setRawData(defaultData);
  }, [now]);

  const changeMonth = (param) => {
    if (param === "prev") {
      setNow(now.subtract(1, "M"));
    } else {
      setNow(now.add(1, "M"));
    }
  };
  return (
    <div>
      <header></header>
      <CalendarContainer>
        <dl>
          <CalendarHeaderGrid>
            <button onClick={() => changeMonth("prev")}>지난달</button>
            <span>
              {rawData.year}년 {rawData.month}월
            </span>
            <button onClick={() => changeMonth("next")}>다음달</button>
          </CalendarHeaderGrid>
          <dd>
            <CalendarGridHead>
              {rawData.weekdays.map((day, index) => {
                return (
                  <CalendarGridHeadItem key={index} highlighKey={index}>
                    {day}
                  </CalendarGridHeadItem>
                );
              })}
            </CalendarGridHead>
            <CalendarGrid>
              {rawData.days.map((days, index) => {
                return (
                  <CalendarGridItem
                    key={index}
                    reserved={days.event.length > 0}
                    stateWeek={days.stateWeek}
                  >
                    {days.day} <Message>{days.event[0]}</Message>
                  </CalendarGridItem>
                );
              })}
            </CalendarGrid>
          </dd>
        </dl>
      </CalendarContainer>
    </div>
  );
}

export default App;
