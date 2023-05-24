import { OMOK_EVENT } from "pages/omok";
import { memo, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { socket } from "services/socket";
import { OmokRoom, Takes } from "type/omok.types";

export const GamingRoom = ({ publicRoom }: { publicRoom: OmokRoom }) => {
  const [roomName] = useState(publicRoom.name);
  const [blackPlayer, setBlackPlayer] = useState(publicRoom.blackPlayer);
  const [whitePlayer, setWhitePlayer] = useState(publicRoom.whitePlayer);
  const [takes, setTakes] = useState(publicRoom.takes);

  const [winner, setWinner] = useState("");

  const onGameEnd = () => {
    setWinner("");
  };

  const GameEndScreen = ({ winner }) => {
    const text = `${winner === "black" ? "흑돌" : "백돌"} 승리!`;
    return (
      <div className="endscreen">
        <div className="endscreen__main">
          <h3 className="endscreen__text">{text}</h3>
          <button className="endscreen__button" onClick={onGameEnd}>
            확인
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    socket.on(
      OMOK_EVENT.PLAYER_CHANGE,
      ({ blackPlayer, whitePlayer }: { blackPlayer: string; whitePlayer: string }) => {
        setBlackPlayer(blackPlayer);
        setWhitePlayer(whitePlayer);
        if (blackPlayer !== "" && whitePlayer !== "") {
          setTakes([]);
        }
      }
    );

    socket.on(OMOK_EVENT.PLAYER_SELECTED, (coord: Takes) => {
      setTakes((t) => [...t, coord]);
    });

    socket.on("game_end", (winner) => {
      setWinner(winner);
    });
  }, []);

  return (
    <div className="gaming-room">
      <OmokBoard takes={takes} />
      <GamePanel roomName={roomName} blackPlayer={blackPlayer} whitePlayer={whitePlayer} />
      {winner !== "" ? <GameEndScreen winner={winner} /> : null}
    </div>
  );
};

const OmokBoard = ({ takes }: { takes: Takes[] }) => {
  const [inBoard, setInBoard] = useState(false);
  const [myTurn, setMyTurn] = useState(false);
  const [coord, setCoord] = useState<Takes>();
  //   const [isGameEnd, setGameEnd] = useState(false);

  useEffect(() => {
    socket.on(OMOK_EVENT.PLAYER_SELECT, () => {
      setMyTurn(true);
    });

    socket.on(OMOK_EVENT.PLAYER_CHANGE, () => {
      setMyTurn(false);
    });
  }, []);

  /**
   * 게임 입장
   */
  const handleBoardEnter = () => {
    setInBoard(true);
  };

  /**
   * 게임 떠남
   */
  const handleBoardLeave = () => {
    setInBoard(false);
  };

  /**
   *  돌을 움직이는 동작
   */
  const handleBoardMove = (coord) => {
    // 이미 돌이 존재하면 건너뜀
    if (takes.find((c) => c.x === coord.x && c.y === coord.y) === undefined) {
      setCoord(coord);
    }
  };

  /**
   *  돌의 위치 선택 (오목 돌 놓음)
   */
  const handleBoardSelect = () => {
    setMyTurn(false);
    socket.emit(OMOK_EVENT.PLAYER_SELECTED, coord);
  };

  return (
    <div className="omokboard">
      {myTurn ? (
        <CoordSelectArea
          onBoardEnter={handleBoardEnter}
          onBoardMove={handleBoardMove}
          onBoardLeave={handleBoardLeave}
          onBoardSelect={handleBoardSelect}
        />
      ) : null}
      {takes.map((takes, index) => (
        <MemoriedStone type={[index % 2 === 0 ? "black" : "white"]} x={takes.x} y={takes.y} />
      ))}
      {takes.length > 0 ? (
        <MemoriedStone type={["prev"]} x={takes[takes.length - 1].x} y={takes[takes.length - 1].y} />
      ) : null}
      {myTurn && inBoard ? (
        <MemoriedStone type={[takes.length % 2 == 0 ? "black" : "white", "hint"]} x={coord?.x} y={coord?.y} />
      ) : null}
    </div>
  );
};

const GamePanel = ({ roomName, blackPlayer, whitePlayer }) => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    socket.on(OMOK_EVENT.MESSAGE, (msg) => {
      setMessage((value) => [...value, msg]);
    });

    socket.on(OMOK_EVENT.SEND_MESSAGE, (msg) => {
      setMessage((value) => [...value, msg]);
    });
  }, []);

  const Player = ({ name, onClick }) => {
    return (
      <div className="game-panel__playerinfo">
        {name !== "" ? (
          <p className="game-panel__playername">{name}</p>
        ) : (
          <button className="game-panel__playerselect" onClick={onClick}>
            참가
          </button>
        )}
      </div>
    );
  };

  const MessageLine = (msg) => {
    return (
      <>
        {msg}
        <br />
      </>
    );
  };

  const blackPlayerCallback = () => {
    socket.emit(OMOK_EVENT.PLAYER_CHANGE, "black");
  };

  const whitePlayerCallback = () => {
    socket.emit(OMOK_EVENT.PLAYER_CHANGE, "white");
  };

  return (
    <div className="game-panel">
      <div className="game-panel__main">
        <h3 className="game-panel__title">{roomName}</h3>
        <div className="game-panel__players">
          <div className="game-panel__player">
            <h4 className="game-panel__playercolor game-panel__playercolor--black">Black</h4>
            <Player name={blackPlayer} onClick={blackPlayerCallback} />
          </div>
          <div className="game-panel__player">
            <h4 className="game-panel__playercolor game-panel__playercolor--white">White</h4>
            <Player name={whitePlayer} onClick={whitePlayerCallback} />
          </div>
        </div>
        <div className="game-panel__message">
          <p>{message?.map(MessageLine)}</p>
        </div>
        <input
          type="text"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              var text = event.currentTarget.value;
              socket.emit(OMOK_EVENT.SEND_MESSAGE, text);
              event.currentTarget.value = "";
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div className="game-panel__buttons">
        <button className="game-panel__button" onClick={() => socket.emit("player_change", "spectator")}>
          관전하기
        </button>
        <button
          className="game-panel__button"
          onClick={() => {
            socket.emit(OMOK_EVENT.ROOM_LEAVE);
          }}
        >
          방 나가기
        </button>
      </div>
    </div>
  );
};

const BOARD_OFFSET = 3.62; //%
const BOARD_SPACE = 5.14; //%
//크기: 5%
//칸: 5.14%
//공백: 3.62%
const stone = ({ type, x, y }) => {
  //console.log(`${white} (${x},${y})`);
  let material = "";
  type.forEach((m) => {
    switch (m) {
      case "black":
        material += " omokboard__stone--black";
        break;
      case "white":
        material += " omokboard__stone--white";
        break;
      case "hint":
        material += " omokboard__stone--hint";
        break;
      case "prev":
        material += " omokboard__stone--prev";
        break;
    }
  });

  return (
    <div
      className={`omokboard__stone ${material}`}
      key={`${x}${y}`}
      style={{
        left: `${x * BOARD_SPACE + BOARD_OFFSET}%`,
        top: `${y * BOARD_SPACE + BOARD_OFFSET}%`,
      }}
    ></div>
  );
};

const MemoriedStone = memo(stone);

const CoordSelectArea = ({ onBoardEnter, onBoardMove, onBoardLeave, onBoardSelect }) => {
  function getCoord(event: React.SyntheticEvent<HTMLElement>) {
    let coordX = 0;
    let coordY = 0;

    if (!isMobile) {
      const eventTarget = event as React.MouseEvent<HTMLElement>;
      const percentX = (eventTarget.nativeEvent.offsetX * 100.0) / eventTarget.currentTarget.clientWidth;
      const percentY = (eventTarget.nativeEvent.offsetY * 100.0) / eventTarget.currentTarget.clientHeight;

      coordX = parseInt((percentX - BOARD_OFFSET) / BOARD_SPACE + 0.5 + "");
      coordY = parseInt((percentY - BOARD_OFFSET) / BOARD_SPACE + 0.5 + "");
    } else {
      const eventTarget = event as React.TouchEvent<HTMLElement>;
      const bcr = eventTarget.currentTarget.getBoundingClientRect();
      const x = eventTarget.targetTouches[0].clientX - bcr.x;
      const y = eventTarget.targetTouches[0].clientY - bcr.y;

      const percentX = (x * 100.0) / eventTarget.currentTarget.clientWidth;
      const percentY = (y * 100.0) / eventTarget.currentTarget.clientHeight;

      coordX = parseInt((percentX - BOARD_OFFSET) / BOARD_SPACE + 0.5 + "");
      coordY = parseInt((percentY - BOARD_OFFSET) / BOARD_SPACE - 1.5 + "");
    }

    if (coordX < 0) coordX = 0;
    if (coordY < 0) coordY = 0;

    if (coordX > 18) coordX = 18;
    if (coordY > 18) coordY = 18;

    return {
      x: coordX,
      y: coordY,
    };
  }

  const onMouseEnter = () => {
    if (isMobile) return;
    onBoardEnter();
  };

  const onMouseMove = (event) => {
    if (isMobile) return;
    onBoardMove(getCoord(event));
  };

  const onMouseLeave = () => {
    if (isMobile) return;
    onBoardLeave();
  };

  const onMouseClick = () => {
    if (isMobile) return;
    onBoardSelect();
  };

  const onTouchStart = (event) => {
    if (!isMobile) return;
    onBoardEnter();
    onBoardMove(getCoord(event));
  };

  const onTouchMove = (event) => {
    if (!isMobile) return;
    onBoardMove(getCoord(event));
  };

  const onTouchEnd = () => {
    if (!isMobile) return;
    onBoardLeave();
    onBoardSelect();
  };

  return (
    <div
      className="omokboard__coord"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    ></div>
  );
};
