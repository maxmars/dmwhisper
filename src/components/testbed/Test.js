import React, { useRef, useEffect, useState } from 'react';
import { Dungeon } from '../../snippets/Dungeon.js';


const Test = () => {

  const bottomBarHeight = 160;
  const iconbarHeight = 50;
  const DungeonCreate = () => {
    const props = {
      width: 40,
      height: 40,
      roomTypes: [{ name: 'kitchen', occurrences: 2 }, { name: 'bedroom', occurrences: 5 }, { name: 'dining room', occurrences: 2 }, { name: 'bathroom', occurrences: 3 }, { name: 'study', occurrences: 4 }],
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
  const [zoomlevel, setZoomlevel] = useState(1);
  const mouseDragStartRef = useRef({ x: 0, y: 0 });

  const [currentDragDistance, setCurrentDragDistance] = useState({
    x: 0,
    y: 0,
  });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [dungeon] = useState(DungeonCreate());
  const [drawnCorridors, setDrawnCorridors] = useState([]);

  const [xInc, setXInc] = useState(0);
  const [yInc, setYInc] = useState(0);
  const [noPaths, setNoPaths] = useState(true);


  const mouseDown = (event) => {
    mouseDownRef.current = true;
    mouseDragStartRef.current = { x: event.pageX, y: event.pageY };
  };

  const mouseUp = (event) => {

    mouseDownRef.current = false;

    // Se l'utente non ha spostato troppo il mouse, sta cliccando per (de)selezionare
    if (Math.abs(currentDragDistance.x) + Math.abs(currentDragDistance.y) < 3) {

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      console.log('mouseUp on ' + x + ', ' + y);
    }

    let mult = Math.abs(4.0 / zoomlevel);

    if (mult < 0.3) {
      mult = 0.3;
    }

    setMapOffset({
      x: mapOffset.x + currentDragDistance.x * mult,
      y: mapOffset.y + currentDragDistance.y * mult,
    });

    setCurrentDragDistance({
      x: 0,
      y: 0,
    });
  };

  const drawPathIcon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, windowSize.height - bottomBarHeight - iconbarHeight);
    };

    const pathIconFile = `${process.env.PUBLIC_URL}/path_${noPaths === true ? 'off' : 'on'}.png`;
    img.src = pathIconFile;

    const imgZoomOut = new Image();
    imgZoomOut.onload = () => {
      ctx.drawImage(imgZoomOut, 60, windowSize.height - bottomBarHeight - iconbarHeight);
    };

    const zoomOutIconFile = `${process.env.PUBLIC_URL}/zoom_out.png`;
    imgZoomOut.src = zoomOutIconFile;

    const imgZoomIn = new Image();
    imgZoomIn.onload = () => {
      ctx.drawImage(imgZoomIn, 120, windowSize.height - bottomBarHeight - iconbarHeight);
    };

    const zoomInIconFile = `${process.env.PUBLIC_URL}/zoom_in.png`;
    imgZoomIn.src = zoomInIconFile;
  }

  useEffect(() => {
    if (noPaths === true) {
      setDrawnCorridors([]);
    } else {
      setDrawnCorridors([...Array(dungeon.rooms.length).keys()]);
    }
  }, [noPaths, dungeon.rooms.length]);

  useEffect(() => {
    drawPathIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const xInc = windowSize.width / maxCoordinateX * zoomlevel;
    const yInc = (windowSize.height - bottomBarHeight - iconbarHeight - 5) / maxCoordinateY * zoomlevel;

    setXInc(xInc);
    setYInc(yInc);
  }, [dungeon, windowSize, dungeon.rooms, zoomlevel, windowSize.width, windowSize.height, bottomBarHeight, iconbarHeight]);


  // Ri-disegniamo la mappa quando qualcosa cambia
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      drawMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, zoomlevel, mapOffset, currentDragDistance, currentDragDistance.x,
    currentDragDistance.y, windowSize.width, windowSize.height,
    drawnCorridors, dungeon.rooms, xInc, yInc]);

  const drawCorridors = (color, all) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const realX = mapOffset.x; //mapOffset.x - bcr.left;
    const realY = mapOffset.y; //mapOffset.y - bcr.top;

    // draw the corridors
    context.lineWidth = 5;

    for (let i = 1; i < dungeon.rooms.length; i++) {
      // Se i è presente nell'array drawnCorridors, allora disegna il corridoio
      if (all === true || drawnCorridors.includes(i)) {
        let prevRoom = dungeon.rooms[i - 1];
        let currRoom = dungeon.rooms[i];

        let prevCenter = { x: prevRoom.x + Math.floor(prevRoom.width / 2), y: prevRoom.y + Math.floor(prevRoom.height / 2) };
        let currCenter = { x: currRoom.x + Math.floor(currRoom.width / 2), y: currRoom.y + Math.floor(currRoom.height / 2) };

        context.strokeStyle = color;
        if (i % 2 === 0) {
          context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, currCenter.x * xInc - prevCenter.x * xInc, 5);
          context.strokeRect(currCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, currCenter.y * yInc - prevCenter.y * yInc);
        } else {
          context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, currCenter.y * yInc - prevCenter.y * yInc);
          context.strokeRect(prevCenter.x * xInc + 5 + realX, currCenter.y * yInc + 5 + realY, currCenter.x * xInc - prevCenter.x * xInc, 5);
        }

        context.strokeStyle = 'yellow';
        context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, 5);
        context.strokeRect(currCenter.x * xInc + 5 + realX, currCenter.y * yInc + 5 + realY, 5, 5);

      }
    }

  }

  const drawMap = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const realX = mapOffset.x;
    const realY = mapOffset.y;

    context.reset();

    //console.log('Drawing map');
    context.clearRect(0, 0, canvas.width, canvas.height - iconbarHeight - 5);
    context.beginPath();
    drawPathIcon();

    // draw the corridors
    drawCorridors('rgb(90, 90, 0)', true);

    // draw the dungeon rooms
    context.fillStyle = 'green';
    context.lineWidth = 5;

    dungeon.rooms.forEach((room) => {
      context.fillRect(room.x * xInc + realX, room.y * yInc + realY, room.width * xInc, room.height * yInc);
    });

    // draw selected corridors
    drawCorridors('red', false);

    // draw borders
    context.strokeStyle = 'yellow';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height - iconbarHeight - 5);
  }

  const getClickedRoomNumber = (x, y) => {

    for (let i = 0; i < dungeon.rooms.length; i++) {
      const room = dungeon.rooms[i];
      if (x >= room.x && x <= room.x + room.width && y >= room.y && y <= room.y + room.height) {
        console.log('Clicked on ' + x + ', ' + y + ' and room is ' + room.x + ', ' + room.y + ', ' + room.width + ', ' + room.height);
        return i;
      }
    }
    return -1;
  }

  const roomClicked = (x, y) => {
    let clickedRoomNumber = getClickedRoomNumber(x, y);

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

  const mouseMoveOrDrag = (event) => {

    if (mouseDownRef.current === true) {
      const fromDragStartX = event.pageX - mouseDragStartRef.current.x;
      const fromDragStartY = event.pageY - mouseDragStartRef.current.y;

      setCurrentDragDistance({
        x: fromDragStartX,
        y: fromDragStartY,
      });
    }
  };

  const mouseClicked = (e) => {

    // If click is inside the path icon, toggle the path visibility
    if (e.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
      e.clientX <= 50) {
      setNoPaths(!noPaths);
      return;
    }

    // If click is inside the zoom out icon, toggle the path visibility
    if (e.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
      e.clientX <= 110 && e.clientX >= 60) {
      if (zoomlevel > 1)
        setZoomlevel(zoomlevel - 1);
      return;
    }

    // If click is inside the zoom in icon, toggle the path visibility
    if (e.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
      e.clientX <= 170 && e.clientX >= 120) {
      if (zoomlevel < 4)
        setZoomlevel(zoomlevel + 1);
      return;
    }

    // get the canvas coordinates of the click
    const canvas = canvasRef.current;
    const bcr = canvas.getBoundingClientRect();
    const x = (e.clientX - mapOffset.x - bcr.left) / xInc;
    const y = (e.clientY - mapOffset.y - bcr.top) / yInc;

    roomClicked(x, y);

  }

  const screenTapped = (e) => {
    try {
      // get the canvas coordinates of the touch
      const touch = e.touches[0];

      // If click is inside the path icon, toggle the path visibility
      if (touch.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
        touch.clientX <= 50) {
        setNoPaths(!noPaths);
        return;
      }

      // If click is inside the zoom out icon, toggle the path visibility
      if (touch.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
        touch.clientX <= 110 && touch.clientX >= 60) {
        if (zoomlevel > 1)
          setZoomlevel(zoomlevel - 1);
        return;
      }

      // If click is inside the zoom in icon, toggle the path visibility
      if (touch.clientY > windowSize.height - bottomBarHeight - iconbarHeight &&
        touch.clientX <= 170 && touch.clientX >= 120) {
        if (zoomlevel < 4)
          setZoomlevel(zoomlevel + 1);
        return;
      }

      const canvas = canvasRef.current;
      const bcr = canvas.getBoundingClientRect();

      const x = (e.clientX - mapOffset.x - bcr.left) / xInc;
      const y = (e.clientY - mapOffset.y - bcr.top) / yInc;

      roomClicked(x, y);
    } catch (e) {
      // No need to do anything
    }
  }


  return (
    <canvas
      onMouseDown={(e) => mouseDown(e)}
      onMouseUp={(e) => mouseUp(e)}
      onMouseMove={(e) => {
        mouseMoveOrDrag(e);
        return;
      }}
      onClick={(e) => {
        mouseClicked(e);
        return;
      }}
      onTouchEnd={(e) => {
        screenTapped(e);
        return;
      }}
      onTouchMove={(e) => {
        mouseMoveOrDrag(e);
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
