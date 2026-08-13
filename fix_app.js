const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf-8');

// 1. Add palm trees to assets
appJs = appJs.replace(
    'const totalAssets = 3;',
    `    palmLeft: new Image(),\n    palmRight: new Image()\n};\n\nlet assetsLoaded = 0;\nconst totalAssets = 5;`
);

appJs = appJs.replace(
    "assets.bg.src = 'assets/bg.png';",
    "assets.bg.src = 'assets/bg.png';\nassets.palmLeft.onload = onAssetLoad;\nassets.palmLeft.src = 'assets/palm_left.png';\nassets.palmRight.onload = onAssetLoad;\nassets.palmRight.src = 'assets/palm_right.png';"
);

// 2. Fix drawCover
const badDrawCover = `function drawCover(img, x, y, w, h) {
    const ratio = Math.max(w / img.width, h / img.height);
    const cw = img.width * ratio;
    const ch = img.height * ratio;
    const cx = x + (w - cw) / 2;
    const cy = y + (h - ch) / 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, cw, ch);
}`;

const goodDrawCover = `function drawCover(img, x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    
    const ratio = Math.max(w / img.width, h / img.height);
    const cw = img.width * ratio;
    const ch = img.height * ratio;
    const cx = x + (w - cw) / 2;
    const cy = y + (h - ch) / 2;
    
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, cw, ch);
    ctx.restore();
}`;

appJs = appJs.replace(badDrawCover, goodDrawCover);

// 3. Enhance renderCanvas
const badRenderCanvas = `    // Draw the beach background cropped beautifully!
    // The bg is 1470x956, let's draw it to fill the 1080x1080 square.
    drawCover(assets.bg, 0, 0, size, size);
    
    // Overlay a dark green tint so the text pops and it feels like the ID card
    ctx.fillStyle = 'rgba(21, 66, 36, 0.85)';
    ctx.fillRect(0, 0, size, size);

    drawLeftBorder(size);
    
    // Draw exact Logo Cutout
    // Logo was cropped at 2540x900. Let's scale it down to fit.
    const logoW = 600;
    const logoRatio = logoW / assets.logo.width;
    const logoH = assets.logo.height * logoRatio;
    ctx.drawImage(assets.logo, 50, 40, logoW, logoH);`;

const goodRenderCanvas = `    // Use solid green background matching the logo's background perfectly
    ctx.fillStyle = '#215A36';
    ctx.fillRect(0, 0, size, size);

    drawLeftBorder(size);
    
    // Draw palm trees on the bottom corners
    const palmLeftW = 350;
    const palmLeftH = assets.palmLeft.height * (palmLeftW / assets.palmLeft.width);
    ctx.drawImage(assets.palmLeft, 80, size - palmLeftH + 50, palmLeftW, palmLeftH);
    
    const palmRightW = 350;
    const palmRightH = assets.palmRight.height * (palmRightW / assets.palmRight.width);
    ctx.drawImage(assets.palmRight, size - palmRightW + 20, size - palmRightH + 50, palmRightW, palmRightH);

    // Draw exact Logo Cutout
    // Logo is very wide, let's span it across the top, keeping aspect ratio
    const logoW = 750;
    const logoRatio = logoW / assets.logo.width;
    const logoH = assets.logo.height * logoRatio;
    ctx.drawImage(assets.logo, 50, -20, logoW, logoH);`;

appJs = appJs.replace(badRenderCanvas, goodRenderCanvas);

fs.writeFileSync('app.js', appJs);
console.log("Replaced");
