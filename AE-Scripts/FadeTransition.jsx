// Fade Transition Script for After Effects

function createFadeTransition() {
    var comp = app.project.activeItem;
    
    // Check if there's an active composition
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition!");
        return;
    }
    
    // Create a new solid layer for the transition
    var fadeLayer = comp.layers.addSolid([0, 0, 0], "Fade Transition", 
                                        comp.width, comp.height, 1);
    
    // Set the duration to 1 second
    var transitionDuration = 1;
    fadeLayer.outPoint = comp.time + transitionDuration;
    
    // Add opacity animation
    var opacity = fadeLayer.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(comp.time, 100);
    opacity.setValueAtTime(comp.time + transitionDuration, 0);
}

// Execute the script
createFadeTransition();