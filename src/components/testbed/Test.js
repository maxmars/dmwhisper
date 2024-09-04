import React, { useRef, useEffect, useState } from 'react';
import { Dungeon } from '../../snippets/Dungeon.js';
import { use } from 'i18next';


const Test = () => {

  const bottomBarHeight = 160;
  const iconbarHeight = 50;
  const DungeonCreate = () => {
    const props = {
      width: 20,
      height: 20,
      roomTypes: [{ name: 'kitchen', occurrences: 1 }, { name: 'bedroom', occurrences: 3 }, { name: 'dining room', occurrences: 1 }, { name: 'bathroom', occurrences: 2 }, { name: 'study', occurrences: 2 }],
      roomMinSize: 3,
      roomMaxSize: 4
    };

    const dungeon = new Dungeon(props.width, props.height, props.roomTypes);
    dungeon.generateRooms(props.roomMinSize, props.roomMaxSize);
    //dungeon.generateCorridors();
    return dungeon;
  }

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

  const [dungeon, setDungeon] = useState(DungeonCreate());
  const [drawnCorridors, setDrawnCorridors] = useState([]);

  const [maxCoordinateX, setMaxCoordinateX] = useState(0);
  const [maxCoordinateY, setMaxCoordinateY] = useState(0);
  const [xInc, setXInc] = useState(0);
  const [yInc, setYInc] = useState(0);
  const [noPaths, setNoPaths] = useState(true);


  const drawPathIcon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, windowSize.height - bottomBarHeight - iconbarHeight);
    };

    const pathIconFile = `${process.env.PUBLIC_URL}/path_${noPaths === true ? 'off' : 'on'}.png`;
    //console.log(pathIconFile);
    img.src = pathIconFile;
  }

  useEffect(() => {
    if (noPaths === true) {
      setDrawnCorridors([]);
    } else {
      setDrawnCorridors([...Array(dungeon.rooms.length).keys()]);
    }
  }, [noPaths]);

  useEffect(() => {
    drawPathIcon();
  }, [noPaths, windowSize.height, bottomBarHeight, iconbarHeight]);

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

  useEffect(() => {
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

    const xInc = windowSize.width / maxCoordinateX;
    const yInc = (windowSize.height - bottomBarHeight - iconbarHeight - 5) / maxCoordinateY;

    setMaxCoordinateX(maxCoordinateX);
    setMaxCoordinateY(maxCoordinateY);
    setXInc(xInc);
    setYInc(yInc);
  }, [dungeon, windowSize, dungeon.rooms]);


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

  const drawAllCorridors = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // draw the corridors
    context.strokeStyle = color;
    context.lineWidth = 5;

    for (let i = 1; i < dungeon.rooms.length; i++) {
      // Se i è presente nell'array drawnCorridors, allora disegna il corridoio
      if (drawnCorridors.includes(i)) {
        let prevRoom = dungeon.rooms[i - 1];
        let currRoom = dungeon.rooms[i];

        let prevCenter = { x: prevRoom.x + Math.floor(prevRoom.width / 2), y: prevRoom.y + Math.floor(prevRoom.height / 2) };
        let currCenter = { x: currRoom.x + Math.floor(currRoom.width / 2), y: currRoom.y + Math.floor(currRoom.height / 2) };

        if (i % 2 === 0) {
          context.strokeRect(prevCenter.x * xInc + 5, prevCenter.y * yInc + 5, currCenter.x * xInc - prevCenter.x * xInc, 5);
          context.strokeRect(currCenter.x * xInc + 5, prevCenter.y * yInc + 5, 5, currCenter.y * yInc - prevCenter.y * yInc);
        } else {
          context.strokeRect(prevCenter.x * xInc + 5, prevCenter.y * yInc + 5, 5, currCenter.y * yInc - prevCenter.y * yInc);
          context.strokeRect(prevCenter.x * xInc + 5, currCenter.y * yInc + 5, currCenter.x * xInc - prevCenter.x * xInc, 5);
        }
      }
    }

  }

  const drawMap = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // const bcr = canvas.getBoundingClientRect();
    // const realX = mapOffset.x - bcr.left;
    // const realY = mapOffset.y - bcr.top;

    context.reset();
    // context.translate(
    //   (realX * 20 / 95) * (zoomlevel - 4), // -250
    //   (realY * 20 / 95) * (zoomlevel - 4)  // -200
    // );

    //console.log('Drawing map');
    context.clearRect(0, 0, canvas.width, canvas.height - iconbarHeight - 5);
    context.beginPath();
    drawPathIcon();

    // draw the dungeon rooms
    context.fillStyle = 'green';
    context.lineWidth = 5;

    dungeon.rooms.forEach((room) => {
      context.fillRect(room.x * xInc, room.y * yInc, room.width * xInc, room.height * yInc);
    });

    drawAllCorridors('red');

    // draw borders
    context.strokeStyle = 'yellow';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height - iconbarHeight - 5);

    //console.log(bcr);
  }

  const getClickedRoomNumber = (x, y) => {
    for (let i = 0; i < dungeon.rooms.length; i++) {
      const room = dungeon.rooms[i];
      if (x >= room.x && x <= room.x + room.width && y >= room.y && y <= room.y + room.height) {
        return i;
      }
    }
    return -1;
  }

  const roomClicked = (x, y) => {
    let clickedRoomNumber = getClickedRoomNumber(x, y);
    //console.log(clickedRoomNumber);

    if (clickedRoomNumber === 0) {
      clickedRoomNumber = 1;
    }

    if (drawnCorridors.includes(clickedRoomNumber)) {

      let tempDrawnCorridors = [...drawnCorridors];

      tempDrawnCorridors = tempDrawnCorridors.filter((roomNumber) => roomNumber !== clickedRoomNumber);

      if (clickedRoomNumber < dungeon.rooms.length - 1 && drawnCorridors.includes(clickedRoomNumber + 1)) {
        tempDrawnCorridors = tempDrawnCorridors.filter((roomNumber) => roomNumber !== clickedRoomNumber + 1);
      }

      setDrawnCorridors(tempDrawnCorridors);

    } else {
      let tempDrawnCorridors = [...drawnCorridors, clickedRoomNumber];

      if (clickedRoomNumber < dungeon.rooms.length - 1 && !drawnCorridors.includes(clickedRoomNumber + 1)) {
        tempDrawnCorridors = [...tempDrawnCorridors, clickedRoomNumber + 1];
      }

      setDrawnCorridors(tempDrawnCorridors);
    }

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
      onClick={(e) => {
        // If click is inside the path icon, toggle the path visibility
        if (currentMousePosition &&
          currentMousePosition.y > windowSize.height - bottomBarHeight - iconbarHeight &&
          currentMousePosition.x <= 50) {
          setNoPaths(!noPaths);
          return;
        }
        // get the canvas coordinates of the click
        const canvas = canvasRef.current;
        const bcr = canvas.getBoundingClientRect();
        const x = (e.clientX - bcr.left) / xInc;
        const y = (e.clientY - bcr.top) / yInc;

        roomClicked(x, y);

        return;
      }}
      onTouchEnd={(e) => {
        // If click is inside the path icon, toggle the path visibility
        if (currentMousePosition &&
          currentMousePosition.y > windowSize.height - bottomBarHeight - iconbarHeight &&
          currentMousePosition.x <= 50) {
          setNoPaths(!noPaths);
          return;
        }
        // get the canvas coordinates of the touch
        try {
          const canvas = canvasRef.current;
          const bcr = canvas.getBoundingClientRect();
          const touch = e.touches[0];
          const x = (touch.clientX - bcr.left) / xInc;
          const y = (touch.clientY - bcr.top) / yInc;

          roomClicked(x, y);
        } catch (e) {
          // No need to do anything
        }

        return;
      }}
      id="canvas"
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height - bottomBarHeight}
    />
  );
};


export default Test;
