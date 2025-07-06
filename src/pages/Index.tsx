
import React, { useState, useEffect } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { UIPreview } from '../components/UIPreview';
import { LuaParser } from '../utils/luaParser';
import { GuiElement } from '../types/GuiTypes';
import { EXAMPLE_LUA_CODE } from '../components/ExampleCode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Index = () => {
  const [code, setCode] = useState(EXAMPLE_LUA_CODE);
  const [elements, setElements] = useState<GuiElement[]>([]);
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

  const handleClearCode = () => {
    setCode('');
    toast.success('Code cleared');
  };

  const handleLoadExample = () => {
    setCode(EXAMPLE_LUA_CODE);
    toast.success('Example code loaded');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Roblox Lua UI Visualizer</h1>
              <p className="text-gray-400 mt-1">Paste your Roblox GUI code and see it come to life</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLoadExample} variant="outline" size="sm">
                Load Example
              </Button>
              <Button onClick={handleClearCode} variant="outline" size="sm">
                Clear Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Code Editor Panel */}
        <div className="w-1/2 border-r border-gray-800">
          <div className="h-full flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h2 className="font-semibold text-white">Lua Code Editor</h2>
              <p className="text-xs text-gray-400">Write your Roblox GUI code here</p>
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
                {elements.length > 0 ? `${elements.length} GUI element(s) detected` : 'No GUI elements detected'}
              </p>
            </div>
            <div className="flex-1">
              <UIPreview elements={elements} />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="bg-gray-900/90 border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">Supported Elements</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Frame</li>
                <li>• TextLabel</li>
                <li>• TextButton</li>
                <li>• ImageLabel</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Supported Properties</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Size (UDim2)</li>
                <li>• Position (UDim2)</li>
                <li>• BackgroundColor3</li>
                <li>• Text & TextColor3</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Tips</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Use Instance.new() syntax</li>
                <li>• UDim2.new(scaleX, offsetX, scaleY, offsetY)</li>
                <li>• Color3.fromRGB(r, g, b)</li>
                <li>• Try the example code!</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
