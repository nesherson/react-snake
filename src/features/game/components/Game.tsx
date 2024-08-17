import { useEffect, useState } from "react";
import "App.css";

import useInterval from "hooks/useInterval";

type Food = {
  x: number,
  y: number
}

function createMatrix(rows: number, columns: number) {
  return Array.from({ length: rows }, (value1, index1) => {
    return Array.from({ length: columns }, (value2, index2) => {
      return 0;
    });
  });
}

export default function Game() {
  const [snake, setSnake] = useState({ body: [{ x: 5, y: 5 }], direction: "up" });
  const [food, setFood] = useState<Food>({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [matrix, setMatrix] = useState(createMatrix(25, 25));
  const [snakeMoveInterval, setSnakeMoveInterval] = useState<number | null>(125);
  const [isChangingDirection, setIsChangingDirection] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);

    return () => window.removeEventListener("keydown", handleOnKeyDown);
  });

  useInterval(handleSnakeMovement, snakeMoveInterval);

  useEffect(() => {
    clearMatrix();
    updateMatrix();
  }, [snake.body]);

  function handleSnakeMovement() {
    switch (snake.direction) {
      case "up":
        goUp();
        break;
      case "down":
        goDown();
        break;
      case "left":
        goLeft();
        break;
      case "right":
        goRight();
        break;
    }
  }

  function updateSnakeState(direction: string) {
    if (isGameOver) return;

    let prevPosX = snake.body[0].x;
    let prevPosY = snake.body[0].y;
    let newPosX = snake.body[0].x;
    let newPosY = snake.body[0].y;

    if (direction === "up")
      newPosY = newPosY - 1;
    else if (direction === "down")
      newPosY = newPosY + 1;
    else if (direction === "left")
      newPosX = newPosX - 1;
    else if (direction === "right")
      newPosX = newPosX + 1;

    // console.log(`x: ${newPosX}, y: ${newPosY}, direction: ${direction}`);

    if (isColided(newPosX, newPosY)) {
      setSnakeMoveInterval(null);
      setIsGameOver(true);
      return;
    }

    if (newPosX < 0) {
      newPosX = matrix[0].length - 1;
    }
    else if (newPosY >= 0 && newPosX > matrix[0].length - 1) {
      newPosX = 0;
    }
    else if (newPosY < 0) {
      newPosY = matrix[0].length - 1;
    }
    else if (newPosY > matrix.length - 1) {
      newPosY = 0;
    }

    let snakeBody = [...snake.body];

    snakeBody[0].x = newPosX;
    snakeBody[0].y = newPosY;

    for (let i = 1; i < snakeBody.length; i++) {
      newPosX = prevPosX;
      newPosY = prevPosY;
      prevPosX = snakeBody[i].x;
      prevPosY = snakeBody[i].y;
      snakeBody[i].x = newPosX;
      snakeBody[i].y = newPosY;
    }

    setIsChangingDirection(false);
    setSnake((prevSnake => {
      return {
        ...prevSnake,
        body: [...snake.body],
        direction: direction
      };
    }));

    if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
      setFoodToRandomLocation();
      makeSnakeBigger();
    }

  }

  function isColided(x: number, y: number) {
    return snake.body.some(bp => bp.x === x && bp.y === y);
  }

  function clearMatrix() {
    setMatrix((prevMatrix) => {
      let tempMatrix = [...prevMatrix];
      for (let i = 0; i < tempMatrix.length; i++) {
        for (let j = 0; j < tempMatrix[i].length; j++) {
          if (tempMatrix[i][j] === 1) tempMatrix[i][j] = 0;
        }
      }

      return tempMatrix;
    });
  }

  function updateMatrix() {
    setMatrix((prevMatrix) => {
      let tempMatrix = [...prevMatrix];
      snake.body.forEach((bp) => {
        tempMatrix[bp.y][bp.x] = 1;
      });

      tempMatrix[food.y][food.x] = 2;

      return tempMatrix;
    });
  }

  // function updateMatrix() {
  //   setMatrix((prevMatrix) => {
  //     return prevMatrix.map((row, i) => {
  //       return row.map((col, j) => {
  //         if (i === snake.y && j === snake.x) {
  //           return 1;
  //         }

  //         return 0;
  //       });
  //     });
  //   });
  // }

  function printMatrix() {
    let temp = "";
    for (let i = 0; i < matrix.length; i++) {
      temp += "\n";
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 0) {
          temp += "O";
        } else {
          temp += "X";
        }
      }
    }
    // console.log("MATRIX: \n", temp);
    // console.log("MATRIX(arr): \n", matrix);
    // console.log(`\nSNAKE: x: ${snake.body[0].x}, y: ${snake.body[0].y}`);
    // console.log(`\nSNAKE body: `);
    console.log(snake.body);
  }

  function goUp() {
    stop();
    updateSnakeState("up");
    start();
  }

  function goDown() {
    stop();
    updateSnakeState("down");
    start();
  }

  function goLeft() {
    stop();
    updateSnakeState("left");
    start();
  }

  function goRight() {
    stop();
    updateSnakeState("right");
    start();
  }

  // function goUp() {
  //   updateSnakeState(snake.x, --snake.y, "up");
  // }

  // function goDown() {
  //   updateSnakeState(snake.x, ++snake.y, "down");
  // }

  // function goLeft() {
  //   updateSnakeState(--snake.x, snake.y, "left");
  // }

  // function goRight() {
  //   updateSnakeState(++snake.x, snake.y, "right");
  // }

  function handleOnKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp":
        if (!isDirectionValid("up") || isChangingDirection) return;

        setIsChangingDirection(true);
        setSnake((prevSnake) => {
          return { ...prevSnake, direction: "up" };
        });

        break;
      case "ArrowDown":
        if (!isDirectionValid("down") || isChangingDirection) return;

        setIsChangingDirection(true);
        setSnake((prevSnake) => {
          return { ...prevSnake, direction: "down" };
        });

        break;
      case "ArrowLeft":
        if (!isDirectionValid("left") || isChangingDirection) return;

        setIsChangingDirection(true);
        setSnake((prevSnake) => {
          return { ...prevSnake, direction: "left" };
        });

        break;
      case "ArrowRight":
        if (!isDirectionValid("right") || isChangingDirection) return;

        setIsChangingDirection(true);
        setSnake((prevSnake) => {
          return { ...prevSnake, direction: "right" };
        });

        break;
      case "j":
        makeSnakeBigger();
        break;
      case "k":
        makeSnakeSmaller();
        break;
      case "l":
        if (snakeMoveInterval === null)
          start();
        else
          stop();
        break;
      case "h":
        console.log(snake.body);
        break;
      case "r":
        reset();
        break;
    }
  }

  function reset() {
    stop();
    setSnake((prevSnake => {
      return { ...prevSnake, body: [{ x: 5, y: 5 }] };
    }));
    start();
  }

  function makeSnakeBigger() {
    let newBody = [...snake.body];
    let lastBodyPart = newBody[newBody.length - 1];
    let tempX = 0;
    let tempY = 0;

    switch (snake.direction) {
      case "up":
        tempY = lastBodyPart.y + 1 > matrix.length - 1 ? 0 : lastBodyPart.y + 1;
        newBody.push({ x: lastBodyPart.x, y: tempY });
        break;
      case "down":
        tempY = lastBodyPart.y - 1 < 0 ? matrix.length - 1 : lastBodyPart.y - 1;
        newBody.push({ x: lastBodyPart.x, y: tempY });
        break;
      case "left":
        tempX = lastBodyPart.x + 1 > matrix[lastBodyPart.y].length - 1 ? 0 : lastBodyPart.x + 1;
        newBody.push({ x: tempX, y: lastBodyPart.y });
        break;
      case "right":
        tempX = lastBodyPart.x - 1 < 0 ? matrix[lastBodyPart.y].length - 1 : lastBodyPart.x - 1;
        newBody.push({ x: tempX, y: lastBodyPart.y });
        break;
    }

    setSnake((prevSnake) => {
      return { ...prevSnake, body: [...newBody] };
    });
  }

  function makeSnakeSmaller() {
    let newBody = [...snake.body];
    newBody.pop();

    setSnake((prevSnake) => {
      return { ...prevSnake, body: [...newBody] };
    });
  }

  function stop() {
    setSnakeMoveInterval(null);
  }

  function start() {
    setSnakeMoveInterval(125);
  }

  function setFoodToRandomLocation() {
    let newPosX = Math.floor(Math.random() * 5);
    let newPosY = Math.floor(Math.random() * 5);

    let overlap = false;

    do {
      if (snake.body.some(bp => bp.x === newPosX && bp.y === newPosY)) {
        newPosX = Math.floor(Math.random() * matrix[0].length);
        newPosY = Math.floor(Math.random() * matrix.length);
        overlap = true;
        break;
      }
    } while (overlap);

    setFood({ x: newPosX, y: newPosY });
  }

  function isDirectionValid(direction: string) {
    if (
      snake.direction === "up" &&
      (direction === "down" || direction === "up")
    )
      return false;
    else if (
      snake.direction === "down" &&
      (direction === "up" || direction === "down")
    )
      return false;
    else if (
      snake.direction === "left" &&
      (direction === "right" || direction === "left")
    )
      return false;
    else if (
      snake.direction === "right" &&
      (direction === "left" || direction === "right")
    )
      return false;

    return true;
  }

  return (
    <div className="game-container">
      <span>SCORE: {snake.body.length - 1}</span>
      <div className="snake-container">
        {/* <div>
          x: {snake.x}
          y: {snake.y}
          direction: {snake.direction}
        </div> */}
        {isGameOver && <span>GAME OVER!!!!</span>}
        {matrix.map((row, i) => {
          return (
            <div key={i} className="row">
              {row.map((_, j) => {
                let tempClass = "col";

                if (matrix[i][j] === 1) tempClass += " dot";
                else if (matrix[i][j] === 2) tempClass += " food";

                return <div key={j} className={`${tempClass}`}></div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// return (
//   <>
//     {/* <div>
//       x: {snake.x}
//       y: {snake.y}
//       direction: {snake.direction}
//     </div> */}
//     {matrix.map((row, i) => {
//       return (
//         <div key={i} className="row">
//           {row.map((col, j) => {
//             let tempClass = "col";

//             // if (i === snake.y && j === snake.x) {
//             //   tempClass += " dot";
//             // }

//             if (matrix[i][j] === "X") tempClass += " dot";

//             return <div key={j} className={`${tempClass}`}></div>;
//           })}
//         </div>
//       );
//     })}
//   </>
// );