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

function createBreatheEffect() {
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
        app.beginUndoGroup("Create Breathe Effect");

        try {
            // Store original scale
            var originalScale = targetLayer.transform.scale.value;
            
            // Animation parameters
            var duration = 2; // Duration of one breath cycle in seconds
            var scaleAmount = 5; // Percentage to scale
            var numCycles = 5; // Number of breath cycles
            
            // Create null object for animation control
            var controller = comp.layers.addNull();
            controller.name = "Breathe Controller";
            
            // Add slider control for intensity
            var intensitySlider = controller.Effects.addProperty("ADBE Slider Control");
            intensitySlider.name = "Breathing Intensity";
            intensitySlider.property("Slider").setValue(scaleAmount);

            // Add slider for speed
            var speedSlider = controller.Effects.addProperty("ADBE Slider Control");
            speedSlider.name = "Breathing Speed";
            speedSlider.property("Slider").setValue(duration);

            // Create expression for breathing animation
            var breatheExpression = [
                "var intensity = thisComp.layer('" + controller.name + "').effect('Breathing Intensity')('Slider');",
                "var speed = thisComp.layer('" + controller.name + "').effect('Breathing Speed')('Slider');",
                "var time = time % speed;",
                "var scale = intensity * Math.sin(2 * Math.PI * (time / speed));",
                "var result = value.slice();", // Create a copy of current scale values
                "result[0] += scale;",         // Add scale to X
                "result[1] += scale;",         // Add scale to Y
                "result"                       // Return the modified array
            ].join("\n");

            // Apply expression to scale property
            targetLayer.transform.scale.expression = breatheExpression;

            // Create keyframes for natural easing
            var scaleProperty = targetLayer.transform.scale;
            for (var i = 0; i <= numCycles; i++) {
                var time = i * duration;
                // Use original scale values directly without modification
                scaleProperty.setValueAtTime(time, originalScale);
            }

            // Add easing to keyframes with correct number of dimensions
            for (var j = 1; j < scaleProperty.numKeys; j++) {
                scaleProperty.setTemporalEaseAtKey(j, 
                    [new KeyframeEase(0, 50), new KeyframeEase(0, 50), new KeyframeEase(0, 50)], 
                    [new KeyframeEase(0, 50), new KeyframeEase(0, 50), new KeyframeEase(0, 50)]
                );
            }

            // Log success
            logSuccess("Breathe Effect", {
                targetLayer: targetLayer.name,
                duration: duration + "s per cycle",
                cycles: numCycles,
                intensity: scaleAmount + "%",
                controller: controller.name
            });

        } catch (innerError) {
            logError("Creation Error", "Failed to create breathe effect", {
                error: innerError.toString(),
                stage: "effect creation",
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
createBreatheEffect();