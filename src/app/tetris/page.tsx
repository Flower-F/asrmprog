"use client";
import { useEffect, useRef } from "react";

function createMatrix(w: number, h: number) {
  const matrix: number[][] = [];
  while (h--) {
    matrix.push(new Array<number>(w).fill(0));
  }
  return matrix;
}

function createPiece(type: "T" | "L" | "I" | "L" | "J" | "O" | "Z" | "S") {
  switch (type) {
    case "I":
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ];
    case "L":
      return [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2],
      ];
    case "J":
      return [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
      ];
    case "O":
      return [
        [4, 4],
        [4, 4],
      ];
    case "Z":
      return [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
      ];
    case "S":
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    case "T":
      return [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
      ];
  }
}

function rotate(matrix: number[][], direction: number) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (direction > 0) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = matrix[i].reverse();
    }
  } else {
    matrix.reverse();
  }
}

const colors = [
  "#ff0d72",
  "#0dc2ff",
  "#0dff72",
  "#f538ff",
  "#ff8e0d",
  "#ffe138",
  "#3877ff",
];

const arena = createMatrix(12, 20);

type Player = {
  pos: {
    x: number;
    y: number;
  };
  matrix: number[][];
  score: number;
};

const player: Player = {
  pos: { x: 0, y: 0 },
  matrix: [],
  score: 0,
};

export default function TetrisPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasContextRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  function arenaSleep() {
    let rowCount = 1;
    function outer() {
      for (let y = arena.length; y > 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
          if (arena[y][x] === 0) {
            continue;
          }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
      }
    }
  }

  function collide(arena: number[][], player: Player) {
    const { matrix, pos } = player;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (
          matrix[y][x] !== 0 &&
          arena[y + pos.y] &&
          arena[y + pos.y][x + pos.x] !== 0
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function drawMatrix(matrix: number[][], offset: { x: number; y: number }) {
    if (!canvasContextRef.current) {
      return;
    }

    // matrix.forEach((row, y) => {
    //   row.forEach((value, x) => {
    //     if (value !== 0) {
    // canvasContextRef.current.fillStyle = colors[value];
    // context.fillRect(x + offset.x, y + offset.y, 1, 1);
    //     }
    //   });
    // });
    for (let y = 0; y < matrix.length; y++) {
      const row = matrix[y];
      for (let x = 0; x < row.length; x++) {
        const value = row[x];
        if (value > 0) {
          canvasContextRef.current.fillStyle = colors[value - 1];
          canvasContextRef.current.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      }
    }
  }

  function draw() {
    if (!canvasContextRef.current || !canvasRef.current) {
      return;
    }

    canvasContextRef.current.fillStyle = "#000";
    canvasContextRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
  }

  return (
    <div className="bg-[#202028] text-[#fff] h-[100vh] flex items-center justify-center flex-col">
      <div className="score"></div>
      <canvas
        id="tetris"
        className="border-2 border-solid h-[90vh]"
        width={240}
        height={400}
        ref={canvasRef}
      />
    </div>
  );
}
