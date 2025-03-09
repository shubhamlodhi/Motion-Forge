function createArrow() {
    try {
        var comp = app.project.activeItem;
        
        // Check if there's an active composition
        if (!(comp && comp instanceof CompItem)) {
            $.writeln("[ERROR] No active composition found");
            return;
        }
        
        // Create a new shape layer
        var arrowLayer = comp.layers.addShape();
        arrowLayer.name = "Arrow With Tail";
        
        // Get the contents of the shape layer
        var shapeGroup = arrowLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var shapePath = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
        var path = shapePath.property("ADBE Vector Shape");
        
        // Create arrow shape with tail
        var arrowShape = new Shape();
        arrowShape.vertices = [
            [0, 0],       // Base center
            [0, -40],     // Top point
            [100, 0],     // Arrow tip
            [0, 40],      // Bottom point
            [0, 0]        // Back to base
        ];
        arrowShape.closed = true;
        path.setValue(arrowShape);
        
        // Add stroke for better visibility
        var stroke = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Width").setValue(4);
        stroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1]);
        
        // Add fill
        var fill = shapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
        
        // Center in composition
        arrowLayer.position.setValue([comp.width/2, comp.height/2]);
        
        $.writeln("[SUCCESS] Arrow with tail created successfully");
        
    } catch (error) {
        $.writeln("=== Arrow Creation Error ===");
        $.writeln("Time: " + new Date().toLocaleString());
        $.writeln("Error: " + error.toString());
        $.writeln("========================");
    }
}

// Execute the script
createArrow();