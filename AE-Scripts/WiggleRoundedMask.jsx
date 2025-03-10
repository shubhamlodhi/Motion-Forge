function createWiggleRoundedMask() {
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
        app.beginUndoGroup("Create Wiggle Rounded Mask");

        // Create null object for controls
        var controller = comp.layers.addNull();
        controller.name = "Wiggle Mask Controller";
        
        // Parent controller to target layer
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

        var wiggleAmount = controller.Effects.addProperty("ADBE Slider Control");
        wiggleAmount.name = "Wiggle Amount";
        wiggleAmount.property("Slider").setValue(10);

        var wiggleSpeed = controller.Effects.addProperty("ADBE Slider Control");
        wiggleSpeed.name = "Wiggle Speed";
        wiggleSpeed.property("Slider").setValue(2);

        // Create mask
        var mask = targetLayer.Masks.addProperty("ADBE Mask Atom");
        mask.name = "Wiggle Rectangle";
        var maskShape = mask.property("ADBE Mask Shape");

        var expression = [
            "var ctrl = thisComp.layer('" + controller.name + "');",
            "var radius = ctrl.effect('Corner Radius')('Slider');",
            "var padding = ctrl.effect('Padding')('Point');",
            "var margin = ctrl.effect('Margin')('Point');",
            "var amount = ctrl.effect('Wiggle Amount')('Slider');",
            "var speed = ctrl.effect('Wiggle Speed')('Slider');",
            "",
            "var rect = sourceRectAtTime();",
            "var w = rect.width + padding[0] * 2;",
            "var h = rect.height + padding[1] * 2;",
            "",
            "// Generate wiggle offsets",
            "var wiggleX = wiggle(speed, amount)[0];",
            "var wiggleY = wiggle(speed, amount)[1];",
            "",
            "var x = rect.left - padding[0] - margin[0] + wiggleX;",
            "var y = rect.top - padding[1] - margin[1] + wiggleY;",
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

        alert("✨ Wiggle rounded mask created successfully!");
        app.endUndoGroup();

    } catch (error) {
        alert("❌ Error: " + error.toString());
        if (app.project) app.endUndoGroup();
    }
}

// Execute the script
createWiggleRoundedMask();