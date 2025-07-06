
import { GuiElement, UDim2, Color3 } from '../types/GuiTypes';

export class LuaParser {
  private variables: Map<string, GuiElement> = new Map();

  private parseUDim2(text: string): UDim2 | null {
    const match = text.match(/UDim2\.new\s*\(\s*([\d.]+)\s*,\s*([\d.-]+)\s*,\s*([\d.]+)\s*,\s*([\d.-]+)\s*\)/);
    if (match) {
      return {
        X: { Scale: parseFloat(match[1]), Offset: parseFloat(match[2]) },
        Y: { Scale: parseFloat(match[3]), Offset: parseFloat(match[4]) }
      };
    }
    return null;
  }

  private parseColor3(text: string): Color3 | null {
    const match = text.match(/Color3\.new\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    if (match) {
      return {
        R: parseFloat(match[1]),
        G: parseFloat(match[2]),
        B: parseFloat(match[3])
      };
    }
    
    // Handle Color3.fromRGB
    const rgbMatch = text.match(/Color3\.fromRGB\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      return {
        R: parseInt(rgbMatch[1]) / 255,
        G: parseInt(rgbMatch[2]) / 255,
        B: parseInt(rgbMatch[3]) / 255
      };
    }
    
    return null;
  }

  private parseVector2(text: string): { X: number; Y: number } | null {
    const match = text.match(/Vector2\.new\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    if (match) {
      return {
        X: parseFloat(match[1]),
        Y: parseFloat(match[2])
      };
    }
    return null;
  }

  public parseLuaCode(code: string): GuiElement[] {
    this.variables.clear();
    const elements: GuiElement[] = [];
    
    const lines = code.split('\n');
    let currentVariableName: string | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip comments and empty lines
      if (line.startsWith('--') || line === '') continue;
      
      // Detect variable creation with Instance.new
      const instanceMatch = line.match(/local\s+(\w+)\s*=\s*Instance\.new\s*\(\s*["'](\w+)["']\s*\)/);
      if (instanceMatch) {
        const [, varName, elementType] = instanceMatch;
        currentVariableName = varName;
        
        const element: GuiElement = {
          Type: elementType as GuiElement['Type'],
          Name: varName,
          children: []
        };
        
        this.variables.set(varName, element);
        continue;
      }
      
      // Parse property assignments
      if (currentVariableName && line.includes('=')) {
        const element = this.variables.get(currentVariableName);
        if (!element) continue;
        
        // Size property
        if (line.includes('.Size')) {
          const udim2Match = line.match(/UDim2\.new\s*\([^)]+\)/);
          if (udim2Match) {
            element.Size = this.parseUDim2(udim2Match[0]);
          }
        }
        
        // Position property
        else if (line.includes('.Position')) {
          const udim2Match = line.match(/UDim2\.new\s*\([^)]+\)/);
          if (udim2Match) {
            element.Position = this.parseUDim2(udim2Match[0]);
          }
        }
        
        // BackgroundColor3 property
        else if (line.includes('.BackgroundColor3')) {
          const colorMatch = line.match(/Color3\.(new|fromRGB)\s*\([^)]+\)/);
          if (colorMatch) {
            element.BackgroundColor3 = this.parseColor3(colorMatch[0]);
          }
        }
        
        // TextColor3 property
        else if (line.includes('.TextColor3')) {
          const colorMatch = line.match(/Color3\.(new|fromRGB)\s*\([^)]+\)/);
          if (colorMatch) {
            element.TextColor3 = this.parseColor3(colorMatch[0]);
          }
        }
        
        // Text property
        else if (line.includes('.Text')) {
          const textMatch = line.match(/["']([^"']*)["']/);
          if (textMatch) {
            element.Text = textMatch[1];
          }
        }
        
        // TextSize property
        else if (line.includes('.TextSize')) {
          const sizeMatch = line.match(/=\s*(\d+)/);
          if (sizeMatch) {
            element.TextSize = parseInt(sizeMatch[1]);
          }
        }
        
        // BorderSizePixel property
        else if (line.includes('.BorderSizePixel')) {
          const borderMatch = line.match(/=\s*(\d+)/);
          if (borderMatch) {
            element.BorderSizePixel = parseInt(borderMatch[1]);
          }
        }
        
        // BackgroundTransparency property
        else if (line.includes('.BackgroundTransparency')) {
          const transparencyMatch = line.match(/=\s*([\d.]+)/);
          if (transparencyMatch && parseFloat(transparencyMatch[1]) === 1) {
            element.BackgroundColor3 = { R: 0, G: 0, B: 0 };
            // We'll handle transparency in the renderer
          }
        }
        
        // Image property
        else if (line.includes('.Image')) {
          const imageMatch = line.match(/["']([^"']*)["']/);
          if (imageMatch) {
            element.Image = imageMatch[1];
          }
        }
        
        // Parent property - this indicates the element should be added to elements array
        else if (line.includes('.Parent')) {
          const parentMatch = line.match(/\.Parent\s*=\s*(\w+)/);
          if (parentMatch) {
            const parentName = parentMatch[1];
            
            // If parent is 'gui' or 'frame', add to main elements
            if (parentName === 'gui' || parentName === 'frame') {
              elements.push(element);
            }
            // Reset current variable name after parent assignment
            currentVariableName = null;
          }
        }
      }
      
      // If we encounter a new variable assignment, switch context
      const newVarMatch = line.match(/^(\w+)\./);
      if (newVarMatch && this.variables.has(newVarMatch[1])) {
        currentVariableName = newVarMatch[1];
      }
    }
    
    return elements;
  }
}
