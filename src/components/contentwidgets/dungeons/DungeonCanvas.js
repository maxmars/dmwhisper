import React, { useRef, useEffect, useState } from 'react';
import zoomOutIconFile from './images/zoom_out.png';
import zoomInIconFile from './images/zoom_in.png';
import infoIconFile from './images/info.png';


const DungeonCanvas = (props) => {

  // Still undecided. I like having icons!
  const isTouchDevice = false; // 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const bottomBarHeight = 200;
  const iconbarHeight = 50;

  const canvasRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [zoomlevel, setZoomlevel] = useState(0.75);
  const mouseDragStartRef = useRef({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);

  const [currentDragDistance, setCurrentDragDistance] = useState({
    x: 0,
    y: 0,
  });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 100,
  });

  const [corridorLayout, setCorridorLayout] = useState([]);
  const [drawnCorridors, setDrawnCorridors] = useState([]);
  const [xInc, setXInc] = useState(0);
  const [yInc, setYInc] = useState(0);

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

  const drawIcons = () => {
    if (!isTouchDevice) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, canvas.height - iconbarHeight - 5, canvas.width, iconbarHeight + 5);

      const imgZoomOut = new Image();
      imgZoomOut.onload = () => {
        ctx.drawImage(imgZoomOut, 0, windowSize.height - bottomBarHeight - iconbarHeight);
      };

      imgZoomOut.src = zoomOutIconFile;

      const imgZoomIn = new Image();
      imgZoomIn.onload = () => {
        ctx.drawImage(imgZoomIn, 60, windowSize.height - bottomBarHeight - iconbarHeight);
      };

      imgZoomIn.src = zoomInIconFile;

      const imgInfo = new Image();
      imgInfo.onload = () => {
        ctx.drawImage(imgInfo, 120, windowSize.height - bottomBarHeight - iconbarHeight);
      };

      imgInfo.src = infoIconFile;
    }
  }

  useEffect(() => {
    setDrawnCorridors([...Array(props.dungeonRooms.length).keys()]);
  }, [props.dungeonRooms.length]);

  useEffect(() => {
    if (props.corridorLayout) {
      setCorridorLayout(props.corridorLayout);
      return;
    }
    
    const newCorridorLayout = [];
    for (let i = 0; i < props.dungeonRooms.length - 1; i++) {
      if (Math.random() < 0.5 && i + 1 < props.dungeonRooms.length) {
        newCorridorLayout.push([i, i + 1]); // Collegamento alla stanza successiva
      } else if (i + 2 < props.dungeonRooms.length) {
        newCorridorLayout.push([i, i + 1]); // Collegamento alla stanza successiva
        newCorridorLayout.push([i, i + 2]); // Collegamento alla seconda stanza successiva
        i++; // Salta la stanza successiva
      }
    }
  
    // Assicurati che l'ultima stanza sia connessa
    const lastRoomIndex = props.dungeonRooms.length - 1;
    const semiLastRoomIndex = props.dungeonRooms.length - 2;
  
    const isLastRoomConnected = newCorridorLayout.some(
      ([fromIndex, toIndex]) => fromIndex === lastRoomIndex || toIndex === lastRoomIndex
    );
  
    if (!isLastRoomConnected && lastRoomIndex > 0) {
      newCorridorLayout.push([semiLastRoomIndex, lastRoomIndex]); // Collega la penultima stanza all'ultima
    }
  
    setCorridorLayout(newCorridorLayout);
  }, [props.corridorLayout, props.dungeonRooms]);

  useEffect(() => {
    drawMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize.height, windowSize.width, bottomBarHeight, iconbarHeight]);

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
    props.dungeonRooms.forEach((room) => {
      const roomMaxX = room.x + room.width;
      if (roomMaxX > maxCoordinateX) {
        maxCoordinateX = roomMaxX;
      }
    });

    let maxCoordinateY = 0;
    props.dungeonRooms.forEach((room) => {
      const roomMaxY = room.y + room.height;
      if (roomMaxY > maxCoordinateY) {
        maxCoordinateY = roomMaxY;
      }
    });

    const xInc = windowSize.width / maxCoordinateX * zoomlevel;
    const iconEstate = isTouchDevice ? 0 : iconbarHeight + 5;
    const yInc = (windowSize.height - bottomBarHeight - iconEstate) / maxCoordinateY * zoomlevel;

    setXInc(xInc);
    setYInc(yInc);
  }, [props.dungeonRooms, windowSize, zoomlevel,
  windowSize.width, windowSize.height, bottomBarHeight, iconbarHeight, isTouchDevice]);


  // Ri-disegniamo la mappa quando qualcosa cambia
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      drawMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, zoomlevel, mapOffset, currentDragDistance, currentDragDistance.x,
    currentDragDistance.y, windowSize.width, windowSize.height,
    drawnCorridors, props.dungeonRooms, xInc, yInc, props.selectedRoom]);


  const drawCorridors = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const realX = mapOffset.x + currentDragDistance.x;
    const realY = mapOffset.y + currentDragDistance.y;

    context.lineWidth = 5;

    corridorLayout.forEach(([fromIndex, toIndex]) => {
      const fromRoom = props.dungeonRooms[fromIndex];
      const toRoom = props.dungeonRooms[toIndex];

      const fromCenter = {
        x: fromRoom.x + Math.floor(fromRoom.width / 2),
        y: fromRoom.y + Math.floor(fromRoom.height / 2),
      };
      const toCenter = {
        x: toRoom.x + Math.floor(toRoom.width / 2),
        y: toRoom.y + Math.floor(toRoom.height / 2),
      };

      context.strokeStyle = color;
      context.strokeRect(fromCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, toCenter.x * xInc - fromCenter.x * xInc, 5);
      context.strokeRect(toCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, 5, toCenter.y * yInc - fromCenter.y * yInc);

      context.strokeStyle = 'yellow';
      context.strokeRect(fromCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, 5, 5);
      context.strokeRect(toCenter.x * xInc + 5 + realX, toCenter.y * yInc + 5 + realY, 5, 5);
    });
  };

  const drawSelectedRoomCorridors = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    const realX = mapOffset.x + currentDragDistance.x;
    const realY = mapOffset.y + currentDragDistance.y;
  
    // draw the corridors
    context.lineWidth = 5;
  
    if (props.selectedRoom === -1) {
      return;
    }
  
    // Trova i corridoi che coinvolgono la stanza selezionata
    const selectedCorridors = corridorLayout
      .map((corridor, index) => ({ corridor, index })) // Aggiungi l'indice del corridoio
      .filter(({ corridor: [fromIndex, toIndex] }) => fromIndex === props.selectedRoom || toIndex === props.selectedRoom);
  
    // Ordina i corridoi in base alla distanza tra gli indici in corridorLayout (decrescente)
    selectedCorridors.sort((a, b) => Math.abs(b.index - corridorLayout.indexOf(b.corridor)) - Math.abs(a.index - corridorLayout.indexOf(a.corridor)));
  
    // Disegna i corridoi ordinati
    selectedCorridors.forEach(({ corridor: [fromIndex, toIndex] }) => {
      const fromRoom = props.dungeonRooms[fromIndex];
      const toRoom = props.dungeonRooms[toIndex];
  
      const fromCenter = {
        x: fromRoom.x + Math.floor(fromRoom.width / 2),
        y: fromRoom.y + Math.floor(fromRoom.height / 2),
      };
      const toCenter = {
        x: toRoom.x + Math.floor(toRoom.width / 2),
        y: toRoom.y + Math.floor(toRoom.height / 2),
      };
  
      context.strokeStyle = color;
  
      // Disegna il corridoio tra le due stanze
      context.strokeRect(fromCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, toCenter.x * xInc - fromCenter.x * xInc, 5);
      context.strokeRect(toCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, 5, toCenter.y * yInc - fromCenter.y * yInc);
    });

    selectedCorridors.forEach(({ corridor: [fromIndex, toIndex] }) => {
      const fromRoom = props.dungeonRooms[fromIndex];
      const toRoom = props.dungeonRooms[toIndex];
  
      const fromCenter = {
        x: fromRoom.x + Math.floor(fromRoom.width / 2),
        y: fromRoom.y + Math.floor(fromRoom.height / 2),
      };
      const toCenter = {
        x: toRoom.x + Math.floor(toRoom.width / 2),
        y: toRoom.y + Math.floor(toRoom.height / 2),
      };
  
      // Disegna i punti finali del corridoio
      context.strokeStyle = 'yellow';
      context.strokeRect(fromCenter.x * xInc + 5 + realX, fromCenter.y * yInc + 5 + realY, 5, 5);
      context.strokeRect(toCenter.x * xInc + 5 + realX, toCenter.y * yInc + 5 + realY, 5, 5);
    });
  };
    
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

    props.dungeonRooms.forEach((room, index, array) => {

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
    drawSelectedRoomCorridors('red');

    drawIcons();
  }

  const getClickedRoomNumber = (x, y) => {

    for (let i = 0; i < props.dungeonRooms.length; i++) {
      const room = props.dungeonRooms[i];
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

      if (clickedRoomNumber < props.dungeonRooms.length - 1 && drawnCorridors.includes(clickedRoomNumber + 1)) {
        tempDrawnCorridors = tempDrawnCorridors.filter((roomNumber) => roomNumber !== clickedRoomNumber + 1);
      }

      setDrawnCorridors(tempDrawnCorridors);

    } else {
      let tempDrawnCorridors = [...drawnCorridors, clickedRoomNumber];

      if (clickedRoomNumber < props.dungeonRooms.length - 1 && !drawnCorridors.includes(clickedRoomNumber + 1)) {
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

    if (!isTouchDevice) {
      //If click is inside the zoom out icon, toggle the path visibility
      if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
        e.clientX - bcr.left <= 50 && e.clientX >= 0) {
        if (zoomlevel > 0.5) {

          setMapOffset({
            x: mapOffset.x * 1.25 + (windowSize.width / 2) * 0.25,
            y: mapOffset.y * 1.25 + (windowSize.height / 2) * 0.25,
          });

          setZoomlevel(zoomlevel - 0.25);
        }
        return;
      }

      //If click is inside the zoom in icon, toggle the path visibility
      if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
        e.clientX - bcr.left <= 110 && e.clientX >= 60) {
        if (zoomlevel < 4) {

          setMapOffset({
            x: mapOffset.x * 0.75 - (windowSize.width / 2) * 0.25,
            y: mapOffset.y * 0.75 - (windowSize.height / 2) * 0.25,
          });

          setZoomlevel(zoomlevel + 0.25);
        }
        return;
      }

      // If click is inside the info icon, toggle the info visibility
      if (e.clientY > bcr.height + bcr.top - iconbarHeight &&
        e.clientX - bcr.left <= 170 && e.clientX >= 120) {
        props.onInfoClick();
        return;
      }
    }

    // get the canvas coordinates of the click
    const x = (e.clientX - mapOffset.x - bcr.left) / xInc;
    const y = (e.clientY - mapOffset.y - bcr.top) / yInc;

    roomClicked(x, y);

  }

  // const screenTapped = (e) => {
  //   try {
  //     // get the canvas coordinates of the touch
  //     const touch = e.changedTouches[0];

  //     const canvas = canvasRef.current;
  //     const bcr = canvas.getBoundingClientRect();

  //     // If click is inside the zoom out icon, toggle the path visibility
  //     // if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
  //     //   touch.clientX - bcr.left <= 50 && touch.clientX >= 0) {
  //     //   if (zoomlevel > 0.5)
  //     //     setZoomlevel(zoomlevel - 0.25);
  //     //   return;
  //     // }

  //     // If click is inside the zoom in icon, toggle the path visibility
  //     // if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
  //     //   touch.clientX - bcr.left <= 110 && touch.clientX >= 60) {
  //     //   if (zoomlevel < 4)
  //     //     setZoomlevel(zoomlevel + 0.25);
  //     //   return;
  //     // }

  //     // If click is inside the info icon, toggle the info visibility
  //     // if (touch.clientY > bcr.height + bcr.top - iconbarHeight &&
  //     //   touch.clientX - bcr.left <= 170 && touch.clientX >= 120) {
  //     //   props.onInfoClick();
  //     //   return;
  //     // }

  //     const x = (touch.clientX - mapOffset.x - bcr.left) / xInc;
  //     const y = (touch.clientY - mapOffset.y - bcr.top) / yInc;

  //     roomClicked(x, y);
  //   } catch (e) {
  //     // No need to do anything
  //   }
  // }

  const calculateDistance = (touch1, touch2) => {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handlePinch = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = calculateDistance(touch1, touch2);

      if (initialPinchDistance === null) {
        setInitialPinchDistance(distance);
      } else {
        if (distance < initialPinchDistance * 0.75) {
          if (zoomlevel > 0.5) {

            const midPoint = {
              x: (touch1.pageX + touch2.pageX) / 2,
              y: (touch1.pageY + touch2.pageY) / 2,
            };

            const newZoomLevel = zoomlevel - 0.25;
            const scaleFactor = newZoomLevel / zoomlevel;
            const newMapOffset = {
              x: mapOffset.x * scaleFactor + midPoint.x * (1 - scaleFactor),
              y: mapOffset.y * scaleFactor + midPoint.y * (1 - scaleFactor),
            };

            setZoomlevel(newZoomLevel);
            setMapOffset(newMapOffset);
            setInitialPinchDistance(distance);
          }
        } else if (distance > initialPinchDistance * 1.25) {
          if (zoomlevel < 4) {

            const midPoint = {
              x: (touch1.pageX + touch2.pageX) / 2,
              y: (touch1.pageY + touch2.pageY) / 2,
            };

            const newZoomLevel = zoomlevel + 0.25;
            const scaleFactor = newZoomLevel / zoomlevel;
            const newMapOffset = {
              x: mapOffset.x * scaleFactor + midPoint.x * (1 - scaleFactor),
              y: mapOffset.y * scaleFactor + midPoint.y * (1 - scaleFactor),
            };

            setZoomlevel(newZoomLevel);
            setMapOffset(newMapOffset);
            setInitialPinchDistance(distance);
          }
        }
      }
    }
  };

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
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            mouseDown(touch);
          } else if (e.touches.length === 2) {
            handlePinch(e);
          }
        } catch (e) {
          // No need to do anything
        }
        return;
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length === 0) {
          setInitialPinchDistance(null);
        }
        const touch = e.changedTouches[0];
        mouseUp(touch);
        //screenTapped(e);
        return;
      }}
      onTouchMove={(e) => {
        try {
          if (e.touches.length === 1) {
            // get the canvas coordinates of the touch
            const touch = e.touches[0];

            const fromDragStartX = touch.pageX - mouseDragStartRef.current.x;
            const fromDragStartY = touch.pageY - mouseDragStartRef.current.y;

            setCurrentDragDistance({
              x: fromDragStartX,
              y: fromDragStartY,
            });
          } else if (e.touches.length === 2) {
            handlePinch(e);
          }
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
