
import { GuiElement, UDim2, Color3 } from '../types/GuiTypes';

export class LuaParser {
  private parseUDim2(text: string): UDim2 | null {
    const match = text.match(/UDim2\.new\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
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

  private extractProperty(code: string, propertyName: string): string | null {
    const regex = new RegExp(`${propertyName}\\s*=\\s*([^\\n;]+)`, 'i');
    const match = code.match(regex);
    return match ? match[1].trim() : null;
  }

  private extractStringProperty(code: string, propertyName: string): string | null {
    const property = this.extractProperty(code, propertyName);
    if (property) {
      const stringMatch = property.match(/["']([^"']*)["']/);
      return stringMatch ? stringMatch[1] : null;
    }
    return null;
  }

  private extractNumberProperty(code: string, propertyName: string): number | null {
    const property = this.extractProperty(code, propertyName);
    if (property) {
      const number = parseFloat(property);
      return isNaN(number) ? null : number;
    }
    return null;
  }

  public parseLuaCode(code: string): GuiElement[] {
    const elements: GuiElement[] = [];
    
    // Split by common GUI element creation patterns
    const lines = code.split('\n');
    let currentElement: Partial<GuiElement> | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detect GUI element creation
      if (trimmedLine.includes('Instance.new')) {
        if (currentElement) {
          elements.push(currentElement as GuiElement);
        }
        
        const typeMatch = trimmedLine.match(/Instance\.new\s*\(\s*["'](\w+)["']/);
        if (typeMatch) {
          currentElement = {
            Type: typeMatch[1] as GuiElement['Type'],
            children: []
          };
        }
      }
      
      // Parse properties
      if (currentElement && trimmedLine.includes('=')) {
        if (trimmedLine.includes('.Size')) {
          const sizeMatch = trimmedLine.match(/UDim2\.new\s*\([^)]+\)/);
          if (sizeMatch) {
            currentElement.Size = this.parseUDim2(sizeMatch[0]);
          }
        }
        
        if (trimmedLine.includes('.Position')) {
          const positionMatch = trimmedLine.match(/UDim2\.new\s*\([^)]+\)/);
          if (positionMatch) {
            currentElement.Position = this.parseUDim2(positionMatch[0]);
          }
        }
        
        if (trimmedLine.includes('.BackgroundColor3')) {
          const colorMatch = trimmedLine.match(/Color3\.(new|fromRGB)\s*\([^)]+\)/);
          if (colorMatch) {
            currentElement.BackgroundColor3 = this.parseColor3(colorMatch[0]);
          }
        }
        
        if (trimmedLine.includes('.TextColor3')) {
          const colorMatch = trimmedLine.match(/Color3\.(new|fromRGB)\s*\([^)]+\)/);
          if (colorMatch) {
            currentElement.TextColor3 = this.parseColor3(colorMatch[0]);
          }
        }
        
        if (trimmedLine.includes('.Text')) {
          const textMatch = trimmedLine.match(/["']([^"']*)["']/);
          if (textMatch) {
            currentElement.Text = textMatch[1];
          }
        }
        
        if (trimmedLine.includes('.TextSize')) {
          const sizeMatch = trimmedLine.match(/=\s*(\d+)/);
          if (sizeMatch) {
            currentElement.TextSize = parseInt(sizeMatch[1]);
          }
        }
        
        if (trimmedLine.includes('.BorderSizePixel')) {
          const borderMatch = trimmedLine.match(/=\s*(\d+)/);
          if (borderMatch) {
            currentElement.BorderSizePixel = parseInt(borderMatch[1]);
          }
        }
      }
    }
    
    // Add the last element
    if (currentElement) {
      elements.push(currentElement as GuiElement);
    }
    
    return elements;
  }
}
