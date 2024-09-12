import React, { useRef, useEffect, useState } from 'react';


/*
    const props = {
      width: 40,
      height: 40,
      roomTypes: [{ name: 'kitchen', occurrences: 2 }, { name: 'bedroom', occurrences: 5 }, { name: 'dining room', occurrences: 2 }, { name: 'bathroom', occurrences: 3 }, { name: 'study', occurrences: 4 }],
      roomMinSize: 3,
      roomMaxSize: 4
    };
*/

const DungeonCanvas = (props) => {

  const bottomBarHeight = 160;
  const iconbarHeight = 50;

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

  const [drawnCorridors, setDrawnCorridors] = useState([]);
  const [xInc, setXInc] = useState(0);
  const [yInc, setYInc] = useState(0);
  const [noPaths, setNoPaths] = useState(true);

  const mouseDown = (event) => {
    mouseDownRef.current = true;
    mouseDragStartRef.current = { x: event.pageX, y: event.pageY };
  };

  const mouseUp = (event) => {

    if (mouseDownRef.current === false) {
      return;
    }

    mouseDownRef.current = false;

    setMapOffset({
      x: mapOffset.x + currentDragDistance.x,
      y: mapOffset.y + currentDragDistance.y,
    });

    setCurrentDragDistance({
      x: 0,
      y: 0,
    });
  };

  const drawPathIcon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, canvas.height - iconbarHeight - 5, canvas.width, iconbarHeight + 5);

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

    const imgInfo = new Image();
    imgInfo.onload = () => {
      ctx.drawImage(imgInfo, 180, windowSize.height - bottomBarHeight - iconbarHeight);
    };

    const InfoIconFile = `${process.env.PUBLIC_URL}/info.png`;
    imgInfo.src = InfoIconFile;
  }

  useEffect(() => {
    if (noPaths === true) {
      setDrawnCorridors([]);
    } else {
      setDrawnCorridors([...Array(props.dungeon.rooms.length).keys()]);
    }
  }, [noPaths, props.dungeon.rooms.length]);

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
    props.dungeon.rooms.forEach((room) => {
      const roomMaxX = room.x + room.width;
      if (roomMaxX > maxCoordinateX) {
        maxCoordinateX = roomMaxX;
      }
    });

    let maxCoordinateY = 0;
    props.dungeon.rooms.forEach((room) => {
      const roomMaxY = room.y + room.height;
      if (roomMaxY > maxCoordinateY) {
        maxCoordinateY = roomMaxY;
      }
    });

    const xInc = windowSize.width / maxCoordinateX * zoomlevel;
    const yInc = (windowSize.height - bottomBarHeight - iconbarHeight - 5) / maxCoordinateY * zoomlevel;

    setXInc(xInc);
    setYInc(yInc);
  }, [props.dungeon, windowSize, props.dungeon.rooms, zoomlevel, windowSize.width, windowSize.height, bottomBarHeight, iconbarHeight]);


  // Ri-disegniamo la mappa quando qualcosa cambia
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      drawMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, zoomlevel, mapOffset, currentDragDistance, currentDragDistance.x,
    currentDragDistance.y, windowSize.width, windowSize.height,
    drawnCorridors, props.dungeon.rooms, xInc, yInc, props.selectedRoom]);


  const drawCorridors = (color, all) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const realX = mapOffset.x + currentDragDistance.x; //mapOffset.x - bcr.left;
    const realY = mapOffset.y + currentDragDistance.y; //mapOffset.y - bcr.top;

    // draw the corridors
    context.lineWidth = 5;

    for (let i = 1; i < props.dungeon.rooms.length; i++) {
      // Se i è presente nell'array drawnCorridors, allora disegna il corridoio
      if (all === true || drawnCorridors.includes(i)) {
        let prevRoom = props.dungeon.rooms[i - 1];
        let currRoom = props.dungeon.rooms[i];

        let prevCenter = { x: prevRoom.x + Math.floor(prevRoom.width / 2), y: prevRoom.y + Math.floor(prevRoom.height / 2) };
        let currCenter = { x: currRoom.x + Math.floor(currRoom.width / 2), y: currRoom.y + Math.floor(currRoom.height / 2) };

        context.strokeStyle = color;
        // if (i % 2 === 0) {
        context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, currCenter.x * xInc - prevCenter.x * xInc, 5);
        context.strokeRect(currCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, currCenter.y * yInc - prevCenter.y * yInc);
        // } else {
        //   context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, currCenter.y * yInc - prevCenter.y * yInc);
        //   context.strokeRect(prevCenter.x * xInc + 5 + realX, currCenter.y * yInc + 5 + realY, currCenter.x * xInc - prevCenter.x * xInc, 5);
        // }

        context.strokeStyle = 'yellow';
        context.strokeRect(prevCenter.x * xInc + 5 + realX, prevCenter.y * yInc + 5 + realY, 5, 5);
        context.strokeRect(currCenter.x * xInc + 5 + realX, currCenter.y * yInc + 5 + realY, 5, 5);

      }
    }

  }

  const drawMap = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const realX = mapOffset.x + currentDragDistance.x;
    const realY = mapOffset.y + currentDragDistance.y;

    context.reset();

    //console.log('Drawing map');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    // draw the corridors
    drawCorridors('rgb(90, 90, 0)', true);

    // draw the dungeon rooms
    context.lineWidth = 5;

    props.dungeon.rooms.forEach((room, index, array) => {

      if (index === 0) {
        context.fillStyle = 'rgb(119, 253, 128)';
      } else if (index === array.length - 1) {
        context.fillStyle = 'rgb(233, 146, 99)';
      } else {
        context.fillStyle = 'rgb(39, 147, 46)';
      }

      context.fillRect(room.x * xInc + realX, room.y * yInc + realY, room.width * xInc, room.height * yInc);

      if (index === props.selectedRoom) {
        context.strokeStyle = 'yellow';
        context.strokeRect(room.x * xInc + realX, room.y * yInc + realY, room.width * xInc, room.height * yInc);
      }
    });

    // draw selected corridors
    drawCorridors('red', false);

    // draw borders
    context.strokeStyle = 'yellow';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height - iconbarHeight - 5);

    drawPathIcon();
  }

  const getClickedRoomNumber = (x, y) => {

    for (let i = 0; i < props.dungeon.rooms.length; i++) {
      const room = props.dungeon.rooms[i];
      if (x >= room.x && x <= room.x + room.width && y >= room.y && y <= room.y + room.height) {
        return i;
      }
    }
    return -1;
  }

  const roomClicked = (x, y) => {
    let clickedRoomNumber = getClickedRoomNumber(x, y);

    props.onRoomSelect(clickedRoomNumber);

    if (clickedRoomNumber === 0) {
      clickedRoomNumber = 1;
    }

    if (drawnCorridors.includes(clickedRoomNumber)) {

      let tempDrawnCorridors = [...drawnCorridors];

      tempDrawnCorridors = tempDrawnCorridors.filter((roomNumber) => roomNumber !== clickedRoomNumber);

      if (clickedRoomNumber < props.dungeon.rooms.length - 1 && drawnCorridors.includes(clickedRoomNumber + 1)) {
        tempDrawnCorridors = tempDrawnCorridors.filter((roomNumber) => roomNumber !== clickedRoomNumber + 1);
      }

      setDrawnCorridors(tempDrawnCorridors);

    } else {
      let tempDrawnCorridors = [...drawnCorridors, clickedRoomNumber];

      if (clickedRoomNumber < props.dungeon.rooms.length - 1 && !drawnCorridors.includes(clickedRoomNumber + 1)) {
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

    const canvas = canvasRef.current;
    const bcr = canvas.getBoundingClientRect();

    // If click is inside the path icon, toggle the path visibility
    if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
      e.clientX <= 50) {
      setNoPaths(!noPaths);
      return;
    }

    // If click is inside the zoom out icon, toggle the path visibility
    if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
      e.clientX <= 110 && e.clientX >= 60) {
      if (zoomlevel > 1)
        setZoomlevel(zoomlevel - 1);
      return;
    }

    // If click is inside the zoom in icon, toggle the path visibility
    if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
      e.clientX <= 170 && e.clientX >= 120) {
      if (zoomlevel < 4)
        setZoomlevel(zoomlevel + 1);
      return;
    }

    // If click is inside the info icon, toggle the info visibility
    if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
      e.clientX <= 230 && e.clientX >= 180) {
      props.onInfoClick();
      return;
    }

    // get the canvas coordinates of the click
    const x = (e.clientX - mapOffset.x - bcr.left) / xInc;
    const y = (e.clientY - mapOffset.y - bcr.top) / yInc;

    roomClicked(x, y);

  }

  const screenTapped = (e) => {
    try {
      // get the canvas coordinates of the touch
      const touch = e.touches[0];

      const canvas = canvasRef.current;
      const bcr = canvas.getBoundingClientRect();

      // If click is inside the path icon, toggle the path visibility
      if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
        touch.clientX <= 50) {
        setNoPaths(!noPaths);
        return;
      }

      // If click is inside the zoom out icon, toggle the path visibility
      if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
        touch.clientX <= 110 && touch.clientX >= 60) {
        if (zoomlevel > 1)
          setZoomlevel(zoomlevel - 1);
        return;
      }

      // If click is inside the zoom in icon, toggle the path visibility
      if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
        touch.clientX <= 170 && touch.clientX >= 120) {
        if (zoomlevel < 4)
          setZoomlevel(zoomlevel + 1);
        return;
      }

      // If click is inside the info icon, toggle the info visibility
      if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
        touch.clientX <= 230 && touch.clientX >= 180) {
        props.onInfoClick();
        return;
      }

      const x = (e.clientX - mapOffset.x - bcr.left) / xInc;
      const y = (e.clientY - mapOffset.y - bcr.top) / yInc;

      roomClicked(x, y);
    } catch (e) {
      // No need to do anything
    }
  }


  return (
    <canvas style={{ touchAction: 'none' }}
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
      onTouchStart={(e) => {
        try {
          const touch = e.touches[0];
          mouseDown(touch);
        } catch (e) {
          // No need to do anything
        }
        return;
      }}
      onTouchEnd={(e) => {
        const touch = e.touches[0];
        mouseUp(touch);
        screenTapped(e);
        return;
      }}
      onTouchMove={(e) => {

        try {
          // get the canvas coordinates of the touch
          const touch = e.touches[0];

          const fromDragStartX = touch.pageX - mouseDragStartRef.current.x;
          const fromDragStartY = touch.pageY - mouseDragStartRef.current.y;

          setCurrentDragDistance({
            x: fromDragStartX,
            y: fromDragStartY,
          });
        } catch (e) {
          // No need to do anything
        }
        return false;
      }}
      id="canvas"
      ref={canvasRef}
      width={windowSize.width}
      height={windowSize.height - bottomBarHeight}
    />
  );
};


export default DungeonCanvas;
