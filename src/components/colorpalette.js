import React from 'react';
import '../styles/colorpalette.css';

const ColorPalette = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="color-palette">
      <h3>Colors</h3>
      <div className="color-grid">
        {colors.map((color, index) => (
          <div 
            key={index}
            className={`color-cell ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>
      <div className="current-color">
        <span>Current Color:</span>
        <div 
          className="color-preview"
          style={{ backgroundColor: selectedColor }}
        />
        <span>{selectedColor}</span>
      </div>
    </div>
  );
};

export default ColorPalette;