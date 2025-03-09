function createProgressBar() {
    try {
        var comp = app.project.activeItem;
        
        if (!(comp && comp instanceof CompItem)) {
            $.writeln("[ERROR] No active composition found");
            return;
        }
        
        // Create background bar
        var bgLayer = comp.layers.addShape();
        bgLayer.name = "Progress Bar BG";
        var bgGroup = bgLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var bgRect = bgGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        
        // Set background rectangle size
        bgRect.property("ADBE Vector Rect Size").setValue([400, 40]);
        
        // Add background style
        var bgFill = bgGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        bgFill.property("ADBE Vector Fill Color").setValue([0.2, 0.2, 0.2]);
        var bgStroke = bgGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        bgStroke.property("ADBE Vector Stroke Width").setValue(2);
        bgStroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1]);
        
        // Create progress bar
        var progressLayer = comp.layers.addShape();
        progressLayer.name = "Progress Bar";
        var progressGroup = progressLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var progressRect = progressGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        
        // Set progress rectangle size
        progressRect.property("ADBE Vector Rect Size").setValue([400, 40]);
        
        // Add progress bar style
        var progressFill = progressGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        progressFill.property("ADBE Vector Fill Color").setValue([0.2, 0.8, 1]);
        
        // Add trim paths for animation
        var trimPath = progressGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
        var endProperty = trimPath.property("ADBE Vector Trim End");
        
        // Animate progress
        endProperty.setValueAtTime(0, 0);
        endProperty.setValueAtTime(2, 100);
        
        // Add easing
        endProperty.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
        endProperty.setTemporalEaseAtKey(2, [new KeyframeEase(0, 33)], [new KeyframeEase(0, 33)]);
        
        // Center both layers in composition
        var centerPos = [comp.width/2, comp.height/2];
        bgLayer.position.setValue(centerPos);
        progressLayer.position.setValue(centerPos);
        
        $.writeln("[SUCCESS] Progress bar created successfully");
        
    } catch (error) {
        $.writeln("=== Progress Bar Creation Error ===");
        $.writeln("Time: " + new Date().toLocaleString());
        $.writeln("Error: " + error.toString());
        $.writeln("================================");
    }
}

// Execute the script
createProgressBar();