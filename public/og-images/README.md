# OpenGraph Screenshot Effects Configuration

This document explains the visual effects applied to OpenGraph screenshots and how to customize them.

## Applied Effects

### 1. **Rounded Corners** (16px)
- Gives the screenshot a modern, polished look
- Matches your design system's `rounded-xl` style
- Softens the edges for a premium feel

### 2. **Drop Shadow**
- **Blur**: 40px for a soft, diffused shadow
- **Offset**: 20px vertical offset for depth
- **Opacity**: 15% for subtle elevation
- Creates a floating card effect

### 3. **Padding** (40px)
- White space around the screenshot
- Makes the content breathe
- Provides room for the shadow effect
- Final image size: 1280x710px (vs original 1200x630px)

### 4. **Gradient Overlay**
- Subtle primary color gradient (your purple: `rgb(72, 61, 179)`)
- 3% opacity for barely-there brand accent
- Applied to top 100px
- Adds visual hierarchy without being intrusive

### 5. **High-Quality Rendering**
- 2x device scale factor for crisp rendering
- PNG compression level 9 for optimal web delivery
- 95% quality setting for balance between size and clarity

## File Size Comparison

**Original Screenshots:** 41-85 KB
**Enhanced Screenshots:** 26-54 KB (better compression!)

The enhanced versions are actually smaller due to optimized PNG compression while maintaining visual quality.

## Customization

To modify the effects, edit `scripts/generate-og-screenshots-enhanced.mjs`:

\`\`\`javascript
const EFFECTS = {
  // Padding around screenshot
  padding: 40,  // Increase for more white space
  
  // Corner radius
  borderRadius: 16,  // Increase for rounder corners
  
  // Shadow settings
  shadow: {
    blur: 40,  // Higher = softer shadow
    offsetX: 0,  // Horizontal offset
    offsetY: 20,  // Vertical offset (downward)
    color: 'rgba(0, 0, 0, 0.15)',  // Shadow color/opacity
  },
  
  // Background color
  backgroundColor: '#ffffff',  // Use '#f5f5f5' for gray background
  
  // Gradient overlay
  gradient: {
    enabled: true,  // Set to false to disable
    color: 'rgba(72, 61, 179, 0.03)',  // Your brand color
    height: 100,  // Height from top in pixels
  },
};
\`\`\`

## Alternative Effect Ideas

### Minimal (Clean & Simple)
- Remove gradient overlay
- Reduce shadow blur to 20px
- Reduce padding to 24px

### Bold (High Contrast)
- Increase shadow opacity to 25%
- Add darker gradient (6% opacity)
- Use colored background instead of white

### Flat (No Depth)
- Remove shadow completely
- Keep rounded corners
- Minimal padding (20px)

### Browser Chrome Effect
Could add a browser window frame by creating an SVG overlay with:
- Window controls (red, yellow, green dots)
- Address bar simulation
- Tab-like header

## Running the Script

\`\`\`bash
# Generate enhanced OG images
pnpm generate-og-screenshots-enhanced

# Or use the original (no effects)
pnpm generate-og-screenshots
\`\`\`

## Best Practices

1. **Keep shadows subtle** - Too dark looks dated
2. **Maintain readability** - Effects shouldn't obscure content
3. **Test on social platforms** - Preview on Twitter, LinkedIn, etc.
4. **Consider dark mode** - Ensure shadows work on dark backgrounds
5. **Optimize file size** - Keep under 100KB for fast loading

## Social Media Preview

These screenshots are optimized for:
- **Twitter/X**: 1200x630px (2:1 ratio)
- **Facebook**: 1200x630px
- **LinkedIn**: 1200x627px (close enough)
- **Discord**: Shows well at various sizes

The padding ensures important content isn't cut off on different platforms.
