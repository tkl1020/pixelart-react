import React from 'react';
import '../styles/toolbar.css';

const Toolbar = ({ currentTool, onToolChange, showGrid, onGridToggle }) => {
  const tools = [
    { id: 'pencil', name: 'Pencil', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' }
  ];

  const handleGenerateSprite = () => {
    // Random sprite generation logic would go here
    alert('Sprite generation would happen here');
  };

  const handleSaveImage = () => {
    const canvas = document.getElementById('pixel-canvas');
    if (!canvas) return;
    
    // Convert canvas to image
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="toolbar">
      <div className="tools-group">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${currentTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.name}
          >
            <span role="img" aria-label={tool.name}>{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
      
      <div className="tools-group">
        <button 
          className="tool-button" 
          onClick={onGridToggle}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <span role="img" aria-label="Grid">{showGrid ? '🔳' : '⬜'}</span>
          <span className="tool-name">Grid</span>
        </button>
        
        <button 
          className="tool-button" 
          onClick={handleGenerateSprite}
          title="Generate Random Sprite"
        >
          <span role="img" aria-label="Generate">🎲</span>
          <span className="tool-name">Generate</span>
        </button>
        
        <button 
          className="tool-button" 
          onClick={handleSaveImage}
          title="Save as PNG"
        >
          <span role="img" aria-label="Save">💾</span>
          <span className="tool-name">Save</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;