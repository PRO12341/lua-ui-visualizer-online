
import React, { useState, useEffect } from 'react';
import { GuiElement } from '../types/GuiTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyEditorProps {
  element: GuiElement | null;
  onUpdate: (element: GuiElement) => void;
  onClose: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ element, onUpdate, onClose }) => {
  const [editedElement, setEditedElement] = useState<GuiElement | null>(element);

  useEffect(() => {
    setEditedElement(element);
  }, [element]);

  if (!editedElement) return null;

  const handlePropertyChange = (property: string, value: any) => {
    const updated = { ...editedElement, [property]: value };
    setEditedElement(updated);
  };

  const handlePositionChange = (axis: 'X' | 'Y', type: 'Scale' | 'Offset', value: number) => {
    const updated = {
      ...editedElement,
      Position: {
        ...editedElement.Position,
        [axis]: {
          ...editedElement.Position?.[axis],
          [type]: value
        }
      }
    };
    setEditedElement(updated);
  };

  const handleSizeChange = (axis: 'X' | 'Y', type: 'Scale' | 'Offset', value: number) => {
    const updated = {
      ...editedElement,
      Size: {
        ...editedElement.Size,
        [axis]: {
          ...editedElement.Size?.[axis],
          [type]: value
        }
      }
    };
    setEditedElement(updated);
  };

  const handleColorChange = (colorType: 'BackgroundColor3' | 'TextColor3', channel: 'R' | 'G' | 'B', value: number) => {
    const updated = {
      ...editedElement,
      [colorType]: {
        ...editedElement[colorType],
        [channel]: value / 255
      }
    };
    setEditedElement(updated);
  };

  const handleSave = () => {
    if (editedElement) {
      onUpdate(editedElement);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Edit Properties</h3>
          <Button variant="outline" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label className="text-white">Name</Label>
            <Input
              value={editedElement.Name || ''}
              onChange={(e) => handlePropertyChange('Name', e.target.value)}
              className="bg-gray-700 text-white"
            />
          </div>

          {/* Text (for text elements) */}
          {(editedElement.Type === 'TextLabel' || editedElement.Type === 'TextButton') && (
            <div>
              <Label className="text-white">Text</Label>
              <Input
                value={editedElement.Text || ''}
                onChange={(e) => handlePropertyChange('Text', e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
          )}

          {/* Position */}
          <div>
            <Label className="text-white">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-400">X Scale</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedElement.Position?.X?.Scale || 0}
                  onChange={(e) => handlePositionChange('X', 'Scale', parseFloat(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">X Offset</Label>
                <Input
                  type="number"
                  value={editedElement.Position?.X?.Offset || 0}
                  onChange={(e) => handlePositionChange('X', 'Offset', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Y Scale</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedElement.Position?.Y?.Scale || 0}
                  onChange={(e) => handlePositionChange('Y', 'Scale', parseFloat(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Y Offset</Label>
                <Input
                  type="number"
                  value={editedElement.Position?.Y?.Offset || 0}
                  onChange={(e) => handlePositionChange('Y', 'Offset', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <Label className="text-white">Size</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-400">W Scale</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedElement.Size?.X?.Scale || 0}
                  onChange={(e) => handleSizeChange('X', 'Scale', parseFloat(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">W Offset</Label>
                <Input
                  type="number"
                  value={editedElement.Size?.X?.Offset || 100}
                  onChange={(e) => handleSizeChange('X', 'Offset', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">H Scale</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editedElement.Size?.Y?.Scale || 0}
                  onChange={(e) => handleSizeChange('Y', 'Scale', parseFloat(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">H Offset</Label>
                <Input
                  type="number"
                  value={editedElement.Size?.Y?.Offset || 30}
                  onChange={(e) => handleSizeChange('Y', 'Offset', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <Label className="text-white">Background Color (RGB)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-gray-400">Red</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.floor((editedElement.BackgroundColor3?.R || 0) * 255)}
                  onChange={(e) => handleColorChange('BackgroundColor3', 'R', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Green</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.floor((editedElement.BackgroundColor3?.G || 0) * 255)}
                  onChange={(e) => handleColorChange('BackgroundColor3', 'G', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Blue</Label>
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={Math.floor((editedElement.BackgroundColor3?.B || 0) * 255)}
                  onChange={(e) => handleColorChange('BackgroundColor3', 'B', parseInt(e.target.value))}
                  className="bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Text Color (for text elements) */}
          {(editedElement.Type === 'TextLabel' || editedElement.Type === 'TextButton') && (
            <div>
              <Label className="text-white">Text Color (RGB)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-gray-400">Red</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={Math.floor((editedElement.TextColor3?.R || 1) * 255)}
                    onChange={(e) => handleColorChange('TextColor3', 'R', parseInt(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Green</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={Math.floor((editedElement.TextColor3?.G || 1) * 255)}
                    onChange={(e) => handleColorChange('TextColor3', 'G', parseInt(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Blue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={Math.floor((editedElement.TextColor3?.B || 1) * 255)}
                    onChange={(e) => handleColorChange('TextColor3', 'B', parseInt(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1">Save Changes</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
