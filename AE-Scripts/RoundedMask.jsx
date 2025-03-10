function createRoundedMask() {
    try {
        var comp = app.project.activeItem;
        
        // Validate composition
        if (!(comp && comp instanceof CompItem)) {
            alert("❌ Error: No active composition found");
            return;
        }

        // Validate layer selection
        if (comp.selectedLayers.length !== 1) {
            alert("❌ Error: Please select exactly one layer");
            return;
        }

        var targetLayer = comp.selectedLayers[0];
        app.beginUndoGroup("Create Rounded Mask");

        // Create null object for controls
        var controller = comp.layers.addNull();
        controller.name = "Rounded Mask Controller";
        
        // Parent controller to target layer and match position
        controller.parent = targetLayer;
        controller.transform.position.setValue([0, 0]);

        // Add controls
        var cornerRadius = controller.Effects.addProperty("ADBE Slider Control");
        cornerRadius.name = "Corner Radius";
        cornerRadius.property("Slider").setValue(20);

        var padding = controller.Effects.addProperty("ADBE Point Control");
        padding.name = "Padding";
        padding.property("Point").setValue([10, 10]);

        var margin = controller.Effects.addProperty("ADBE Point Control");
        margin.name = "Margin";
        margin.property("Point").setValue([0, 0]);

        // Add position offset control
        var positionOffset = controller.Effects.addProperty("ADBE Point Control");
        positionOffset.name = "Position Offset";
        positionOffset.property("Point").setValue([0, 0]);

        // Create mask
        var mask = targetLayer.Masks.addProperty("ADBE Mask Atom");
        mask.name = "Rounded Rectangle";
        var maskShape = mask.property("ADBE Mask Shape");

        // Create expression for dynamic mask shape
        // Update expression to include position offset
        // Update expression to work with parented controller
        var expression = [
            "var ctrl = thisComp.layer('" + controller.name + "');",
            "var radius = ctrl.effect('Corner Radius')('Slider');",
            "var padding = ctrl.effect('Padding')('Point');",
            "var margin = ctrl.effect('Margin')('Point');",
            "var offset = ctrl.effect('Position Offset')('Point');",
            "",
            "var rect = sourceRectAtTime();",
            "var w = rect.width + padding[0] * 2;",
            "var h = rect.height + padding[1] * 2;",
            "var x = rect.left - padding[0] - margin[0] + offset[0];",
            "var y = rect.top - padding[1] - margin[1] + offset[1];",
            "",
            "createPath(points = [[x + radius, y], [x + w - radius, y],",
            "    [x + w, y], [x + w, y + radius],",
            "    [x + w, y + h - radius], [x + w, y + h],",
            "    [x + w - radius, y + h], [x + radius, y + h],",
            "    [x, y + h], [x, y + h - radius],",
            "    [x, y + radius], [x, y]],",
            "inTangents = [[0, 0], [0, 0],",
            "    [-radius, 0], [0, 0],",
            "    [0, 0], [0, -radius],",
            "    [0, 0], [0, 0],",
            "    [radius, 0], [0, 0],",
            "    [0, 0], [0, radius]],",
            "outTangents = [[0, 0], [radius, 0],",
            "    [0, 0], [0, 0],",
            "    [0, radius], [0, 0],",
            "    [0, 0], [-radius, 0],",
            "    [0, 0], [0, 0],",
            "    [0, -radius], [0, 0]],",
            "is_closed = true);"
        ].join("\n");

        maskShape.expression = expression;

        alert("✨ Rounded mask created successfully!");
        app.endUndoGroup();

    } catch (error) {
        alert("❌ Error: " + error.toString());
        if (app.project) app.endUndoGroup();
    }
}

// Execute the script
createRoundedMask();