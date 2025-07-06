
import React, { useState } from 'react';
import { GuiElement } from '../types/GuiTypes';
import { PropertyEditor } from './PropertyEditor';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface UIPreviewProps {
  elements: GuiElement[];
  selectedElement?: GuiElement | null;
  onSelectElement?: (element: GuiElement | null) => void;
  onUpdateElement?: (element: GuiElement) => void;
  onCopyElement?: (element: GuiElement) => void;
}

export const UIPreview: React.FC<UIPreviewProps> = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onUpdateElement,
  onCopyElement 
}) => {
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);

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
    
    const isSelected = selectedElement === element;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `calc(${xScale * 100}% + ${xOffset}px)`,
      top: `calc(${yScale * 100}% + ${yOffset}px)`,
      width: widthScale > 0 ? `calc(${widthScale * 100}% + ${widthOffset}px)` : `${widthOffset}px`,
      height: heightScale > 0 ? `calc(${heightScale * 100}% + ${heightOffset}px)` : `${heightOffset}px`,
      backgroundColor: element.BackgroundColor3 ? 
        `rgb(${Math.floor(element.BackgroundColor3.R * 255)}, ${Math.floor(element.BackgroundColor3.G * 255)}, ${Math.floor(element.BackgroundColor3.B * 255)})` : 
        'rgba(255, 255, 255, 0.1)',
      border: isSelected ? '2px solid #3b82f6' : element.BorderSizePixel ? `${element.BorderSizePixel}px solid #666` : '1px solid rgba(255,255,255,0.1)',
      borderRadius: element.CornerRadius ? `${element.CornerRadius}px` : '4px',
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
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: '2px'
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

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectElement?.(element);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelectElement?.(element);
      setShowPropertyEditor(true);
    };

    return (
      <ContextMenu key={`${element.Name}-${index}`}>
        <ContextMenuTrigger>
          <div 
            style={style} 
            className={`gui-element ${element.Type === 'TextButton' ? 'hover:brightness-110' : ''}`}
            title={element.Name}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
          >
            {content}
            {element.children && element.children.map((child, childIndex) => 
              renderElement(child, childIndex)
            )}
            
            {/* Selection handles */}
            {isSelected && (
              <>
                <div 
                  className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(true);
                  }}
                />
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(true);
                  }}
                />
                <div 
                  className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(true);
                  }}
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(true);
                  }}
                />
              </>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => {
            onSelectElement?.(element);
            setShowPropertyEditor(true);
          }}>
            Edit Properties
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onCopyElement?.(element)}>
            Copy Element
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(element, null, 2));
          }}>
            Copy as JSON
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  // Handle mouse move for dragging
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedElement && onUpdateElement) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const updatedElement = {
          ...selectedElement,
          Position: {
            X: { 
              Scale: selectedElement.Position?.X?.Scale || 0, 
              Offset: (selectedElement.Position?.X?.Offset || 0) + deltaX 
            },
            Y: { 
              Scale: selectedElement.Position?.Y?.Scale || 0, 
              Offset: (selectedElement.Position?.Y?.Offset || 0) + deltaY 
            }
          }
        };
        
        onUpdateElement(updatedElement);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedElement, dragStart, onUpdateElement]);

  return (
    <>
      <div className="h-full w-full bg-gray-900 relative overflow-hidden" onClick={() => onSelectElement?.(null)}>
        <div className="absolute inset-0" style={{ backgroundColor: '#2d2d2d' }}>
          {elements.map((element, index) => renderElement(element, index))}
        </div>
        {elements.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">🎮</div>
              <p>Your Roblox UI will appear here</p>
              <p className="text-sm mt-1">Use the toolbox above to add elements</p>
            </div>
          </div>
        )}
      </div>

      {showPropertyEditor && selectedElement && (
        <PropertyEditor
          element={selectedElement}
          onUpdate={onUpdateElement!}
          onClose={() => setShowPropertyEditor(false)}
        />
      )}
    </>
  );
};
