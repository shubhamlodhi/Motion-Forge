// Logging utilities
function consoleLog(type, message, data) {
    var timestamp = new Date().toLocaleTimeString();
    var logMessage = "[" + timestamp + "] " + type.toUpperCase() + ": " + message;
    
    if (data) {
        try {
            logMessage += "\n    " + JSON.stringify(data, null, 2).replace(/\n/g, "\n    ");
        } catch (e) {
            logMessage += "\n    [Object cannot be stringified]";
        }
    }
    $.writeln(logMessage);
}

function logError(type, message, details) {
    consoleLog("error", type + ": " + message, details);
    alert("❌ " + type + "\n" + message);
}

function logSuccess(type, details) {
    consoleLog("info", type + " created successfully", details);
    alert("✨ " + type + " created successfully!");
}

function createLayerFrame() {
    try {
        var comp = app.project.activeItem;
        
        // Validate composition
        if (!(comp && comp instanceof CompItem)) {
            logError("Composition Error", "No active composition found", {
                action: "validation",
                stage: "composition check"
            });
            return;
        }

        // Validate layer selection
        if (comp.selectedLayers.length !== 1) {
            logError("Selection Error", "Please select exactly one layer", {
                selected: comp.selectedLayers.length,
                required: 1
            });
            return;
        }

        var targetLayer = comp.selectedLayers[0];
        
        // Validate layer dimensions
        if (!targetLayer.width || !targetLayer.height) {
            logError("Layer Error", "Invalid layer dimensions", {
                width: targetLayer.width,
                height: targetLayer.height
            });
            return;
        }

        app.beginUndoGroup("Create Layer Frame");

        try {
            // Create frame shape layer
            var frameLayer = comp.layers.addShape();
            frameLayer.name = "Frame for " + targetLayer.name;
            frameLayer.moveBefore(targetLayer);

            // Calculate frame dimensions with padding
            var padding = 40;
            var frameWidth = targetLayer.width + (padding * 2);
            var frameHeight = targetLayer.height + (padding * 2);

            // Create rectangle shape
            var shapeGroup = frameLayer.content.addProperty("ADBE Vector Group");
            shapeGroup.name = "Frame Shape";
            
            var rect = shapeGroup.content.addProperty("ADBE Vector Shape - Rect");
            rect.property("Size").setValue([frameWidth, frameHeight]);

            // Add rounded corners
            var roundCorners = shapeGroup.content.addProperty("ADBE Vector Filter - RC");
            roundCorners.property("Radius").setValue(20);

            // Add solid fill with 20% opacity
            var fill = shapeGroup.content.addProperty("ADBE Vector Graphic - Fill");
            fill.property("Color").setValue([1, 1, 1]); // White
            fill.property("Opacity").setValue(20); // 20% opacity

            // Add stroke
            var stroke = shapeGroup.content.addProperty("ADBE Vector Graphic - Stroke");
            stroke.property("Color").setValue([1, 1, 1]); // White
            stroke.property("Stroke Width").setValue(5);

            // Position frame
            frameLayer.position.setValue([
                targetLayer.position.value[0],
                targetLayer.position.value[1]
            ]);

            // Log success
            logSuccess("Layer Frame", {
                targetLayer: targetLayer.name,
                dimensions: {
                    width: frameWidth,
                    height: frameHeight
                },
                padding: padding + "px",
                stroke: "5px white"
            });

        } catch (innerError) {
            logError("Creation Error", "Failed to create frame", {
                error: innerError.toString(),
                stage: "frame creation",
                target: targetLayer.name
            });
            app.endUndoGroup();
            return;
        }

        app.endUndoGroup();

    } catch (error) {
        logError("Script Error", error.toString(), {
            stack: error.stack || "No stack trace available"
        });
        if (app.project) app.endUndoGroup();
    }
}

// Execute the script
createLayerFrame();