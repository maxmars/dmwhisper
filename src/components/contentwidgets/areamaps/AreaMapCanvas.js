import React, { useRef, useEffect } from 'react';

const AreaMapCanvas = ({ numCells, mapCells, onMapCellClicked, dark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellWidth = canvas.width / numCells;
    const cellHeight = canvas.height / numCells;

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      const cellIndex = row * numCells + col;
      const cell = mapCells[cellIndex];

      if (cell) {
        onMapCellClicked(cell.id);
      }
    };

    canvas.addEventListener('click', handleClick);

    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        const cellIndex = row * numCells + col;
        const cell = mapCells[cellIndex];

        if (cell) {
          ctx.fillStyle = 'orange';
          ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '16px Arial';

          const text = cell.description;
          const maxWidth = cellWidth - 10; // margine per evitare che il testo tocchi i bordi
          const textMetrics = ctx.measureText(text);

          if (textMetrics.width > maxWidth) {
            const scale = maxWidth / textMetrics.width;
            ctx.font = `${16 * scale}px Arial`;
          }

          ctx.fillText(cell.description, col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
        } else {
          ctx.fillStyle = dark ? 'black' : 'white';
          ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
      }
    }

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [numCells, mapCells, onMapCellClicked, dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '70vh' }}
      width={window.innerWidth}
      height={window.innerHeight * 0.7}
    />
  );
};

export default AreaMapCanvas;
