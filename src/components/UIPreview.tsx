
import React from 'react';
import { GuiElement } from '../types/GuiTypes';

interface UIPreviewProps {
  elements: GuiElement[];
}

export const UIPreview: React.FC<UIPreviewProps> = ({ elements }) => {
  const renderElement = (element: GuiElement, index: number) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.Position?.X?.Scale ? element.Position.X.Scale * 100 : 0}%`,
      top: `${element.Position?.Y?.Scale ? element.Position.Y.Scale * 100 : 0}%`,
      width: `${element.Size?.X?.Scale ? element.Size.X.Scale * 100 : 100}%`,
      height: `${element.Size?.Y?.Scale ? element.Size.Y.Scale * 100 : 100}%`,
      backgroundColor: element.BackgroundColor3 ? 
        `rgb(${Math.floor(element.BackgroundColor3.R * 255)}, ${Math.floor(element.BackgroundColor3.G * 255)}, ${Math.floor(element.BackgroundColor3.B * 255)})` : 
        'rgba(255, 255, 255, 0.1)',
      border: element.BorderSizePixel ? `${element.BorderSizePixel}px solid #666` : 'none',
      borderRadius: element.CornerRadius ? `${element.CornerRadius}px` : '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: element.TextColor3 ? 
        `rgb(${Math.floor(element.TextColor3.R * 255)}, ${Math.floor(element.TextColor3.G * 255)}, ${Math.floor(element.TextColor3.B * 255)})` : 
        '#ffffff',
      fontSize: element.TextSize ? `${element.TextSize}px` : '14px',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      boxSizing: 'border-box',
    };

    let content = null;
    if (element.Type === 'TextLabel' || element.Type === 'TextButton') {
      content = element.Text || element.Type;
    } else if (element.Type === 'ImageLabel' && element.Image) {
      content = <img src={element.Image} alt="GUI Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
    }

    return (
      <div key={index} style={style} className="gui-element">
        {content}
        {element.children && element.children.map((child, childIndex) => 
          renderElement(child, childIndex)
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: '#2d2d2d' }}>
        {elements.map((element, index) => renderElement(element, index))}
      </div>
      {elements.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-2xl mb-2">🎮</div>
            <p>Your Roblox UI will appear here</p>
            <p className="text-sm mt-1">Paste your Lua GUI code to see the preview</p>
          </div>
        </div>
      )}
    </div>
  );
};
