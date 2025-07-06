
export const EXAMPLE_LUA_CODE = `-- Example Roblox GUI Code
local ScreenGui = Instance.new("ScreenGui")
local MainFrame = Instance.new("Frame")
local TitleLabel = Instance.new("TextLabel")
local Button1 = Instance.new("TextButton")
local Button2 = Instance.new("TextButton")

-- Main Frame
MainFrame.Size = UDim2.new(0.4, 0, 0.6, 0)
MainFrame.Position = UDim2.new(0.3, 0, 0.2, 0)
MainFrame.BackgroundColor3 = Color3.fromRGB(45, 45, 45)
MainFrame.BorderSizePixel = 2

-- Title Label
TitleLabel.Size = UDim2.new(1, 0, 0.2, 0)
TitleLabel.Position = UDim2.new(0, 0, 0, 0)
TitleLabel.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
TitleLabel.Text = "Roblox UI Preview"
TitleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
TitleLabel.TextSize = 24

-- Button 1
Button1.Size = UDim2.new(0.8, 0, 0.15, 0)
Button1.Position = UDim2.new(0.1, 0, 0.3, 0)
Button1.BackgroundColor3 = Color3.fromRGB(0, 162, 255)
Button1.Text = "Click Me!"
Button1.TextColor3 = Color3.fromRGB(255, 255, 255)
Button1.TextSize = 18

-- Button 2
Button2.Size = UDim2.new(0.8, 0, 0.15, 0)
Button2.Position = UDim2.new(0.1, 0, 0.5, 0)
Button2.BackgroundColor3 = Color3.fromRGB(255, 87, 87)
Button2.Text = "Another Button"
Button2.TextColor3 = Color3.fromRGB(255, 255, 255)
Button2.TextSize = 18`;
