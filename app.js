/**
 * HH Goa 2026 - Exact Card Generator Logic (Screenshot Assets Version)
 */

const COLORS = {
    BG_GREEN: '#215A36',
    DARK_GREEN: '#154224',
    YELLOW: '#d7c34f',
    PINK: '#f32569',
    WHITE: '#f4f4f4',
    STAMP_GREEN: '#286a43'
};

const state = {
    format: 'B', 
    imageObj: null,
    name: '',
    stack: '',
    builderTitle: 'Explorer'
};

const builderTitles = [
    'Explorer', 'Hacker', 'Shipwright', 'Pioneer', 
    'Architect', 'Visionary', 'Creator', 'Nomad'
];

// DOM Elements
const photoUpload = document.getElementById('photoUpload');
const dropzone = document.getElementById('dropzone');
const userNameInput = document.getElementById('userName');
const userStackInput = document.getElementById('userStack');
const canvas = document.getElementById('resultCanvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvasWrapper');
const previewArea = document.getElementById('previewArea');
const actionButtons = document.getElementById('actionButtons');

// Force display Format B inputs
document.getElementById('formatBFields').classList.remove('d-none');

// Preload Assets
const assets = {
    logo: new Image(),
    pattern: new Image(),
    bg: new Image(),
    palmLeft: new Image(),
    palmRight: new Image()
};

let assetsLoaded = 0;
const totalAssets = 5;

function onAssetLoad() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets && state.imageObj) {
        renderCanvas();
    }
}

assets.logo.onload = onAssetLoad;
assets.logo.src = 'assets/logo.png';
assets.pattern.onload = onAssetLoad;
assets.pattern.src = 'assets/pattern.png';
assets.bg.onload = onAssetLoad;
assets.bg.src = 'assets/bg.png?v=2'; 
assets.palmLeft.onload = onAssetLoad;
assets.palmLeft.src = 'assets/palm_left.png';
assets.palmRight.onload = onAssetLoad;
assets.palmRight.src = 'assets/palm_right.png';

document.fonts.load('10px "Playfair Display"');
document.fonts.load('10px "Caveat"');

// Inputs
userNameInput.addEventListener('input', (e) => {
    state.name = e.target.value;
    if (state.imageObj) renderCanvas();
});

userStackInput.addEventListener('input', (e) => {
    state.stack = e.target.value;
    if (state.imageObj) renderCanvas();
});

// Upload handling
photoUpload.addEventListener('change', handleUpload);
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = COLORS.YELLOW; });
dropzone.addEventListener('dragleave', () => dropzone.style.borderColor = '');
dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.style.borderColor = '';
    if (e.dataTransfer.files[0]) {
        photoUpload.files = e.dataTransfer.files;
        handleUpload({ target: photoUpload });
    }
});

async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    toggleLoading(true);

    try {
        let processFile = file;
        
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            if (typeof heic2any !== 'undefined') {
                const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
                processFile = Array.isArray(blob) ? blob[0] : blob;
            } else {
                throw new Error("HEIC converter not loaded");
            }
        }

        const url = URL.createObjectURL(processFile);
        const img = new Image();
        img.onload = () => {
            state.imageObj = img;
            toggleLoading(false);
            previewArea.classList.remove('d-none');
            actionButtons.classList.remove('d-none');
            
            if (!state.name) state.name = userNameInput.value || 'Devansh Mittal';
            if (!state.stack) state.stack = userStackInput.value || 'Fullstack Engineer';
            state.builderTitle = builderTitles[Math.floor(Math.random() * builderTitles.length)];
            
            document.fonts.ready.then(renderCanvas);
        };
        img.onerror = () => { alert("Failed to load image"); toggleLoading(false); };
        img.src = url;
    } catch (err) {
        console.error(err);
        alert("Upload failed. Try a standard JPG or PNG.");
        toggleLoading(false);
    }
}

function toggleLoading(isLoading) {
    document.getElementById('uploadPlaceholder').style.display = isLoading ? 'none' : 'block';
    document.getElementById('uploadLoading').classList.toggle('d-none', !isLoading);
}

function drawCover(img, x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip(); // Ensure the image never spills out of its designated box!
    
    const ratio = Math.max(w / img.width, h / img.height);
    const cw = img.width * ratio;
    const ch = img.height * ratio;
    const cx = x + (w - cw) / 2;
    const cy = y + (h - ch) / 2;
    
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, cw, ch);
    ctx.restore();
}

// --- Main Canvas Drawing ---
function renderCanvas() {
    if (!state.imageObj) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;
    canvasWrapper.style.aspectRatio = '1/1';
    
    // Background - Solid green matching the logo's background perfectly
    ctx.fillStyle = '#215A36';
    ctx.fillRect(0, 0, size, size);

    drawLeftBorder(size);
    
    // Bottom Palm Trees (Decorative visuals!)
    const palmLeftW = 350;
    const palmLeftH = assets.palmLeft.height * (palmLeftW / assets.palmLeft.width);
    ctx.drawImage(assets.palmLeft, 80, size - palmLeftH + 50, palmLeftW, palmLeftH);
    
    const palmRightW = 350;
    const palmRightH = assets.palmRight.height * (palmRightW / assets.palmRight.width);
    ctx.drawImage(assets.palmRight, size - palmRightW + 20, size - palmRightH + 50, palmRightW, palmRightH);

    // Main Logo Cutout - Center aligned at the top
    const logoW = 750;
    const logoRatio = logoW / assets.logo.width;
    const logoH = assets.logo.height * logoRatio;
    ctx.drawImage(assets.logo, (size - logoW) / 2 + 30, -20, logoW, logoH);

    drawStamp();
    drawHandwritingText();
    drawPolaroid();
}

function drawLeftBorder(size) {
    const w = 80;
    const patW = assets.pattern.width;
    const patH = assets.pattern.height;
    
    ctx.save();
    ctx.translate(w, 0);
    ctx.rotate(Math.PI / 2);
    const destH = w;
    const scale = destH / patH;
    const destW = patW * scale;
    
    for (let x = 0; x < size; x += destW) {
        ctx.drawImage(assets.pattern, 0, 0, patW, patH, x, -w, destW, destH);
    }
    
    ctx.restore();
}

function drawStamp() {
    ctx.save();
    const sx = 830;
    const sy = 180;
    const sw = 180;
    const sh = 240;

    // Postmark Wavy Lines
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        let py = sy + 30 + (i * 25);
        for (let x = sx - 250; x < sx - 20; x += 10) {
            ctx.lineTo(x, py + Math.sin(x * 0.1) * 8);
        }
    }
    ctx.stroke();

    // Stamp Border (Jagged)
    ctx.translate(sx, sy);
    ctx.fillStyle = COLORS.WHITE;
    ctx.beginPath();
    const teeth = 8;
    const toothW = sw / teeth;
    const toothH = sh / (teeth * 1.5);
    
    ctx.moveTo(0, 0);
    for (let i = 0; i <= teeth; i++) { ctx.lineTo(i * toothW, (i % 2 === 0) ? -5 : 0); }
    for (let i = 0; i <= teeth * 1.5; i++) { ctx.lineTo(sw + ((i % 2 === 0) ? 5 : 0), i * toothH); }
    for (let i = teeth; i >= 0; i--) { ctx.lineTo(i * toothW, sh + ((i % 2 === 0) ? 5 : 0)); }
    for (let i = teeth * 1.5; i >= 0; i--) { ctx.lineTo(((i % 2 === 0) ? -5 : 0), i * toothH); }
    ctx.fill();

    // Inner Stamp Box
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, sw - 30, sh - 30);
    
    // Inner Sun
    ctx.fillStyle = COLORS.YELLOW;
    ctx.beginPath();
    ctx.arc(sw/2, sh/2 - 10, 40, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Inner Waves
    ctx.fillStyle = COLORS.STAMP_GREEN;
    ctx.fillRect(15, sh/2 - 10, sw - 30, sh/2 - 25);
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for(let y = sh/2; y < sh - 20; y+= 15) {
        ctx.moveTo(15, y);
        ctx.lineTo(sw/2, y - 5);
        ctx.lineTo(sw - 15, y + 5);
    }
    ctx.stroke();

    // Texts inside stamp
    ctx.fillStyle = '#111';
    ctx.font = 'bold 16px "Space Mono"';
    ctx.textAlign = 'center';
    ctx.fillText('BUILDER ID 001', sw/2, 35);
    ctx.fillText('- HH Goa 2026', sw/2, sh - 25);
    ctx.restore();
}

function drawHandwritingText() {
    ctx.save();
    ctx.fillStyle = COLORS.WHITE;
    ctx.font = '45px "Caveat"';
    const tx = 620; 
    let ty = 460;
    const lineHeight = 55;

    ctx.fillText(state.builderTitle, tx, ty); ty += lineHeight;
    ctx.fillText(state.name || 'Devansh Mittal', tx, ty); ty += lineHeight;
    ctx.fillText(`- ${state.stack || 'Fullstack Engineer'}`, tx, ty); ty += lineHeight;
    ctx.fillText('- Sailing into', tx, ty); ty += lineHeight;
    ctx.fillText('#FrameInGoa', tx, ty);
    
    ctx.restore();
}

function drawPolaroid() {
    ctx.save();
    ctx.translate(350, 520);
    ctx.rotate(-4 * Math.PI / 180); 

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 15;

    const pw = 420;
    const ph = 520;
    ctx.fillStyle = COLORS.WHITE;
    ctx.fillRect(-pw/2, -ph/2, pw, ph);

    ctx.shadowColor = 'transparent';

    const iw = 380;
    const ih = 380;
    const ix = -pw/2 + 20;
    const iy = -ph/2 + 20;
    
    ctx.fillStyle = '#ddd';
    ctx.fillRect(ix, iy, iw, ih);

    drawCover(state.imageObj, ix, iy, iw, ih);

    ctx.restore();
}


// --- Export & Share ---

document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!state.imageObj) return;
    const link = document.createElement('a');
    link.download = `HH_Goa_2026_ID.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

document.getElementById('shareBtn').addEventListener('click', async () => {
    if (!state.imageObj) return;

    const shareBtn = document.getElementById('shareBtn');
    const shareText = document.getElementById('shareText');
    const shareLoading = document.getElementById('shareLoading');
    
    shareBtn.disabled = true;
    shareText.style.opacity = '0.5';
    shareLoading.style.display = 'inline-block';

    try {
        // Upload to Cloudinary
        const cloudName = 'ycmbo2ys';
        const uploadPreset = 'hh_goa_preset';
        
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.secure_url) {
            const imageUrl = data.secure_url;
            const text = encodeURIComponent(`I'm going to HH Goa 2026! 🌴💻 #FrameInGoa`);
            // We can attach the image URL to the tweet. Twitter will fetch it and display it.
            const intentUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(imageUrl)}`;
            window.open(intentUrl, '_blank');
        } else {
            throw new Error('Upload failed');
        }

    } catch (error) {
        console.error("Error sharing:", error);
        alert("Failed to prepare image for sharing. Please try downloading it instead.");
    } finally {
        shareBtn.disabled = false;
        shareText.style.opacity = '1';
        shareLoading.style.display = 'none';
    }
});
