
import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { UIPreview } from '../components/UIPreview';
import { Toolbox } from '../components/Toolbox';
import { LuaParser } from '../utils/luaParser';
import { GuiElement } from '../types/GuiTypes';
import { EXAMPLE_LUA_CODE } from '../components/ExampleCode';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [code, setCode] = useState(EXAMPLE_LUA_CODE);
  const [elements, setElements] = useState<GuiElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<GuiElement | null>(null);
  const parser = new LuaParser();

  useEffect(() => {
    try {
      const parsedElements = parser.parseLuaCode(code);
      setElements(parsedElements);
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Error parsing Lua code');
    }
  }, [code]);

  const handleAddElement = (elementType: GuiElement['Type']) => {
    const newElement: GuiElement = {
      Type: elementType,
      Name: `new${elementType}`,
      Size: { X: { Scale: 0, Offset: 100 }, Y: { Scale: 0, Offset: 30 } },
      Position: { X: { Scale: 0, Offset: 50 }, Y: { Scale: 0, Offset: 50 } },
      BackgroundColor3: { R: 0.2, G: 0.2, B: 0.2 },
      Text: elementType === 'TextLabel' || elementType === 'TextButton' ? 'New Text' : undefined,
      TextColor3: { R: 1, G: 1, B: 1 }
    };
    
    setElements([...elements, newElement]);
    generateLuaCode([...elements, newElement]);
  };

  const generateLuaCode = (elementsList: GuiElement[]) => {
    let luaCode = `local gui = Instance.new("ScreenGui")
gui.Name = "GeneratedUI"
gui.Parent = game.CoreGui

`;

    elementsList.forEach((element, index) => {
      const varName = element.Name || `element${index}`;
      luaCode += `local ${varName} = Instance.new("${element.Type}")
`;
      
      if (element.Size) {
        luaCode += `${varName}.Size = UDim2.new(${element.Size.X.Scale}, ${element.Size.X.Offset}, ${element.Size.Y.Scale}, ${element.Size.Y.Offset})
`;
      }
      
      if (element.Position) {
        luaCode += `${varName}.Position = UDim2.new(${element.Position.X.Scale}, ${element.Position.X.Offset}, ${element.Position.Y.Scale}, ${element.Position.Y.Offset})
`;
      }
      
      if (element.BackgroundColor3) {
        luaCode += `${varName}.BackgroundColor3 = Color3.fromRGB(${Math.floor(element.BackgroundColor3.R * 255)}, ${Math.floor(element.BackgroundColor3.G * 255)}, ${Math.floor(element.BackgroundColor3.B * 255)})
`;
      }
      
      if (element.Text) {
        luaCode += `${varName}.Text = "${element.Text}"
`;
      }
      
      if (element.TextColor3) {
        luaCode += `${varName}.TextColor3 = Color3.fromRGB(${Math.floor(element.TextColor3.R * 255)}, ${Math.floor(element.TextColor3.G * 255)}, ${Math.floor(element.TextColor3.B * 255)})
`;
      }
      
      luaCode += `${varName}.Parent = gui

`;
    });

    setCode(luaCode);
  };

  const handleUpdateElement = (updatedElement: GuiElement) => {
    const updatedElements = elements.map(el => 
      el === selectedElement ? updatedElement : el
    );
    setElements(updatedElements);
    generateLuaCode(updatedElements);
    setSelectedElement(updatedElement);
  };

  const handleCopyElement = (element: GuiElement) => {
    const copiedElement = {
      ...element,
      Name: `${element.Name}_copy`,
      Position: {
        X: { Scale: element.Position?.X.Scale || 0, Offset: (element.Position?.X.Offset || 0) + 20 },
        Y: { Scale: element.Position?.Y.Scale || 0, Offset: (element.Position?.Y.Offset || 0) + 20 }
      }
    };
    setElements([...elements, copiedElement]);
    generateLuaCode([...elements, copiedElement]);
    toast.success('Element copied');
  };

  const handleClearCode = () => {
    setCode('');
    setElements([]);
    toast.success('Code cleared');
  };

  const handleLoadExample = () => {
    setCode(EXAMPLE_LUA_CODE);
    toast.success('Example code loaded');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Roblox Lua UI Builder</h1>
              <p className="text-gray-400 mt-1">Build and preview your Roblox GUI visually</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLoadExample} variant="outline" size="sm">
                Load Example
              </Button>
              <Button onClick={handleCopyCode} variant="outline" size="sm">
                Copy Code
              </Button>
              <Button onClick={handleClearCode} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbox */}
      <Toolbox onAddElement={handleAddElement} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Code Editor Panel */}
        <div className="w-1/2 border-r border-gray-800">
          <div className="h-full flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-semibold text-white">Generated Lua Code</h2>
              <p className="text-xs text-gray-400">This code is auto-generated from your visual edits</p>
            </div>
            <div className="flex-1">
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2">
          <div className="h-full flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-semibold text-white">UI Preview</h2>
              <p className="text-xs text-gray-400">
                {elements.length > 0 ? `${elements.length} GUI element(s) | Right-click to copy elements` : 'Add elements using the toolbox above'}
              </p>
            </div>
            <div className="flex-1">
              <UIPreview 
                elements={elements} 
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onUpdateElement={handleUpdateElement}
                onCopyElement={handleCopyElement}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
