import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://otf.aragon.org';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'og-images');
const VIEWPORT_WIDTH = 1200;
const VIEWPORT_HEIGHT = 630;

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

    // Wait a bit for any animations to complete
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: false,
      type: 'png'
    });

    console.log(`✓ Saved: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to capture ${url}:`, error.message);
    return false;
  }
}

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Starting OpenGraph screenshot generation...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}\n`);

  // Launch browser
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT
    },
    deviceScaleFactor: 1
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

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SCREENSHOT GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\nSuccessfully captured: ${results.successful.length} screenshots`);
  console.log(`Failed: ${results.failed.length} screenshots\n`);

  if (results.successful.length > 0) {
    console.log('Successful screenshots:');
    results.successful.forEach(({ route, file }) => {
      console.log(`  ✓ ${route} → ${file}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\nFailed screenshots:');
    results.failed.forEach(({ route, file }) => {
      console.log(`  ✗ ${route} → ${file}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`All screenshots saved to: ${OUTPUT_DIR}`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
