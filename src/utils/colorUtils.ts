import { ThemePalette } from '../types';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace(/^#/, '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    return { r: 220, g: 102, b: 1 }; // Default orange fallback
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lightenHex(hex: string, factor = 0.25): string {
  const { r, g, b } = hexToRgb(hex);
  const newR = r + (255 - r) * factor;
  const newG = g + (255 - g) * factor;
  const newB = b + (255 - b) * factor;
  return rgbToHex(newR, newG, newB);
}

export function darkenHex(hex: string, factor = 0.25): string {
  const { r, g, b } = hexToRgb(hex);
  const newR = r * (1 - factor);
  const newG = g * (1 - factor);
  const newB = b * (1 - factor);
  return rgbToHex(newR, newG, newB);
}

export function hexToRgbaStr(hex: string, alpha = 0.15): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function computeThemePalette(mainColor: string): ThemePalette {
  return {
    mainColor,
    lightColor: lightenHex(mainColor, 0.35),
    darkColor: darkenHex(mainColor, 0.25),
    hoverColor: lightenHex(mainColor, 0.15),
    activeColor: darkenHex(mainColor, 0.35),
    borderColor: lightenHex(mainColor, 0.50),
    bgTint: hexToRgbaStr(mainColor, 0.12),
  };
}

export const CAT_RAW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" width="48" height="36" shape-rendering="crispEdges">
  <defs>
    <style>
      .o { fill: #1e130a; }
      .f { fill: #dc6601; }
      .l { fill: #ff8e32; }
      .s { fill: #b84f00; }
      .w { fill: #fff5eb; }
      .p { fill: #ff7597; }
      .e { fill: #0f0a06; }
      .h { fill: #ffffff; }
    </style>
  </defs>
  <!-- Ear tips -->
  <rect x="3" y="1" width="3" height="1" class="o"/>
  <rect x="18" y="1" width="3" height="1" class="o"/>
  <!-- Row 1 -->
  <rect x="2" y="2" width="1" height="3" class="o"/>
  <rect x="3" y="2" width="3" height="1" class="f"/>
  <rect x="6" y="2" width="1" height="1" class="o"/>
  <rect x="17" y="2" width="1" height="1" class="o"/>
  <rect x="18" y="2" width="3" height="1" class="f"/>
  <rect x="21" y="2" width="1" height="3" class="o"/>
  <!-- Row 2: Inner Ears & Top Head -->
  <rect x="3" y="3" width="1" height="2" class="f"/>
  <rect x="4" y="3" width="2" height="2" class="p"/>
  <rect x="6" y="3" width="1" height="1" class="o"/>
  <rect x="7" y="3" width="10" height="1" class="o"/>
  <rect x="17" y="3" width="1" height="1" class="o"/>
  <rect x="18" y="3" width="2" height="2" class="p"/>
  <rect x="20" y="3" width="1" height="2" class="f"/>
  <!-- Row 3: Head top fur -->
  <rect x="7" y="4" width="10" height="1" class="l"/>
  <!-- Row 4: Forehead -->
  <rect x="1" y="5" width="1" height="7" class="o"/>
  <rect x="2" y="5" width="20" height="2" class="f"/>
  <rect x="22" y="5" width="1" height="7" class="o"/>
  <!-- Forehead Tabby Stripes -->
  <rect x="11" y="4" width="2" height="3" class="s"/>
  <rect x="7" y="5" width="2" height="2" class="s"/>
  <rect x="15" y="5" width="2" height="2" class="s"/>
  <!-- Row 6: Eyes & Cheeks -->
  <rect x="2" y="7" width="3" height="3" class="f"/>
  <rect x="5" y="7" width="4" height="3" class="e"/>
  <rect x="5" y="7" width="2" height="2" class="h"/>
  <rect x="9" y="7" width="6" height="2" class="f"/>
  <rect x="11" y="7" width="2" height="1" class="s"/>
  <rect x="15" y="7" width="4" height="3" class="e"/>
  <rect x="15" y="7" width="2" height="2" class="h"/>
  <rect x="19" y="7" width="3" height="3" class="f"/>
  <!-- Row 8: Nose & Muzzle -->
  <rect x="2" y="9" width="5" height="3" class="f"/>
  <rect x="17" y="9" width="5" height="3" class="f"/>
  <rect x="11" y="9" width="2" height="1" class="p"/>
  <rect x="7" y="10" width="10" height="2" class="w"/>
  <rect x="8" y="10" width="1" height="1" class="o"/>
  <rect x="15" y="10" width="1" height="1" class="o"/>
  <rect x="11" y="11" width="2" height="1" class="o"/>
  <!-- Whiskers -->
  <rect x="0" y="8" width="2" height="1" class="o"/>
  <rect x="0" y="10" width="2" height="1" class="o"/>
  <rect x="22" y="8" width="2" height="1" class="o"/>
  <rect x="22" y="10" width="2" height="1" class="o"/>
  <!-- Chin -->
  <rect x="2" y="12" width="2" height="1" class="o"/>
  <rect x="4" y="12" width="16" height="1" class="w"/>
  <rect x="20" y="12" width="2" height="1" class="o"/>
  <!-- Paws -->
  <rect x="3" y="13" width="2" height="3" class="o"/>
  <rect x="5" y="13" width="4" height="2" class="w"/>
  <rect x="9" y="13" width="6" height="2" class="f"/>
  <rect x="15" y="13" width="4" height="2" class="w"/>
  <rect x="19" y="13" width="2" height="3" class="o"/>
  <rect x="6" y="14" width="1" height="1" class="o"/>
  <rect x="8" y="14" width="1" height="1" class="o"/>
  <rect x="15" y="14" width="1" height="1" class="o"/>
  <rect x="17" y="14" width="1" height="1" class="o"/>
  <rect x="4" y="15" width="16" height="1" class="o"/>
</svg>`;

export function getCatSvgDataUri(): string {
  const base64 = btoa(unescape(encodeURIComponent(CAT_RAW_SVG)));
  return `data:image/svg+xml;base64,${base64}`;
}

export function generateCompiledCss(palette: ThemePalette): string {
  const catDataUri = getCatSvgDataUri();
  return `/* ==========================================================================
   rs.ui.windows - Compiled RStudio UI Theme
   Color: ${palette.mainColor}
   ========================================================================== */

:root {
  --rs-ui-main: ${palette.mainColor};
  --rs-ui-light: ${palette.lightColor};
  --rs-ui-dark: ${palette.darkColor};
  --rs-ui-bg-tint: ${palette.bgTint};
  --rs-ui-border: ${palette.borderColor};
  --rs-ui-hover: ${palette.hoverColor};
  --rs-ui-active: ${palette.activeColor};
  --rs-ui-cat-data-uri: url("${catDataUri}");
}

/* 1. ORANGE PIXEL CAT PLACEMENT IN TOP HEADER */
body::before,
#rstudio_shell::before,
#rstudio_container::before,
.rstudio-themes-flat::before {
  content: "" !important;
  position: fixed !important;
  top: 4px !important;
  right: 86px !important;
  width: 36px !important;
  height: 27px !important;
  background-image: var(--rs-ui-cat-data-uri) !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  image-rendering: pixelated !important;
  image-rendering: -moz-crisp-edges !important;
  image-rendering: crisp-edges !important;
  z-index: 999999 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25)) !important;
  transition: transform 0.15s ease-in-out !important;
}

body::before:hover,
#rstudio_shell::before:hover,
#rstudio_container::before:hover {
  transform: translateY(-2px) scale(1.1) !important;
}

/* 2. RSTUDIO WORKBENCH TABS & ACCENTS */
.rstudio-themes-flat .gwt-TabLayoutPanelTab-selected,
.rstudio-themes-default .gwt-TabLayoutPanelTab-selected {
  border-top: 3px solid var(--rs-ui-main) !important;
  color: var(--rs-ui-main) !important;
  font-weight: 600 !important;
}

.rstudio-themes-flat .gwt-TabLayoutPanelTab:hover {
  border-top: 2px solid var(--rs-ui-hover) !important;
  color: var(--rs-ui-dark) !important;
}

.rstudio-themes-flat .gwt-TabLayoutPanelTabs {
  border-bottom: 1px solid var(--rs-ui-border) !important;
}

/* 3. TOOLBAR & MENUBAR ACCENTS */
.rstudio-themes-flat .rstudio-toolbar button.active,
.rstudio-themes-flat .rstudio-toolbar .gwt-PushButton-up-hovering {
  border-color: var(--rs-ui-main) !important;
  background-color: var(--rs-ui-bg-tint) !important;
}

.rstudio-themes-flat .gwt-MenuBar .gwt-MenuItem-selected {
  background-color: var(--rs-ui-main) !important;
  color: #ffffff !important;
}

/* 4. SPLITTERS & FOCUS STATES */
.rstudio-themes-flat .gwt-SplitLayoutPanel-HDragger:hover,
.rstudio-themes-flat .gwt-SplitLayoutPanel-VDragger:hover {
  background-color: var(--rs-ui-main) !important;
}

.rstudio-themes-flat input:focus,
.rstudio-themes-flat select:focus {
  border-color: var(--rs-ui-main) !important;
  box-shadow: 0 0 0 2px var(--rs-ui-bg-tint) !important;
}`;
}
