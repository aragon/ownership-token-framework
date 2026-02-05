---
agent: agent
---
I want to create OpenGraph image screenshots for my website. Please help me with the following steps:

## Setup (if not already done)
- Install Playwright: `pnpm add -D playwright`
- Install Playwright browsers: `pnpm exec playwright install chromium`
- Install Sharp for image processing: `pnpm add -D sharp`
- Create `og-images` directory in the `public` folder

## Screenshot Generation
- Check `src/routes` for all the routes in the website
- To see which tokens are supported, check `src/data/tokens.json`
- For each route, generate a screenshot to be used as the OpenGraph image
- Take screenshots from the following URLs:
  - `https://otf.aragon.org/route-name` (replace `route-name` with the actual route name)
  - For token routes: `https://otf.aragon.org/tokens/{token-id}`
- Save the screenshots in the `public/og-images` folder with the filename format:
  - Main routes: `route-name.png` (e.g., `index.png`, `faq.png`)
  - Token routes: `tokens-{token-id}.png` (e.g., `tokens-aave.png`)
- Base viewport resolution: 1200x630 pixels (OpenGraph standard)
- Final resolution with effects: 1280x710 pixels (includes 40px padding on all sides)
- Use device scale factor of 2 for high-quality rendering

## Visual Effects (Enhanced Version)
Apply the following effects using Sharp image processing library:

1. **Rounded Corners** (16px)
   - Use SVG mask for clean rounded corners
   - Matches the design system's `rounded-xl` style

2. **Drop Shadow**
   - Blur: 40px for soft, diffused shadow
   - Vertical offset: 20px for depth
   - Opacity: 15% (`rgba(0, 0, 0, 0.15)`)
   - Horizontal offset: 0px (centered)

3. **Padding** (40px on all sides)
   - Creates breathing room around the screenshot
   - Provides space for shadow effect
   - Background color: `#ffffff` (white)

4. **Gradient Overlay** (optional, enabled by default)
   - Primary brand color: `rgb(72, 61, 179)` with 3% opacity
   - Applied to top 100px as linear gradient
   - Fades to transparent
   - Applied with rounded corner mask

5. **High-Quality Output**
   - PNG format with quality 95
   - Compression level 9 for optimal web delivery
   - Expected file sizes: 26-54 KB

## Scripts to Create

Create two scripts in `scripts/` directory:

1. **`generate-og-screenshots.mjs`** - Basic version without effects
   - Pure screenshots at 1200x630
   - No image processing required
   - Faster generation

2. **`generate-og-screenshots-enhanced.mjs`** - Enhanced version with effects
   - Includes all visual effects listed above
   - Uses Sharp for image compositing
   - Saves to temp directory first, then applies effects
   - Cleans up temp files after processing

## OpenGraph Metadata Updates

Ensure all routes have proper OpenGraph metadata:

1. **Index route** (`src/routes/index.tsx`):
   - Add `head` function with `generateOpenGraphMetadata()`
   - Include title, description, and twitterCard settings

2. **FAQ route** (`src/routes/faq.tsx`):
   - Already configured, verify metadata is correct

3. **Token routes** (`src/routes/tokens/$tokenId.tsx`):
   - Already configured with dynamic metadata
   - Verify token-specific titles and descriptions

## Output

Provide a summary including:
- List of all routes processed
- Screenshot filenames and file sizes
- Success/failure count
- Location of saved screenshots
- Any errors encountered

## Future Use

Add npm scripts to package.json for easy regeneration:
```json
"og:generate": "node scripts/generate-og-screenshots.mjs",
"og:generate-enhanced": "node scripts/generate-og-screenshots-enhanced.mjs"
```

## Customization

Document effect settings in `public/og-images/README.md` for future reference and customization.

If not further specified, generate screenshots only for routes which are missing in the `public/og-images` folder.