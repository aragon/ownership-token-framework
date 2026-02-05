import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://otf.aragon.org';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'og-images');
const TEMP_DIR = path.join(__dirname, '..', 'public', 'og-images', 'temp');
const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 630;

// Effect options
const EFFECTS = {
  // Add padding and rounded corners
  padding: 40,
  borderRadius: 16,
  
  // Shadow configuration
  shadow: {
    blur: 40,
    offsetX: 0,
    offsetY: 20,
    color: 'rgba(0, 0, 0, 0.15)',
  },
  
  // Background color (from your --background CSS variable)
  backgroundColor: '#ffffff',
  
  // Gradient overlay (optional, set to null to disable)
  gradient: {
    enabled: true,
    color: 'rgba(72, 61, 179, 0.03)', // Subtle primary color overlay
    height: 100, // Height of gradient from top
  },
  
  // Subtle noise texture
  noise: {
    enabled: true,
    opacity: 0.02,
  },
};

// Routes to capture
const routes = [
  { path: '/', name: 'index' },
  { path: '/faq', name: 'faq' },
];

// Token routes to capture (sample set)
const tokenRoutes = [
  'aave',
  'aero',
  'crv',
  'ldo',
  'uni'
];

async function captureScreenshot(page, url, outputPath) {
  try {
    console.log(`Capturing: ${url}`);
    
    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Create temp file path
    const tempPath = outputPath.replace(OUTPUT_DIR, TEMP_DIR);
    
    // Take screenshot
    await page.screenshot({
      path: tempPath,
      fullPage: false,
      type: 'png'
    });

    // Apply effects
    await applyEffects(tempPath, outputPath);

    console.log(`✓ Enhanced: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to capture ${url}:`, error.message);
    return false;
  }
}

async function applyEffects(inputPath, outputPath) {
  try {
    // Load the screenshot and resize to exact dimensions
    const screenshot = await sharp(inputPath)
      .resize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, { fit: 'cover' })
      .toBuffer();
    
    // Calculate final dimensions with padding
    const finalWidth = VIEWPORT_WIDTH + (EFFECTS.padding * 2);
    const finalHeight = VIEWPORT_HEIGHT + (EFFECTS.padding * 2);
    
    // Create rounded corners mask
    const roundedMask = Buffer.from(
      `<svg width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}">
        <rect x="0" y="0" width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}" 
              rx="${EFFECTS.borderRadius}" ry="${EFFECTS.borderRadius}" fill="white"/>
      </svg>`
    );
    
    // Apply rounded corners to screenshot
    const roundedScreenshot = await sharp(screenshot)
      .composite([{
        input: roundedMask,
        blend: 'dest-in',
      }])
      .toBuffer();
    
    // Create shadow effect as a separate layer
    const shadowLayer = Buffer.from(
      `<svg width="${finalWidth}" height="${finalHeight}">
        <defs>
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${EFFECTS.shadow.blur / 2}"/>
            <feOffset dx="${EFFECTS.shadow.offsetX}" dy="${EFFECTS.shadow.offsetY}"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15"/>
            </feComponentTransfer>
          </filter>
        </defs>
        <rect x="${EFFECTS.padding}" y="${EFFECTS.padding}" 
              width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}" 
              rx="${EFFECTS.borderRadius}" fill="black" 
              filter="url(#shadow)"/>
      </svg>`
    );
    
    const compositeOps = [
      // Add shadow
      {
        input: shadowLayer,
        top: 0,
        left: 0,
      },
      // Add the rounded screenshot
      {
        input: roundedScreenshot,
        top: EFFECTS.padding,
        left: EFFECTS.padding,
      }
    ];
    
    // Add gradient overlay if enabled
    if (EFFECTS.gradient.enabled) {
      const gradientOverlay = Buffer.from(
        `<svg width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(72, 61, 179);stop-opacity:0.03" />
              <stop offset="${(EFFECTS.gradient.height / VIEWPORT_HEIGHT) * 100}%" style="stop-color:rgb(72, 61, 179);stop-opacity:0" />
            </linearGradient>
            <mask id="roundedMask">
              <rect x="0" y="0" width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}" 
                    rx="${EFFECTS.borderRadius}" ry="${EFFECTS.borderRadius}" fill="white"/>
            </mask>
          </defs>
          <rect width="${VIEWPORT_WIDTH}" height="${VIEWPORT_HEIGHT}" 
                fill="url(#grad)" mask="url(#roundedMask)"/>
        </svg>`
      );
      
      compositeOps.push({
        input: gradientOverlay,
        top: EFFECTS.padding,
        left: EFFECTS.padding,
      });
    }
    
    // Create final image with all effects
    await sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 4,
        background: EFFECTS.backgroundColor,
      }
    })
    .composite(compositeOps)
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(outputPath);
    
    // Clean up temp file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to apply effects to ${inputPath}:`, error.message);
    throw error;
  }
}

async function main() {
  // Ensure directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log('Starting Enhanced OpenGraph screenshot generation...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`);
  console.log(`Final size: ${VIEWPORT_WIDTH + (EFFECTS.padding * 2)}x${VIEWPORT_HEIGHT + (EFFECTS.padding * 2)}`);
  console.log(`\nEffects applied:`);
  console.log(`  • Rounded corners (${EFFECTS.borderRadius}px)`);
  console.log(`  • Drop shadow (blur: ${EFFECTS.shadow.blur}px, offset: ${EFFECTS.shadow.offsetY}px)`);
  console.log(`  • Padding (${EFFECTS.padding}px)`);
  if (EFFECTS.gradient.enabled) {
    console.log(`  • Gradient overlay (top ${EFFECTS.gradient.height}px)`);
  }
  console.log('');

  // Launch browser
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT
    },
    deviceScaleFactor: 2 // Higher quality for effects
  });

  const page = await context.newPage();

  const results = {
    successful: [],
    failed: []
  };

  // Capture main routes
  console.log('Capturing main routes...');
  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    const outputPath = path.join(OUTPUT_DIR, `${route.name}.png`);
    
    const success = await captureScreenshot(page, url, outputPath);
    if (success) {
      results.successful.push({ route: route.path, file: `${route.name}.png` });
    } else {
      results.failed.push({ route: route.path, file: `${route.name}.png` });
    }
  }

  // Capture token routes
  console.log('\nCapturing token routes...');
  for (const tokenId of tokenRoutes) {
    const url = `${BASE_URL}/tokens/${tokenId}`;
    const outputPath = path.join(OUTPUT_DIR, `tokens-${tokenId}.png`);
    
    const success = await captureScreenshot(page, url, outputPath);
    if (success) {
      results.successful.push({ route: `/tokens/${tokenId}`, file: `tokens-${tokenId}.png` });
    } else {
      results.failed.push({ route: `/tokens/${tokenId}`, file: `tokens-${tokenId}.png` });
    }
  }

  // Close browser
  await browser.close();

  // Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('ENHANCED SCREENSHOT GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\nSuccessfully captured: ${results.successful.length} screenshots`);
  console.log(`Failed: ${results.failed.length} screenshots\n`);

  if (results.successful.length > 0) {
    console.log('Successful screenshots:');
    results.successful.forEach(({ route, file }) => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  ✓ ${route} → ${file} (${sizeKB} KB)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\nFailed screenshots:');
    results.failed.forEach(({ route, file }) => {
      console.log(`  ✗ ${route} → ${file}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`All enhanced screenshots saved to: ${OUTPUT_DIR}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
