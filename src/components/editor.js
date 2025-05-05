import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPalette from './components/ColorPalette';
import './styles/Editor.css';

const Editor = () => {
  const [gridSize, setGridSize] = useState(32);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState('pencil');
  const [showGrid, setShowGrid] = useState(true);

  // Define color palette
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00',
    '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#808080', '#800000', '#808000', '#008000',
    '#800080', '#008080', '#000080', '#C0C0C0'
  ];

  const handleToolChange = (tool) => {
    setCurrentTool(tool);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleGridToggle = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div className="editor">
      <div className="editor-container">
        <Toolbar 
          currentTool={currentTool} 
          onToolChange={handleToolChange}
          showGrid={showGrid}
          onGridToggle={handleGridToggle}
        />
        <div className="editor-main">
          <Canvas 
            gridSize={gridSize} 
            selectedColor={selectedColor} 
            currentTool={currentTool}
            showGrid={showGrid}
          />
        </div>
        <div className="editor-sidebar">
          <ColorPalette 
            colors={colors} 
            selectedColor={selectedColor} 
            onColorChange={handleColorChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;