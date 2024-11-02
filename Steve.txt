-- ORIGINAL CREATOR: Depr1
--Fixed lags by stommmDev for toasters if the creator wants to shut down this script i will
-- If this script isn't on pastebin or the user who uploaded this isn't called "Delros12"
-- (and yes my pastebin account is Delros12) or the link is not https://pastebin.com/2NNDTLjL
-- then this is not the original link of this script. 

-- The original link of the script gets edited constantly for updates, if you use the original
-- link you will be able to enjoy the most recent updates of this script without changing to 
-- another link which contains updated script.

-- Enjoy! :)

-- Controls: Q to sneak, use the keypad numbers 1-9 to change blocks, choose a empty slot i
-- you want to remove a block.

-- this script will transform you into steve when used

local targetName = game.Players.LocalPlayer.Name
local player = game.Players:FindFirstChild(targetName)
function putTexture(part, frontF, backF, topF, bottomF, leftF, rightF, className)
	local faces = {"Front", "Back", "Top", "Bottom", "Left", "Right"}
	for i,f in pairs(faces) do
		local decal = Instance.new(className, part)
		if i == 1 then decal.Texture = frontF decal.Name = f end
		if i == 2 then decal.Texture = backF or frontF decal.Name = f  end
		if i == 3 then decal.Texture = topF or frontF decal.Name = f  end
		if i == 4 then decal.Texture = bottomF or frontF decal.Name = f end
		if i == 5 then decal.Texture = leftF or frontF decal.Name = f  end
		if i == 6 then decal.Texture = rightF or frontF decal.Name = f  end
		decal.Face = f
	end
	return part
end
function makeSquare(position, size, color, transparency, parent)
	local label = Instance.new("TextLabel", parent)
	label.Text = ""
	label.BorderSizePixel = 0
	label.BackgroundTransparency = transparency
	label.Position = position
	label.Size = size
	label.BackgroundColor3 = color
end
function putToolBarSlot(position, image)
	local playerGui = player:FindFirstChild("PlayerGui")
	if playerGui then
		local gui = playerGui:FindFirstChild("ToolBar") or Instance.new("ScreenGui", playerGui)
		gui.Name = "ToolBar"
		local slot = Instance.new("ImageLabel", gui)
		slot.Position = position
		slot.Size = UDim2.new(0, 32, 0, 32)
		slot.BackgroundTransparency = 1
		slot.ImageTransparency = 0
		slot.Image = image
		slot.ZIndex = 2
		
		makeSquare(UDim2.new(0, 0, 0, 0), UDim2.new(0, 32, 0, 32), 
			Color3.new(95/255, 89/255, 76/255), 0, slot)
		makeSquare(UDim2.new(0, 0, 0, 0), UDim2.new(0, 2, 0, 32), 
			Color3.new(0/255, 0/255, 0/255), 0.5, slot)
		makeSquare(UDim2.new(0, 2, 0, 0), UDim2.new(0, 30, 0, 2), 
			Color3.new(0/255, 0/255, 0/255), 0.5, slot)
		makeSquare(UDim2.new(0, -2, 0, -2), UDim2.new(0, 36, 0, 2), 
			Color3.new(106/255, 106/255, 106/255), 0, slot)
		makeSquare(UDim2.new(0, -2, 0, -2), UDim2.new(0, 2, 0, 36), 
			Color3.new(106/255, 106/255, 106/255), 0, slot)
		makeSquare(UDim2.new(0, 0, 0, 32), UDim2.new(0, 34, 0, 2), 
			Color3.new(130/255, 130/255, 130/255), 0, slot)
		makeSquare(UDim2.new(0, 32, 0, 0), UDim2.new(0, 2, 0, 34), 
			Color3.new(130/255, 130/255, 130/255), 0, slot)
		makeSquare(UDim2.new(0, -4, 0, -2), UDim2.new(0, 2, 0, 38), 
			Color3.new(130/255, 130/255, 130/255), 0, slot)
		makeSquare(UDim2.new(0, 34, 0, -2), UDim2.new(0, 2, 0, 36), 
			Color3.new(106/255, 106/255, 106/255), 0, slot)
		makeSquare(UDim2.new(0, -2, 0, 34), UDim2.new(0, 38, 0, 2), 
			Color3.new(106/255, 106/255, 106/255), 0, slot)
		makeSquare(UDim2.new(0, -4, 0, -4), UDim2.new(0, 40, 0, 2), 
			Color3.new(156/255, 156/255, 156/255), 0, slot)
	end
end
function divide(x, d)
	if x ~= 0 and d ~= 0 then
		return x/d
	else
		return x
	end
end -- so it doesn't divide by zero
function getDistance(v1, v2)
	return math.abs((Vector3.new(math.abs(v2.X - v1.X), math.abs(v2.Y - v1.Y), math.abs(v2.Z - v1.Z))).Magnitude)
end
function round(x)
  	if x%2 ~= 0.5 then
    	return math.floor(x+0.5)
  	end
  	return x-0.5
end
function weldTo(part1, part2)
	local weld = Instance.new("Weld", part1)
	weld.Part0 = part1
	weld.Part1 = part2
end
function getMagnitudeXZ(velocity)
	return math.abs(velocity.X) + math.abs(velocity.Z)
end
function placeBlock(block, cFPos)
	local blockPlaced = Instance.new("Part", workspace)
	blockPlaced.Material = "Fabric"
	blockPlaced.Anchored = true
	blockPlaced.Size = block.size
	blockPlaced.CFrame = cFPos
	putTexture(blockPlaced, block.frontTex, block.backTex, 
		block.topTex, block.bottomTex, block.leftTex, block.rightTex, "Texture")
	return blockPlaced
end
local toolBar = {
	Dirt = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://179655033",
		backTex = "rbxassetid://179655033",
		topTex = "rbxassetid://179655033",
		bottomTex = "rbxassetid://179655033",
		leftTex = "rbxassetid://179655033",
		rightTex = "rbxassetid://179655033"
	},
	Grass = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://96430337",
		backTex = "rbxassetid://96430337",
		topTex = "rbxassetid://96430265",
		bottomTex = "rbxassetid://179655033",
		leftTex = "rbxassetid://96430337",
		rightTex = "rbxassetid://96430337"
	},
	Stone = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://75880927",
		backTex = "rbxassetid://75880927",
		topTex = "rbxassetid://75880927",
		bottomTex = "rbxassetid://75880927",
		leftTex = "rbxassetid://75880927",
		rightTex = "rbxassetid://75880927"
	},
	Diamond_Ore = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://57928490",
		backTex = "rbxassetid://57928490",
		topTex = "rbxassetid://57928490",
		bottomTex = "rbxassetid://57928490",
		leftTex = "rbxassetid://57928490",
		rightTex = "rbxassetid://57928490"
	},
	Diamond_Block = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://56749955",
		backTex = "rbxassetid://56749955",
		topTex = "rbxassetid://56749955",
		bottomTex = "rbxassetid://56749955",
		leftTex = "rbxassetid://56749955",
		rightTex = "rbxassetid://56749955"
	},
	Wood_Planks = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://346201871",
		backTex = "rbxassetid://346201871",
		topTex = "rbxassetid://346201871",
		bottomTex = "rbxassetid://346201871",
		leftTex = "rbxassetid://346201871",
		rightTex = "rbxassetid://346201871"
	},
	Oak_Log = {
		size = Vector3.new(2.6, 2.6, 2.6),
		frontTex = "rbxassetid://310831812",
		backTex = "rbxassetid://310831812",
		topTex = "rbxassetid://152538557",
		bottomTex = "rbxassetid://152538557",
		leftTex = "rbxassetid://310831812",
		rightTex = "rbxassetid://310831812"
	}
}
if player then
	local char = player.Character
	if char then
		for _,cM in pairs(char:GetChildren()) do
			if cM.ClassName == "CharacterMesh" then cM:Destroy() end
		end
		
		--[]
		local gui = player.PlayerGui:FindFirstChild("ToolBar") or Instance.new("ScreenGui", player.PlayerGui)
		gui.Name = "ToolBar"
		
		makeSquare(UDim2.new(0.5, -166, 1, -111), UDim2.new(0, 364, 0, 44), 
			Color3.new(0/255, 0/255, 0/255), 0, gui)
		
		local blocks = {"Dirt", "Grass", "Stone", "Diamond_Ore", "Diamond_Block", "Wood_Planks", "Oak_Log"}
		for i = 1, 9 do
			if toolBar[blocks[i]] ~= nil then
				putToolBarSlot(UDim2.new(0.5, -160 + ((i-1)*40), 1, -105), toolBar[blocks[i]].frontTex)
			else
				putToolBarSlot(UDim2.new(0.5, -160 + ((i-1)*40), 1, -105), "")				
			end
		end	
		
		local humRootPart = char:WaitForChild("HumanoidRootPart")
		local head = char:WaitForChild("Head")
		local torso = char:WaitForChild("Torso")
		local lArm = char:WaitForChild("Left Arm")
		local rArm = char:WaitForChild("Right Arm")
		local lLeg = char:WaitForChild("Left Leg")
		local rLeg = char:WaitForChild("Right Leg")
		
		head.Size = Vector3.new(1.3, 1.3, 1.3)
		putTexture(head, "rbxassetid://38738031", "rbxassetid://36047330", 
			"rbxassetid://36047341", "rbxassetid://36047347",
			"rbxassetid://36047323", "rbxassetid://36047315", "Decal")
		head:WaitForChild("Mesh"):Destroy()
		head:WaitForChild("face"):Destroy()
		
		torso.Size = Vector3.new(1.3, 1.95, 0.65)
		putTexture(torso, "rbxassetid://38934753", "rbxassetid://38934731", 
			"rbxassetid://38934780", "rbxassetid://38934740",
			"rbxassetid://38934762", "rbxassetid://38934762", "Decal")
		
		lArm.Size = Vector3.new(0.65, 1.95, 0.65)
		putTexture(lArm, "rbxassetid://38934581", "rbxassetid://38934560", 
			"rbxassetid://38934613", "rbxassetid://38934568",
			"rbxassetid://38934601", "rbxassetid://38934591", "Decal")
		
		rArm.Size = Vector3.new(0.65, 1.95, 0.65)
		putTexture(rArm, "rbxassetid://38934560", "rbxassetid://38934581", 
			"rbxassetid://38934613", "rbxassetid://38934568",
			"rbxassetid://38934601", "rbxassetid://38934591", "Decal")
		
		lLeg.Size = Vector3.new(0.65, 1.95, 0.65)
		putTexture(lLeg, "rbxassetid://38936226", "rbxassetid://38936209", 
			"rbxassetid://38934719", "rbxassetid://38934712",
			"rbxassetid://38936255", "rbxassetid://38936242", "Decal")
		
		rLeg.Size = Vector3.new(0.65, 1.95, 0.65)
		putTexture(rLeg, "rbxassetid://38936209", "rbxassetid://38936226", 
			"rbxassetid://38934719", "rbxassetid://38934712",
			"rbxassetid://38936242", "rbxassetid://38936255", "Decal")
		
		char.Humanoid:ClearAllChildren()
		char.Animate:Remove()		
		
		-- now for the real stuff
		-- |
		-- |
		-- V
		Instance.new("BlockMesh", torso)
		Instance.new("BlockMesh", lArm)
		Instance.new("BlockMesh", rArm)
		Instance.new("BlockMesh", lLeg)
		Instance.new("BlockMesh", rLeg)
		
		local camera = workspace.Camera
		local camPart = Instance.new("Part", camera)
		camPart.Size = Vector3.new(0, 0, 0)
		camPart.CFrame = camera.CFrame
		camPart.Transparency = 1
		
		--[[local cameraHand = Instance.new("Part", camera)
		cameraHand.Size = Vector3.new(0.65, 1.95, 0.65)
		cameraHand.CanCollide = false
		cameraHand.Anchored = true
		cameraHand.Name = "CameraHand"
		putTexture(cameraHand, "rbxassetid://38934560", "rbxassetid://38934581", 
			"rbxassetid://38934613", "rbxassetid://38934568",
			"rbxassetid://38934601", "rbxassetid://38934591", "Decal")
		
		local cameraHandWeld = Instance.new("Motor6D", camPart)
		cameraHandWeld.Part0 = camPart
		cameraHandWeld.Part1 = cameraHand
		cameraHandWeld.C0 = CFrame.new(5, 0, 0)
		]]--
		
		local humanoid = char:WaitForChild("Humanoid")	
		humanoid.HipHeight = 0.3	

		local rootJoint = Instance.new("Motor6D", torso)
		rootJoint.Name = "RootJoint"
		rootJoint.Part0 = humRootPart
		rootJoint.Part1 = torso
		rootJoint.C1 = CFrame.new(0, 0.05, 0)
		
		local neck = Instance.new("Motor6D", torso)
		neck.Name = "Neck"
		neck.Part0 = head
		neck.Part1 = torso
		
		local lS = Instance.new("Motor6D", torso)
		lS.Name = "Left Shoulder"
		lS.Part0 = lArm
		lS.Part1 = torso
		lS.C0 = CFrame.new(-0.325, 0.975, 0) * CFrame.Angles(0, 0, 0)
		lS.C1 = CFrame.new(0.65, 0.975, 0)

		local rS = Instance.new("Motor6D", torso)
		rS.Name = "Right Shoulder"
		rS.Part0 = rArm
		rS.Part1 = torso
		rS.C0 = CFrame.new(-0.325, 0.975, 0) * CFrame.Angles(0, 0, 0)
		rS.C1 = CFrame.new(-0.65, 0.975, 0) * CFrame.Angles(0, -math.rad(180), 0)

		local lH = Instance.new("Motor6D", torso)
		lH.Name = "Left Hip"
		lH.Part0 = lLeg
		lH.Part1 = torso
		lH.C0 = CFrame.new(0, 0.975, 0)
		lH.C1 = CFrame.new(0.325, -0.975, 0) * CFrame.Angles(0, 0, 0)

		local rH = Instance.new("Motor6D", torso)
		rH.Name = "Right Hip"
		rH.Part0 = rLeg
		rH.Part1 = torso
		rH.C0 = CFrame.new(0, 0.975, 0)
		rH.C1 = CFrame.new(-0.325, -0.975, 0) * CFrame.Angles(0, -math.rad(180), 0)
		
		for _,p in pairs(char:GetChildren()) do
			if p.Name ~= "HumanoidRootPart" and p.ClassName == "Part" then
				local hit = Instance.new("Part", char)
				hit.Name = "DamagePart"
				hit.BrickColor = BrickColor.new("Bright red")
				hit.Material = "SmoothPlastic"
				hit.Transparency = 1
				hit.Size = Vector3.new(p.Size.X + 0.05, p.Size.Y + 0.05, p.Size.Z + 0.05)
				hit.CanCollide = false
				weldTo(hit, p)
			end
		end
		
		local ticks = 0
		local times = 0
		
		local walkAnim = 0
		local increaseWalkAnim = 1
		
		local idleAnimRotX = 0
		local idleAnimRotZ = 0
		local sneaking = 0
		
		local RS = game:GetService("RunService").RenderStepped
		local Mouse = player:GetMouse()		
		
		local oldHP = humanoid.Health
		local damageTime = 0
		
		local punchRotX = 0
		local punchRotY = 0
		local punchRotZ = 0			
		local punchSpeed = 0
		local punching = 0
		local selectedBlock = 8
		local punchEnded = 1
		local itemOnHand = nil
		
		local handItem = Instance.new("Part", char)
		handItem.Name = "HandItem"
		handItem.Size = Vector3.new(0.52, 0.52, 0.52)
		handItem.Transparency = 1	
		handItem.CanCollide = false
		
		local handItemWeld = Instance.new("Weld", char)
		handItemWeld.Part0 = handItem
		handItemWeld.Part1 = lArm
		handItemWeld.C1 = CFrame.new(0, -0.9, -0.6) * CFrame.Angles(math.rad(-10), math.rad(45), 0)	
		
		local sound = Instance.new("Sound", char)
		sound.Name = "Hurt"
		sound.Volume = 10
		sound.SoundId = "rbxassetid://535690488"		
		
		local facesToResize = {"Front", "Back", "Left", "Right", "Bottom", "Top"}
		Mouse.Button1Down:connect(function()
			if punchEnded == 1 then punching = 1 end
			if Mouse.Target then
				if getDistance(head.CFrame.p, Mouse.Hit.p) <= 10.4 then
					local humanoid = Mouse.Target.Parent:FindFirstChild("Humanoid")
					if humanoid then
						humanoid.Health = humanoid.Health - 10
						local parts = Mouse.Target.Parent:GetChildren()
						for _,p in pairs(parts) do
							if p.ClassName == "Part" then
								p.Velocity = Vector3.new(p.Velocity.X + (head.CFrame.lookVector.X * 18), p.Velocity.Y + (head.CFrame.lookVector.Y * 18) + 8, p.Velocity.Z + (head.CFrame.lookVector.Z * 18))
							end
						end
						return
					end
					local x = Mouse.Target.CFrame.p.X
					local y = Mouse.Target.CFrame.p.Y
					local z = Mouse.Target.CFrame.p.Z
					if Mouse.TargetSurface.Name == "Right" then x = x + 2.6 end
					if Mouse.TargetSurface.Name == "Left" then x = x - 2.6 end
					if Mouse.TargetSurface.Name == "Top" then y = y + 2.6 end
					if Mouse.TargetSurface.Name == "Bottom" then y = y - 2.6 end
					if Mouse.TargetSurface.Name == "Back" then z = z + 2.6 end
					if Mouse.TargetSurface.Name == "Front" then z = z - 2.6 end
					if Mouse.Target.Size.X > 2.6 or Mouse.Target.Size.Y > 2.6 or Mouse.Target.Size.Z > 2.6 then
						x = Mouse.Hit.p.X
						y = Mouse.Hit.p.Y
						z = Mouse.Hit.p.Z
					end
	--				local x = round(math.abs(mouseX)/2.6)*2.6
	--				local y = round(math.abs(mouseY)/2.6)*2.6
	--				local z = round(math.abs(mouseZ)/2.6)*2.6
	--				if Mouse.Hit.p.X < 0 then x = x * -1 end
	--				if Mouse.Hit.p.Y < 0 then y = y * -1 end
	--				if Mouse.Hit.p.Z < 0 then z = z * -1 end
					if selectedBlock == 0 then
						local blk = placeBlock(toolBar.Dirt, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 1 then
						local blk = placeBlock(toolBar.Grass, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 2 then
						local blk = placeBlock(toolBar.Stone, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 3 then
						local blk = placeBlock(toolBar.Diamond_Ore, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 4 then
						local blk = placeBlock(toolBar.Diamond_Block, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 5 then
						local blk = placeBlock(toolBar.Wood_Planks, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 6 then
						local blk = placeBlock(toolBar.Oak_Log, CFrame.new(x, y, z))
						for _,f in pairs(facesToResize) do
							blk:WaitForChild(f).StudsPerTileU = 2.6
							blk:WaitForChild(f).StudsPerTileV = 2.6
						end
					elseif selectedBlock == 7 or selectedBlock == 8 then
						if Mouse.Target.Size.X <= 10 and Mouse.Target.Size.Y <= 10 and Mouse.Target.Size.Z <= 10 then
							Mouse.Target.Parent = nil
						end
					end
				end
			end
		end)		
		
		local hasItemOnHand = 0
		local hi = 0
		-- selection thingy
		local selectLabel = Instance.new("TextLabel", gui)
		selectLabel.Size = UDim2.new(0, 32, 0, 32)
		selectLabel.Position = UDim2.new(0.5, -160 + (selectedBlock*40), 1, -105)
		selectLabel.BackgroundTransparency = 0.5
		selectLabel.BackgroundColor3 = Color3.new(1, 1, 1)
		selectLabel.BorderSizePixel = 0
		selectLabel.Text = ""
		selectLabel.ZIndex = 3
		--	
		Mouse.KeyDown:connect(function(key)
			if key == "q" then
				sneaking = 1
				humanoid.WalkSpeed = humanoid.WalkSpeed / 2
				rootJoint.C1 = CFrame.new(0, 0.325, 0) * CFrame.Angles(math.rad(sneaking*45), 0, 0)
				lH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(-math.rad(sneaking*45), 0, 0)
				rH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(math.rad(sneaking*45), 0, 0)
				--print("Sneaking...")
			end
			if key == "8" then 
				selectedBlock = 7
				itemOnHand = nil
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				if hasItemOnHand == 1 then hi = 1 end
			end
			if key == "9" then 
				selectedBlock = 8
				itemOnHand = nil
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				if hasItemOnHand == 1 then hi = 1 end
			end
			if key == "1" then 
				selectedBlock = 0
				itemOnHand = toolBar.Dirt
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "2" then 
				selectedBlock = 1 
				itemOnHand = toolBar.Grass
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "3" then 
				selectedBlock = 2 
				itemOnHand = toolBar.Stone
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "4" then 
				selectedBlock = 3 
				itemOnHand = toolBar.Diamond_Ore
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "5" then 
				selectedBlock = 4 
				itemOnHand = toolBar.Diamond_Block
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "6" then 
				selectedBlock = 5 
				itemOnHand = toolBar.Wood_Planks
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if key == "7" then 
				selectedBlock = 6 
				itemOnHand = toolBar.Oak_Log
				for _,d in pairs(handItem:GetChildren()) do
					d:Destroy()
				end
				putTexture(handItem, itemOnHand.frontTex, itemOnHand.backTex,
					itemOnHand.topTex, itemOnHand.bottomTex,
					itemOnHand.leftTex, itemOnHand.rightTex, "Texture")
				for _,f in pairs(facesToResize) do
					handItem:WaitForChild(f).StudsPerTileU = 0.52
					handItem:WaitForChild(f).StudsPerTileV = 0.52
				end
			end
			if (key == "0" or key == "1" or key == "2" 
				or key == "3" or key == "4" or key == "5"
				or key == "6" or key == "7") and hasItemOnHand == 0 then hi = 1 end
			selectLabel.Position = UDim2.new(0.5, -160 + ((selectedBlock)*40), 1, -105)
		end)
		
		Mouse.KeyUp:connect(function(key)
			if key == "q" then
				sneaking = 0
				humanoid.WalkSpeed = humanoid.WalkSpeed * 2
				rootJoint.C1 = CFrame.new(0, 0.05, 0) * CFrame.Angles(0, 0, 0)
				lH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(0, 0, 0)
				rH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(0, 0, 0)
				--print("Stopped sneaking...")
			end
		end)
		
		while RS:wait() do
			if itemOnHand ~= nil then 
				hasItemOnHand = 1 
				handItem.Transparency = 0
			else 
				hasItemOnHand = 0 
				handItem.Transparency = 1
			end
			if humanoid.Health < oldHP then
				damageTime = 60
				sound:Play()
			end
			oldHP = humanoid.Health
			if damageTime > 0 and humanoid.Health > 0 then
				for _,p in pairs(char:GetChildren()) do
					if p.Name ~= "HumanoidRootPart" and p.ClassName == "Part" then
						if p.Name == "DamagePart" then
							p.Transparency = 0.5
						end
					end
				end
				damageTime = damageTime - 2
				if damageTime <= 0 then
					for _,p in pairs(char:GetChildren()) do
						if p.Name ~= "HumanoidRootPart" and p.ClassName == "Part" then
							if p.Name == "DamagePart" then
								p.Transparency = 1
							end
						end
					end
				end
			end
			camPart.CFrame = camera.CFrame
			neck.C1 = CFrame.new(0, 0.975, 0) * CFrame.fromEulerAnglesXYZ(math.rad(sneaking*45), math.rad(camPart.Orientation.Y - torso.Orientation.Y), 0)
			neck.C0 = CFrame.new(0, -0.65, 0) * CFrame.Angles(-math.rad(camPart.Orientation.X - torso.Orientation.X - (sneaking*45)), 0, 0)		
			
			if getMagnitudeXZ(torso.Velocity) > 1 then
				if walkAnim >= 1 then
					increaseWalkAnim = -1
				elseif walkAnim <= -1 then
					increaseWalkAnim = 1
				end
				walkAnim = walkAnim + (increaseWalkAnim/(10+(sneaking*20)))
			else
				walkAnim = 0
			end
			
			--lH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(-math.rad(sneaking*45), 0, 0)
			--rH.C0 = CFrame.new(0, 0.975, 0) * CFrame.Angles(math.rad(sneaking*45), 0, 0)
			lH.C0 = lH.C0:lerp(CFrame.new(0, 0.975, 0) * CFrame.Angles(-math.rad(sneaking*45) + math.rad(damageTime*1.5) + math.rad(walkAnim*getMagnitudeXZ(torso.Velocity)*5/(1+sneaking)), 0, 0), 0.1)
	    	rH.C0 = rH.C0:lerp(CFrame.new(0, 0.975, 0) * CFrame.Angles(math.rad(sneaking*45) + math.rad(damageTime*1.5) + math.rad(walkAnim*getMagnitudeXZ(torso.Velocity)*5/(1+sneaking)), 0, 0), 0.1)
			--
			--rootJoint.C0 = CFrame.new(0, 0, 0) * CFrame.Angles(0, 0, 0)
			--print(math.abs(head.Orientation.Y) - math.abs(humRootPart.Orientation.Y))
			--if (head.Orientation.Y * 2) - (head.Orientation.Y + torso.Orientation.Y) > 45 then
				--humRootPart.CFrame = humRootPart.CFrame * CFrame.Angles(0, math.rad(-45 + head.Orientation.Y), 0)
				--print("-45")
			--end
			--if (head.Orientation.Y * 2) - (head.Orientation.Y + torso.Orientation.Y) < -45 then
				--humRootPart.CFrame = humRootPart.CFrame * CFrame.Angles(0, math.rad(45 + head.Orientation.Y), 0)
				--print("45")
			--end
			
			--move these arms
			rootJoint.C1 = rootJoint.C1:lerp(CFrame.new(0, 0.325, 0) * CFrame.Angles(math.rad(sneaking*45), math.rad(punchRotY), 0), 0.2)
			
	    	lS.C0 = lS.C0:lerp(CFrame.new(-0.325, 0.975, 0) * CFrame.Angles(idleAnimRotX/20 + math.rad(-hasItemOnHand*10) + math.rad(punchRotX) + math.rad(damageTime*1.5) + math.rad(walkAnim*getMagnitudeXZ(torso.Velocity)*5/(1+sneaking)), 0, math.rad(punchRotZ) + idleAnimRotZ/20), 0.025+(math.min(1, getMagnitudeXZ(torso.Velocity))/12) + divide(punchSpeed, 6) + hi)
	    	rS.C0 = rS.C0:lerp(CFrame.new(-0.325, 0.975, 0) * CFrame.Angles(idleAnimRotX/20 + math.rad(damageTime*1.5) + math.rad(walkAnim*getMagnitudeXZ(torso.Velocity)*5/(1+sneaking)), 0, idleAnimRotZ/20), 0.025+(math.min(1, getMagnitudeXZ(torso.Velocity))/12))
			if punching == 1 and punchEnded == 1 then
				punching = 0
				--print("steve uses punch!!")
				local coPunch = coroutine.wrap(function()
					punchEnded = 0
					punchSpeed = 1
					punchRotX = -60
					punchRotY = -8
					punchRotZ = -35
					wait(0.075)
					punchSpeed = 1
					punchRotX = -75
					punchRotY = 8
					punchRotZ = 40
					wait(0.075)
					punchSpeed = 1
					punchRotX = -20
					punchRotZ = 40
					wait(0.075)
					punchSpeed = 3.5
					punchRotX = 0
					punchRotY = 0
					punchRotZ = 0
					punchEnded = 1
					wait(0.06)	
					punchSpeed = 0			
				end)
				coPunch()
			end			
			if ticks > 20 then
				ticks = 0
				if times == 0 then
					times = times + 1
					idleAnimRotX = -1
					idleAnimRotZ = 0
				elseif times == 1 then
					times = times + 1
					idleAnimRotX = -0.75
					idleAnimRotZ = -0.75
				elseif times == 2 then
					times = times + 1
					idleAnimRotX = 0
					idleAnimRotZ = -1
				elseif times == 3 then
					times = times + 1
					idleAnimRotX = 0.75
					idleAnimRotZ = -0.75
					--idleAnimRotX = 0.75
					--idleAnimRotZ = -0
				elseif times == 4 then
					times = times + 1
					idleAnimRotX = 1
					idleAnimRotZ = 0
					--idleAnimRotX = 1
					--idleAnimRotZ = 0
				elseif times == 5 then
					times = times + 1
					idleAnimRotX = 0.75
					idleAnimRotZ = 0.75
				elseif times == 6 then
					times = times + 1
					idleAnimRotX = 0
					idleAnimRotZ = 1
				elseif times == 7 then
					times = 0
					idleAnimRotX = -0.75
					idleAnimRotZ = 0.75
				end
			end
			if hi == 1 then hi = 0 end
			ticks = ticks + 1
		end
	end
end