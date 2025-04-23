import React, { useRef, useEffect } from 'react';

// Aggiungiamo i nuovi colori alla lista
const colors = ['#90EE90', '#FFA500', '#ADD8E6', '#FFFF00', '#D3D3D3', '#E6E6FA', '#7FFFD4', '#FFC0CB']; // Verde chiaro, arancione, azzurro, giallo, grigio chiaro, lavanda, acquamarina, rosa

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

    const wrapText = (text, maxWidth) => {
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const descriptionColors = {};
    mapCells.forEach((cell) => {
      if (cell && !descriptionColors[cell.description]) {
        descriptionColors[cell.description] = colors[Object.keys(descriptionColors).length % colors.length];
      }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        const cellIndex = row * numCells + col;
        const cell = mapCells[cellIndex];

        if (cell) {
          ctx.fillStyle = descriptionColors[cell.description];
          ctx.fillRect(col * cellWidth + 2, row * cellHeight + 2, cellWidth - 4, cellHeight - 4);

          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '16px Arial';
          const lines = wrapText(cell.description, cellWidth - 10);
          lines.forEach((line, index) => {
            ctx.fillText(line, col * cellWidth + cellWidth / 2, row * cellHeight + (cellHeight / 2) - ((lines.length - 1) * 8) + (index * 16));
          });
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
      style={{ width: '95%', height: '70vh' }}
      width={window.innerWidth * 0.95}
      height={window.innerHeight * 0.7}
    />
  );
};

export default AreaMapCanvas;
