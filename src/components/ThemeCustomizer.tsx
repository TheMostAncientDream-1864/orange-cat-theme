import React from 'react';
import { ThemePalette } from '../types';
import { Sparkles, Palette, RefreshCw, Check, Eye } from 'lucide-react';

interface Props {
  palette: ThemePalette;
  onColorChange: (hex: string) => void;
  isCustomized: boolean;
  onApplyTheme: () => void;
  onRestore: () => void;
  showCat: boolean;
  onToggleCat: () => void;
  uiMode: 'dark' | 'light';
  onToggleUiMode: () => void;
}

const PRESET_COLORS = [
  { name: 'RStudio Orange', hex: '#dc6601', desc: 'Classic vibrant RStudio orange' },
  { name: 'Amber Glow', hex: '#f59e0b', desc: 'Warm golden amber tone' },
  { name: 'Sunset Coral', hex: '#f97316', desc: 'Bright energetic citrus coral' },
  { name: 'Crimson Flame', hex: '#e11d48', desc: 'High-contrast rich crimson' },
  { name: 'Cyber Cyan', hex: '#06b6d4', desc: 'Modern high-tech luminous cyan' },
  { name: 'Posit Cobalt', hex: '#2563eb', desc: 'Clean corporate deep blue' },
  { name: 'Emerald Forest', hex: '#10b981', desc: 'Vibrant clean botanical green' },
  { name: 'Royal Purple', hex: '#8b5cf6', desc: 'Sleek luxury purple' },
];

export const ThemeCustomizer: React.FC<Props> = ({
  palette,
  onColorChange,
  isCustomized,
  onApplyTheme,
  onRestore,
  showCat,
  onToggleCat,
  uiMode,
  onToggleUiMode,
}) => {
  return (
    <div id="theme-customizer-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg space-y-6 text-neutral-200">
      {/* Header & Quick Status */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-md transition-colors"
            style={{ backgroundColor: palette.mainColor }}
          >
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-neutral-100">RStudio Theme Engine</h3>
            <p className="text-xs text-neutral-400">Controls <code className="text-amber-400 font-mono text-[11px]">rs.ui(main_color = "...")</code></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleUiMode}
            className="px-2.5 py-1 text-xs rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            {uiMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>

      {/* Main Color Picker & Input */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
          <span>Primary Accent (<code className="font-mono text-amber-400">main_color</code>)</span>
          <span className="font-mono text-xs text-neutral-400 uppercase">{palette.mainColor}</span>
        </label>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={palette.mainColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-neutral-700 p-0.5"
            />
          </div>
          <input
            type="text"
            value={palette.mainColor}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#dc6601"
            className="flex-1 px-3 py-2 text-xs font-mono rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Preset Swatches */}
      <div className="space-y-2">
        <span className="text-xs text-neutral-400 font-medium">Curated Presets</span>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map((preset) => {
            const isSelected = palette.mainColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                onClick={() => onColorChange(preset.hex)}
                className={`p-2 rounded-lg border text-left transition-all relative flex flex-col justify-between h-14 ${
                  isSelected
                    ? 'border-amber-400 bg-neutral-800/80 shadow-md ring-1 ring-amber-400/50'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: preset.hex }}
                  />
                  {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                </div>
                <span className="text-[10px] font-medium text-neutral-300 truncate w-full mt-1">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Derivative Color Palette Preview */}
      <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Derived CSS Tokens</span>
          <span className="text-[10px] text-neutral-500">Auto-calculated</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-1 rounded bg-neutral-900 border border-neutral-800">
            <div className="h-3.5 rounded-sm mb-1" style={{ backgroundColor: palette.lightColor }}></div>
            <span className="text-[9px] text-neutral-400 font-mono">Light</span>
          </div>
          <div className="p-1 rounded bg-neutral-900 border border-neutral-800">
            <div className="h-3.5 rounded-sm mb-1" style={{ backgroundColor: palette.darkColor }}></div>
            <span className="text-[9px] text-neutral-400 font-mono">Dark</span>
          </div>
          <div className="p-1 rounded bg-neutral-900 border border-neutral-800">
            <div className="h-3.5 rounded-sm mb-1" style={{ backgroundColor: palette.borderColor }}></div>
            <span className="text-[9px] text-neutral-400 font-mono">Border</span>
          </div>
          <div className="p-1 rounded bg-neutral-900 border border-neutral-800">
            <div className="h-3.5 rounded-sm mb-1" style={{ backgroundColor: palette.hoverColor }}></div>
            <span className="text-[9px] text-neutral-400 font-mono">Hover</span>
          </div>
        </div>
      </div>

      {/* Mascot Option Toggle */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🐱</span>
          <div>
            <p className="text-xs font-semibold text-neutral-200">Orange Pixel Cat</p>
            <p className="text-[10px] text-neutral-400">Fixed top header badge</p>
          </div>
        </div>
        <button
          onClick={onToggleCat}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            showCat
              ? 'bg-amber-600 text-white'
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          {showCat ? 'Embedded (Active)' : 'Hidden'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={onApplyTheme}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white shadow-md flex items-center justify-center gap-1.5 transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ backgroundColor: palette.mainColor }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply rs.ui() Patch</span>
        </button>

        <button
          onClick={onRestore}
          disabled={!isCustomized}
          className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border ${
            isCustomized
              ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer'
              : 'border-neutral-800 bg-neutral-900 text-neutral-500 cursor-not-allowed'
          }`}
          title="Restore original un-modded RStudio UI files"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restore</span>
        </button>
      </div>
    </div>
  );
};
