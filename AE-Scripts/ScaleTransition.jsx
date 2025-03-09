// Scale Transition Script for After Effects

function createScaleTransition() {
    try {
        var comp = app.project.activeItem;
        
        // Check if there's an active composition
        if (!(comp && comp instanceof CompItem)) {
            throw new Error("Please select a composition!");
        }
        
        // Get selected layer
        if (comp.selectedLayers.length === 0) {
            throw new Error("Please select a layer!");
        }
        
        var layer = comp.selectedLayers[0];
        var transitionDuration = 1;
        
        // Set anchor point to center
        var layerWidth = layer.sourceRectAtTime(comp.time, false).width;
        var layerHeight = layer.sourceRectAtTime(comp.time, false).height;
        var anchorProp = layer.property("ADBE Transform Group").property("ADBE Anchor Point");
        anchorProp.setValue([layerWidth/2, layerHeight/2]);
        
        // Add scale animation
        var scale = layer.property("ADBE Transform Group").property("ADBE Scale");
        var startScale = [0, 0, 100];
        var endScale = scale.value;
        
        // Set keyframes
        scale.setValueAtTime(comp.time, startScale);
        scale.setValueAtTime(comp.time + transitionDuration, endScale);
        
        // Add easy ease with correct number of dimensions
        scale.setTemporalEaseAtKey(1, 
            [new KeyframeEase(0, 33), new KeyframeEase(0, 33), new KeyframeEase(0, 33)],
            [new KeyframeEase(0, 33), new KeyframeEase(0, 33), new KeyframeEase(0, 33)]
        );
        scale.setTemporalEaseAtKey(2, 
            [new KeyframeEase(0, 33), new KeyframeEase(0, 33), new KeyframeEase(0, 33)],
            [new KeyframeEase(0, 33), new KeyframeEase(0, 33), new KeyframeEase(0, 33)]
        );
        
        $.writeln("Scale transition created successfully!");
    } catch (error) {
        $.writeln("Error: " + error.toString());
    }
}

// Execute the script
try {
    createScaleTransition();
} catch (error) {
    $.writeln("Fatal Error: " + error.toString());
}