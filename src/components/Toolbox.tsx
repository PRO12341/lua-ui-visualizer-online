
import React from 'react';
import { Button } from '@/components/ui/button';
import { GuiElement } from '../types/GuiTypes';

interface ToolboxProps {
  onAddElement: (elementType: GuiElement['Type']) => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ onAddElement }) => {
  const elementTypes: Array<{ type: GuiElement['Type']; label: string; icon: string }> = [
    { type: 'Frame', label: 'Frame', icon: '⬜' },
    { type: 'TextLabel', label: 'Text Label', icon: '📝' },
    { type: 'TextButton', label: 'Text Button', icon: '🔘' },
    { type: 'ImageLabel', label: 'Image', icon: '🖼️' },
    { type: 'ImageButton', label: 'Image Button', icon: '🖱️' },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300 mr-4">Toolbox:</span>
        {elementTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            onClick={() => onAddElement(type)}
            className="flex items-center gap-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600 hover:border-gray-500 bg-gray-800"
          >
            <span>{icon}</span>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
