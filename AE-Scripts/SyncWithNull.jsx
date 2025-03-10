function SyncWithNull() {
    try {
        var comp = app.project.activeItem;
        
        // Check if there's an active composition
        if (!(comp && comp instanceof CompItem)) {
            logError("No active composition", "Please open a composition first.");
            return;
        }

        // Step 1: Ask user to select shape layer
        alert("Step 1: Please select the Shape Layer you want to sync.");
        app.beginUndoGroup("Select Shape Layer");
        
        // Wait for user selection with timeout
        var startTime = new Date().getTime();
        var timeout = 30000; // 30 seconds timeout
        var shapeLayer = null;
        
        while (!shapeLayer) {
            if (new Date().getTime() - startTime > timeout) {
                logError("Selection Timeout", "Shape layer selection timed out after 30 seconds.");
                app.endUndoGroup();
                return;
            }

            if (comp.selectedLayers.length > 1) {
                logError("Multiple Selection", "Please select only one shape layer.");
                continue;
            }

            if (comp.selectedLayers.length === 1) {
                var selectedLayer = comp.selectedLayers[0];
                if (selectedLayer instanceof ShapeLayer) {
                    shapeLayer = selectedLayer;
                    break;
                } else {
                    logError("Invalid Layer Type", "Selected layer '" + selectedLayer.name + "' is not a shape layer.");
                }
            }
            app.executeCommand(app.findMenuCommandId("Deselect All"));
        }

        // Step 2: Find and list all null objects
        var nullLayers = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).nullLayer) {
                nullLayers.push(comp.layer(i));
            }
        }
        
        if (nullLayers.length === 0) {
            logError("No Null Objects", "No null objects found in composition.");
            app.endUndoGroup();
            return;
        }

        // Create list of null objects for selection
        var nullList = "Select a Null Object by number:\n\n";
        for (var i = 0; i < nullLayers.length; i++) {
            nullList += (i + 1) + ". " + nullLayers[i].name + "\n";
        }

        var selectedNullIndex = prompt(nullList, "1");
        
        // Validate selection
        if (selectedNullIndex === null || selectedNullIndex === "") {
            logError("Selection Cancelled", "Null object selection was cancelled.");
            app.endUndoGroup();
            return;
        }

        var nullIndex = parseInt(selectedNullIndex) - 1;
        if (isNaN(nullIndex) || nullIndex < 0 || nullIndex >= nullLayers.length) {
            logError("Invalid Selection", "Please enter a valid number between 1 and " + nullLayers.length);
            app.endUndoGroup();
            return;
        }

        var nullLayer = nullLayers[nullIndex];

        // Step 3: Set up the sync
        try {
            var positionExpression = "thisComp.layer(\"" + nullLayer.name + "\").position";
            var anchorPointExpression = "thisComp.layer(\"" + nullLayer.name + "\").anchorPoint";
            
            shapeLayer.position.expression = positionExpression;
            shapeLayer.anchorPoint.expression = anchorPointExpression;
            shapeLayer.autoOrient = AutoOrientType.ALONG_PATH;
            
            alert("✅ Sync complete!\nShape Layer: " + shapeLayer.name + "\nNull Object: " + nullLayer.name);
        } catch (expressionError) {
            logError("Expression Error", "Failed to set expressions: " + expressionError.toString());
            app.endUndoGroup();
            return;
        }
        
        app.endUndoGroup();
        
    } catch (error) {
        logError("Script Error", error.toString());
        app.endUndoGroup();
    }
}

function logError(type, message) {
    var errorLog = "=== " + type + " ===\n";
    errorLog += "Time: " + new Date().toLocaleString() + "\n";
    errorLog += "Error: " + message + "\n";
    errorLog += "==================";
    
    alert("❌ " + type + "\n" + message);
    $.writeln(errorLog);
}

// Execute the script
SyncWithNull();