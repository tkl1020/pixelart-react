import React, { useRef, useEffect, useState } from 'react';
import '../styles/canvas.css';


const Canvas = ({ gridSize, selectedColor, currentTool, showGrid }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelData, setPixelData] = useState([]);
  const [startPos, setStartPos] = useState(null);
  
  // Initialize pixel data
  useEffect(() => {
    const initialData = Array(gridSize).fill().map(() => 
      Array(gridSize).fill('#FFFFFF')
    );
    setPixelData(initialData);
  }, [gridSize]);

  const drawPixel = (x, y, color) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    
    const newData = [...pixelData];
    newData[y][x] = color;
    setPixelData(newData);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = gridSize / canvas.offsetWidth;
    
    const x = Math.floor((e.clientX - rect.left) * scale);
    const y = Math.floor((e.clientY - rect.top) * scale);
    
    setIsDrawing(true);
    setStartPos({ x, y });
    
    if (currentTool === 'pencil') {
      drawPixel(x, y, selectedColor);
    } else if (currentTool === 'eraser') {
      drawPixel(x, y, '#FFFFFF');
    } else if (currentTool === 'fill') {
      fillArea(x, y, pixelData[y][x], selectedColor);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = gridSize / canvas.offsetWidth;
    
    const x = Math.floor((e.clientX - rect.left) * scale);
    const y = Math.floor((e.clientY - rect.top) * scale);
    
    if (currentTool === 'pencil') {
      drawPixel(x, y, selectedColor);
    } else if (currentTool === 'eraser') {
      drawPixel(x, y, '#FFFFFF');
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = gridSize / canvas.offsetWidth;
    
    const x = Math.floor((e.clientX - rect.left) * scale);
    const y = Math.floor((e.clientY - rect.top) * scale);
    
    if (currentTool === 'line') {
      drawLine(startPos.x, startPos.y, x, y, selectedColor);
    } else if (currentTool === 'rectangle') {
      drawRectangle(startPos.x, startPos.y, x, y, selectedColor);
    } else if (currentTool === 'circle') {
      drawCircle(startPos.x, startPos.y, x, y, selectedColor);
    }
    
    setIsDrawing(false);
    setStartPos(null);
  };

  const fillArea = (x, y, targetColor, fillColor) => {
    if (targetColor === fillColor) return;
    
    const queue = [{x, y}];
    const visited = new Set();
    const newData = [...pixelData];
    
    while (queue.length > 0) {
      const {x, y} = queue.shift();
      const key = `${x},${y}`;
      
      if (
        x < 0 || x >= gridSize || 
        y < 0 || y >= gridSize ||
        visited.has(key) ||
        newData[y][x] !== targetColor
      ) continue;
      
      newData[y][x] = fillColor;
      visited.add(key);
      
      queue.push({x: x+1, y});
      queue.push({x: x-1, y});
      queue.push({x, y: y+1});
      queue.push({x, y: y-1});
    }
    
    setPixelData(newData);
  };

  const drawLine = (x0, y0, x1, y1, color) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    
    const newData = [...pixelData];
    
    while (true) {
      if (x0 >= 0 && x0 < gridSize && y0 >= 0 && y0 < gridSize) {
        newData[y0][x0] = color;
      }
      
      if (x0 === x1 && y0 === y1) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    
    setPixelData(newData);
  };

  const drawRectangle = (x0, y0, x1, y1, color) => {
    const [startX, endX] = x0 < x1 ? [x0, x1] : [x1, x0];
    const [startY, endY] = y0 < y1 ? [y0, y1] : [y1, y0];
    
    const newData = [...pixelData];
    
    // Draw horizontal lines
    for (let x = startX; x <= endX; x++) {
      if (x >= 0 && x < gridSize && startY >= 0 && startY < gridSize) {
        newData[startY][x] = color;
      }
      if (x >= 0 && x < gridSize && endY >= 0 && endY < gridSize) {
        newData[endY][x] = color;
      }
    }
    
    // Draw vertical lines
    for (let y = startY + 1; y < endY; y++) {
      if (startX >= 0 && startX < gridSize && y >= 0 && y < gridSize) {
        newData[y][startX] = color;
      }
      if (endX >= 0 && endX < gridSize && y >= 0 && y < gridSize) {
        newData[y][endX] = color;
      }
    }
    
    setPixelData(newData);
  };

  const drawCircle = (x0, y0, x1, y1, color) => {
    // Calculate radius using distance formula
    const radius = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    
    const newData = [...pixelData];
    
    // Using Midpoint Circle Algorithm
    let x = radius;
    let y = 0;
    let decision = 1 - x;
    
    while (y <= x) {
      // Draw 8 octants
      if (x0 + x >= 0 && x0 + x < gridSize && y0 + y >= 0 && y0 + y < gridSize) 
        newData[y0 + y][x0 + x] = color;
      if (x0 - x >= 0 && x0 - x < gridSize && y0 + y >= 0 && y0 + y < gridSize) 
        newData[y0 + y][x0 - x] = color;
      if (x0 + x >= 0 && x0 + x < gridSize && y0 - y >= 0 && y0 - y < gridSize) 
        newData[y0 - y][x0 + x] = color;
      if (x0 - x >= 0 && x0 - x < gridSize && y0 - y >= 0 && y0 - y < gridSize) 
        newData[y0 - y][x0 - x] = color;
      if (x0 + y >= 0 && x0 + y < gridSize && y0 + x >= 0 && y0 + x < gridSize) 
        newData[y0 + x][x0 + y] = color;
      if (x0 - y >= 0 && x0 - y < gridSize && y0 + x >= 0 && y0 + x < gridSize) 
        newData[y0 + x][x0 - y] = color;
      if (x0 + y >= 0 && x0 + y < gridSize && y0 - x >= 0 && y0 - x < gridSize) 
        newData[y0 - x][x0 + y] = color;
      if (x0 - y >= 0 && x0 - y < gridSize && y0 - x >= 0 && y0 - x < gridSize) 
        newData[y0 - x][x0 - y] = color;
      
      y++;
      if (decision <= 0) {
        decision += 2 * y + 1;
      } else {
        x--;
        decision += 2 * (y - x) + 1;
      }
    }
    
    setPixelData(newData);
  };

  // Render the canvas when pixelData changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelSize = canvas.width / gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pixels
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = pixelData[y]?.[x] || '#FFFFFF';
        
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        
        // Draw grid lines if enabled
        if (showGrid) {
          ctx.strokeStyle = '#CCCCCC';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }, [pixelData, gridSize, showGrid]);

  return (
    <div className="canvas-container">
      <canvas
        id="pixel-canvas" 
        ref={canvasRef}
        width={400}
        height={400}
        className="pixel-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)}
      />
    </div>
  );
};

export default Canvas;