import React, { useRef, useEffect, useState } from 'react';
import DungeonCreate, { Dungeon, DungeonCreateTest } from '../../snippets/Dungeon.js';
import { createBox } from '@mui/system';


const Test = () => {
  const canvasRef = useRef(null);
  const mouseDownRef = useRef(false);
  const zoomlevel = useState(1);
  const mouseDragStartRef = useRef({ x: 0, y: 0 });

  const [currentDragDistance, setCurrentDragDistance] = useState({
    x: 0,
    y: 0,
  });
  const [lastClicked, setLastClicked] = useState({ x: -1, y: -1 });
  const [mapOffset, setMapOffset] = useState({ x: -100, y: -700 });
  const [currentMousePosition, setCurrentMousePosition] = useState(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [dungeon, setDungeon] = useState(DungeonCreateTest());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ri-disegniamo la mappa quando qualcosa cambia
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      drawMap();
    }
  }, [
    canvasRef,
    zoomlevel,
    mapOffset,
    currentDragDistance,
    windowSize.width,
    windowSize.height
  ]);

  const drawMap = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const bcr = canvas.getBoundingClientRect();
    // const realX = mapOffset.x - bcr.left;
    // const realY = mapOffset.y - bcr.top;

    context.reset();
    // context.translate(
    //   (realX * 20 / 95) * (zoomlevel - 4), // -250
    //   (realY * 20 / 95) * (zoomlevel - 4)  // -200
    // );

    context.clearRect(0, 0, canvas.width, canvas.height);

    let maxCoordinateX = 0;
    dungeon.rooms.forEach((room) => {
      const roomMaxX = room.x + room.width;
      if (roomMaxX > maxCoordinateX) {
        maxCoordinateX = roomMaxX;
      }
    });

    let maxCoordinateY = 0;
    dungeon.rooms.forEach((room) => {
      const roomMaxY = room.y + room.height;
      if (roomMaxY > maxCoordinateY) {
        maxCoordinateY = roomMaxY;
      }
    });

    const xInc = bcr.width / maxCoordinateX;
    const yInc = bcr.height / maxCoordinateY;

    // draw the dungeon rooms
    context.fillStyle = 'green';
    context.lineWidth = 5;

    dungeon.rooms.forEach((room) => {
      context.fillRect(room.x * xInc, room.y * yInc, room.width * xInc, room.height * yInc);
    });

    // draw the corridors
    context.strokeStyle = 'blue';
    context.lineWidth = 5;

    for (let i = 1; i < dungeon.rooms.length; i++) {
      let prevRoom = dungeon.rooms[i - 1];
      let currRoom = dungeon.rooms[i];

      let prevCenter = { x: prevRoom.x + Math.floor(prevRoom.width / 2), y: prevRoom.y + Math.floor(prevRoom.height / 2) };
      let currCenter = { x: currRoom.x + Math.floor(currRoom.width / 2), y: currRoom.y + Math.floor(currRoom.height / 2) };

      if (i % 2 === 0) {
        context.strokeRect(prevCenter.x * xInc, prevCenter.y * yInc, currCenter.x * xInc - prevCenter.x * xInc, 5);
        context.strokeRect(currCenter.x * xInc, prevCenter.y * yInc, 5, currCenter.y * yInc - prevCenter.y * yInc);
      } else {
        context.strokeRect(prevCenter.x * xInc, prevCenter.y * yInc, 5, currCenter.y * yInc - prevCenter.y * yInc);
        context.strokeRect(prevCenter.x * xInc, currCenter.y * yInc, currCenter.x * xInc - prevCenter.x * xInc, 5);
      }
    }

    context.strokeStyle = 'yellow';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    //console.log(bcr);
  }

  return (
    <canvas
      // onMouseDown={(e) => mouseDown(e)}
      // onMouseUp={(e) => mouseUp(e)}
      onMouseMove={(e) => {
        setCurrentMousePosition({ x: e.pageX, y: e.pageY });
        //mouseMoveOrDrag(e);
        return;
      }}
      onMouseOut={(e) => {
        setCurrentMousePosition(null);
        //mouseUp(e);
        return;
      }}
      id="canvas"
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height - 170}
    />
  );
};


export default Test;
