
import React from 'react';
import { GuiElement } from '../types/GuiTypes';

interface UIPreviewProps {
  elements: GuiElement[];
}

export const UIPreview: React.FC<UIPreviewProps> = ({ elements }) => {
  const renderElement = (element: GuiElement, index: number) => {
    // Calculate position and size
    const xScale = element.Position?.X?.Scale || 0;
    const xOffset = element.Position?.X?.Offset || 0;
    const yScale = element.Position?.Y?.Scale || 0;
    const yOffset = element.Position?.Y?.Offset || 0;
    
    const widthScale = element.Size?.X?.Scale || 0;
    const widthOffset = element.Size?.X?.Offset || 100;
    const heightScale = element.Size?.Y?.Scale || 0;
    const heightOffset = element.Size?.Y?.Offset || 30;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `calc(${xScale * 100}% + ${xOffset}px)`,
      top: `calc(${yScale * 100}% + ${yOffset}px)`,
      width: widthScale > 0 ? `calc(${widthScale * 100}% + ${widthOffset}px)` : `${widthOffset}px`,
      height: heightScale > 0 ? `calc(${heightScale * 100}% + ${heightOffset}px)` : `${heightOffset}px`,
      backgroundColor: element.BackgroundColor3 ? 
        `rgb(${Math.floor(element.BackgroundColor3.R * 255)}, ${Math.floor(element.BackgroundColor3.G * 255)}, ${Math.floor(element.BackgroundColor3.B * 255)})` : 
        'rgba(255, 255, 255, 0.1)',
      border: element.BorderSizePixel ? `${element.BorderSizePixel}px solid #666` : 'none',
      borderRadius: element.CornerRadius ? `${element.CornerRadius}px` : '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: element.Type === 'TextLabel' ? 'flex-start' : 'center',
      color: element.TextColor3 ? 
        `rgb(${Math.floor(element.TextColor3.R * 255)}, ${Math.floor(element.TextColor3.G * 255)}, ${Math.floor(element.TextColor3.B * 255)})` : 
        '#ffffff',
      fontSize: element.TextSize ? `${element.TextSize}px` : '14px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: element.Type === 'TextLabel' && element.Name === 'title' ? 'bold' : 'normal',
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '4px 8px',
      cursor: element.Type === 'TextButton' || element.Type === 'ImageButton' ? 'pointer' : 'default',
      userSelect: 'none',
    };

    // Handle text alignment for labels
    if (element.Type === 'TextLabel') {
      style.textAlign = 'left';
      style.justifyContent = 'flex-start';
    }

    // Special styling for buttons
    if (element.Type === 'TextButton') {
      style.transition = 'background-color 0.2s ease';
    }

    // Handle images
    let content = null;
    if (element.Type === 'TextLabel' || element.Type === 'TextButton') {
      content = element.Text || element.Type;
    } else if (element.Type === 'ImageLabel' || element.Type === 'ImageButton') {
      if (element.Image) {
        // For Roblox asset IDs, show a placeholder
        if (element.Image.includes('rbxassetid://')) {
          content = <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-xs">🔧</div>;
        } else {
          content = <img src={element.Image} alt="GUI Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />;
        }
      } else {
        content = <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-xs">IMG</div>;
      }
    }

    return (
      <div 
        key={`${element.Name}-${index}`} 
        style={style} 
        className={`gui-element ${element.Type === 'TextButton' ? 'hover:brightness-110' : ''}`}
        title={element.Name}
      >
        {content}
        {element.children && element.children.map((child, childIndex) => 
          renderElement(child, childIndex)
        )}
      </div>
    );
  };

  // Find the main frame to use as container
  const mainFrame = elements.find(el => el.Name === 'frame' || el.Type === 'Frame');
  const otherElements = elements.filter(el => el !== mainFrame);

  return (
    <div className="h-full w-full bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: '#2d2d2d' }}>
        {/* Render main frame first if it exists */}
        {mainFrame && renderElement(mainFrame, 0)}
        
        {/* Render other elements */}
        {otherElements.map((element, index) => renderElement(element, index + 1))}
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
