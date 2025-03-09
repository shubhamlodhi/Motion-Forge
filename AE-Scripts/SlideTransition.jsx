// Slide Transition Script for After Effects

function createSlideTransition() {
    try {
        var comp = app.project.activeItem;
        
        // Check if there's an active composition
        if (!(comp && comp instanceof CompItem)) {
            throw new Error("No active composition found. Please select a composition first.");
        }
        
        // Get selected layer
        if (comp.selectedLayers.length === 0) {
            throw new Error("No layer selected. Please select a layer to apply the transition.");
        }
        
        var layer = comp.selectedLayers[0];
        var transitionDuration = 1;
        
        // Add position animation
        var position = layer.property("ADBE Transform Group").property("ADBE Position");
        if (!position) {
            throw new Error("Could not access position property of the selected layer.");
        }
        
        var startPos = [comp.width * 1.5, position.value[1]];
        var endPos = position.value;
        
        // Set keyframes
        position.setValueAtTime(comp.time, startPos);
        position.setValueAtTime(comp.time + transitionDuration, endPos);
        
        // Add easy ease
        var keys = position.selectedKeys;
        position.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
        position.setTemporalEaseAtKey(2, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
    } catch (error) {
        alert("Error: " + error.message + "\n\nPlease ensure you have:\n1. An active composition\n2. A layer selected\n3. Sufficient permissions");
    }
}

// Execute the script
createSlideTransition();