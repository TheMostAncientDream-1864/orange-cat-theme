import React, { useState } from 'react';
import { ThemePalette } from '../types';
import { CAT_RAW_SVG } from '../utils/colorUtils';
import {
  Play,
  Save,
  FolderOpen,
  Terminal,
  Grid,
  HelpCircle,
  FileCode,
  Package,
  Layers,
  Sparkles,
  Minus,
  Square,
  X,
  ChevronRight,
  Database,
  BarChart2,
} from 'lucide-react';

interface Props {
  palette: ThemePalette;
  isCustomized: boolean;
  showCat: boolean;
  catScale?: number;
  uiMode?: 'dark' | 'light';
  onRunPatch?: () => void;
  onRestore?: () => void;
}

export const RStudioWindowSimulation: React.FC<Props> = ({
  palette,
  isCustomized,
  showCat,
  uiMode = 'dark',
}) => {
  const [activeTabLeft, setActiveTabLeft] = useState<'script' | 'analysis'>('script');
  const [activeTabRightTop, setActiveTabRightTop] = useState<'env' | 'history'>('env');
  const [activeTabRightBottom, setActiveTabRightBottom] = useState<'plots' | 'files' | 'packages'>('plots');
  const [catHovered, setCatHovered] = useState(false);

  const isDark = uiMode === 'dark';
  const mainColor = isCustomized ? palette.mainColor : '#007acc';
  const bgTint = isCustomized ? palette.bgTint : 'rgba(0, 122, 204, 0.12)';

  return (
    <div
      id="rstudio-sim-window"
      className={`w-full rounded-xl overflow-hidden shadow-2xl border transition-all duration-300 flex flex-col ${
        isDark
          ? 'bg-[#1e1e1e] border-neutral-700/80 text-neutral-200'
          : 'bg-[#f8f9fa] border-neutral-300 text-neutral-800'
      }`}
      style={{ minHeight: '580px' }}
    >
      {/* 1. Windows OS Titlebar & Top Menubar */}
      <div
        id="rstudio-sim-titlebar"
        className={`px-3 py-1.5 flex items-center justify-between select-none text-xs border-b ${
          isDark ? 'bg-[#181818] border-neutral-800' : 'bg-[#e9ecef] border-neutral-300'
        }`}
      >
        {/* Left: App icon & menus */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold tracking-wide">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: isCustomized ? mainColor : '#2563eb' }}
            >
              R
            </span>
            <span className="font-mono text-xs">RStudio Desktop</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800/40 text-neutral-400">
              Windows (64-bit)
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-neutral-400 text-[11px] ml-2">
            {['File', 'Edit', 'Code', 'View', 'Plots', 'Session', 'Build', 'Debug', 'Tools', 'Help'].map(
              (menu, i) => (
                <span
                  key={menu}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    i === 0 ? 'text-neutral-200 hover:bg-white/10' : 'hover:bg-white/5 hover:text-neutral-300'
                  }`}
                >
                  {menu}
                </span>
              )
            )}
          </div>
        </div>

        {/* Right: Orange Pixel Cat Header Placement + Window Controls */}
        <div className="flex items-center gap-3">
          {/* THE ORANGE PIXEL CAT IN HEADER */}
          {showCat && isCustomized && (
            <div
              id="rstudio-cat-header-widget"
              onMouseEnter={() => setCatHovered(true)}
              onMouseLeave={() => setCatHovered(false)}
              className="relative group flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: catHovered ? bgTint : 'transparent',
                border: `1px solid ${catHovered ? mainColor : 'transparent'}`,
              }}
              title="rs.ui.windows - Embedded Orange Pixel Cat Mascot"
            >
              <div
                className="w-8 h-6 flex items-center justify-center transition-transform duration-150"
                style={{
                  transform: catHovered ? 'translateY(-2px)' : 'none',
                  imageRendering: 'pixelated',
                }}
                dangerouslySetInnerHTML={{ __html: CAT_RAW_SVG }}
              />
              <span
                className="text-[10px] font-mono font-medium hidden sm:inline-block px-1 rounded"
                style={{ color: mainColor }}
              >
                rs.ui
              </span>

              {/* Tooltip */}
              <div className="absolute right-0 top-8 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 bg-neutral-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Orange Pixel Cat UI Mascot
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Persistent fixed position in RStudio Electron DOM header
                </p>
              </div>
            </div>
          )}

          {/* Project name indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/50">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mainColor }}></span>
            <span>rs.ui.windows.Rproj</span>
          </div>

          {/* Windows Minimize / Maximize / Close Buttons */}
          <div className="flex items-center text-neutral-400">
            <button className="p-1 hover:bg-neutral-700/60 hover:text-white transition-colors" title="Minimize">
              <Minus className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-neutral-700/60 hover:text-white transition-colors" title="Maximize">
              <Square className="w-2.5 h-2.5" />
            </button>
            <button className="p-1 hover:bg-red-600 hover:text-white transition-colors" title="Close">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Toolbar */}
      <div
        id="rstudio-sim-toolbar"
        className={`px-3 py-1 flex items-center justify-between text-xs border-b select-none ${
          isDark ? 'bg-[#252526] border-neutral-800' : 'bg-[#f1f3f5] border-neutral-300'
        }`}
      >
        <div className="flex items-center gap-1 text-neutral-400">
          <button className="p-1 rounded hover:bg-white/10 hover:text-neutral-200 transition-colors" title="New File">
            <FileCode className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-neutral-200 transition-colors" title="Open File">
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-neutral-200 transition-colors" title="Save">
            <Save className="w-3.5 h-3.5" />
          </button>
          <div className="h-3.5 w-px bg-neutral-700 mx-1"></div>
          <button
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all"
            style={{
              backgroundColor: bgTint,
              color: mainColor,
              border: `1px solid ${palette.borderColor || '#3b82f6'}`,
            }}
            title="Run Code"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Source</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <span className="hidden sm:inline">R 4.4.2 (x86_64-w64-mingw32)</span>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider"
            style={{
              backgroundColor: isCustomized ? bgTint : 'rgba(100,100,100,0.2)',
              color: isCustomized ? mainColor : '#9ca3af',
              border: `1px solid ${isCustomized ? mainColor : 'transparent'}`,
            }}
          >
            {isCustomized ? 'Theme: Active' : 'Theme: Default'}
          </span>
        </div>
      </div>

      {/* 3. 4-Pane Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 divide-y md:divide-y-0 md:divide-x divide-neutral-700/60 font-mono text-xs overflow-hidden">
        {/* LEFT COLUMN: Source Editor (Top) & Console (Bottom) */}
        <div className="flex flex-col divide-y divide-neutral-700/60">
          {/* Top Left: Source Editor */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            {/* Editor Tab Strip */}
            <div
              className={`flex items-center px-2 pt-1 border-b gap-1 ${
                isDark ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-[#f8f9fa] border-neutral-300'
              }`}
            >
              <button
                onClick={() => setActiveTabLeft('script')}
                className={`px-3 py-1 text-[11px] rounded-t flex items-center gap-1.5 transition-colors border-t-2 ${
                  activeTabLeft === 'script'
                    ? isDark
                      ? 'bg-[#252526] text-neutral-100'
                      : 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                }`}
                style={{
                  borderTopColor: activeTabLeft === 'script' ? mainColor : 'transparent',
                  color: activeTabLeft === 'script' ? (isCustomized ? mainColor : undefined) : undefined,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mainColor }}></span>
                <span>apply_theme.R</span>
              </button>
              <button
                onClick={() => setActiveTabLeft('analysis')}
                className={`px-3 py-1 text-[11px] rounded-t flex items-center gap-1.5 transition-colors border-t-2 ${
                  activeTabLeft === 'analysis'
                    ? isDark
                      ? 'bg-[#252526] text-neutral-100'
                      : 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                }`}
                style={{
                  borderTopColor: activeTabLeft === 'analysis' ? mainColor : 'transparent',
                }}
              >
                <span>visualize.R</span>
              </button>
            </div>

            {/* Editor Content */}
            <div
              className={`p-3 flex-1 overflow-auto text-[11.5px] leading-relaxed ${
                isDark ? 'bg-[#1e1e1e] text-neutral-300' : 'bg-white text-neutral-800'
              }`}
            >
              {activeTabLeft === 'script' ? (
                <div className="space-y-1">
                  <p className="text-neutral-500"># 🐱 rs.ui.windows - RStudio Desktop UI Customizer</p>
                  <p className="text-neutral-500"># Windows port of grcatlin/rs.ui with Orange Pixel Cat</p>
                  <p className="pt-1">
                    <span className="text-purple-400">library</span>
                    <span className="text-neutral-400">(</span>
                    <span className="text-emerald-400">rs.ui.windows</span>
                    <span className="text-neutral-400">)</span>
                  </p>
                  <p className="pt-1 text-neutral-500"># 1. Check status & detection</p>
                  <p>
                    <span className="text-cyan-400">rs.ui.status</span>
                    <span className="text-neutral-400">()</span>
                  </p>
                  <p className="pt-1 text-neutral-500"># 2. Apply vibrant UI theme & mascot</p>
                  <p className="p-1 rounded" style={{ backgroundColor: bgTint }}>
                    <span className="text-cyan-400">rs.ui</span>
                    <span className="text-neutral-400">(</span>
                    <span className="text-amber-400">main_color</span>
                    <span className="text-neutral-400"> = </span>
                    <span className="text-emerald-300">"{palette.mainColor}"</span>
                    <span className="text-neutral-400">)</span>
                  </p>
                  <p className="pt-1 text-neutral-500"># 3. Restore to original if desired</p>
                  <p>
                    <span className="text-cyan-400">rs.ui.restore</span>
                    <span className="text-neutral-400">()</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-neutral-500"># Plotting with custom theme palette</p>
                  <p>
                    <span className="text-purple-400">library</span>
                    <span className="text-neutral-400">(</span>
                    <span className="text-emerald-400">ggplot2</span>
                    <span className="text-neutral-400">)</span>
                  </p>
                  <p className="pt-1">
                    <span className="text-cyan-400">ggplot</span>
                    <span className="text-neutral-400">(diamonds, </span>
                    <span className="text-cyan-400">aes</span>
                    <span className="text-neutral-400">(price, carat)) +</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cyan-400">geom_point</span>
                    <span className="text-neutral-400">(color = </span>
                    <span className="text-emerald-300">"{palette.mainColor}"</span>
                    <span className="text-neutral-400">, alpha = 0.5) +</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-cyan-400">theme_minimal</span>
                    <span className="text-neutral-400">()</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Left: Console */}
          <div className="flex-1 flex flex-col min-h-[200px]">
            {/* Console Tab */}
            <div
              className={`flex items-center px-2 pt-1 border-b gap-1 text-[11px] ${
                isDark ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-[#f8f9fa] border-neutral-300'
              }`}
            >
              <div
                className="px-2.5 py-1 rounded-t border-t-2 font-medium flex items-center gap-1"
                style={{
                  borderTopColor: mainColor,
                  color: isCustomized ? mainColor : undefined,
                }}
              >
                <Terminal className="w-3 h-3" />
                <span>Console</span>
              </div>
              <span className="px-2.5 py-1 text-neutral-400 hover:text-neutral-300 cursor-pointer">Terminal</span>
              <span className="px-2.5 py-1 text-neutral-400 hover:text-neutral-300 cursor-pointer">Background Jobs</span>
            </div>

            {/* Console Output */}
            <div
              className={`p-3 flex-1 overflow-auto text-[11px] font-mono leading-relaxed space-y-1.5 ${
                isDark ? 'bg-[#181818] text-neutral-300' : 'bg-[#fdfdfd] text-neutral-800'
              }`}
            >
              <p className="text-neutral-500">R version 4.4.2 (2024-10-31 ucrt) -- "Pile of Leaves"</p>
              <p className="text-neutral-500">Platform: x86_64-w64-mingw32/x64 (64-bit)</p>
              <p className="pt-1">
                <span className="text-neutral-400">&gt; </span>
                <span className="text-cyan-300">library</span>
                <span className="text-neutral-400">(</span>
                <span className="text-emerald-300">rs.ui.windows</span>
                <span className="text-neutral-400">)</span>
              </p>
              <p>
                <span className="text-neutral-400">&gt; </span>
                <span className="text-cyan-300">rs.ui</span>
                <span className="text-neutral-400">(</span>
                <span className="text-amber-300">main_color</span>
                <span className="text-neutral-400"> = </span>
                <span className="text-emerald-300">"{palette.mainColor}"</span>
                <span className="text-neutral-400">)</span>
              </p>
              <p className="text-blue-400">==&gt; Detected RStudio installation: C:/Program Files/RStudio</p>
              <p className="text-blue-400">==&gt; Architecture: electron | Version: 2026.01.0</p>
              <p className="text-emerald-400 font-semibold">==&gt; UI backup verified with SHA256 integrity check</p>
              <p className="text-amber-400 font-semibold">
                ==&gt; Patch applied: Orange Pixel Cat embedded in header bar! 🐱
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-neutral-400">&gt; </span>
                <span className="w-2 h-4 animate-pulse inline-block" style={{ backgroundColor: mainColor }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Environment/History (Top) & Plots/Files/Packages (Bottom) */}
        <div className="flex flex-col divide-y divide-neutral-700/60">
          {/* Top Right: Environment */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <div
              className={`flex items-center px-2 pt-1 border-b gap-1 text-[11px] ${
                isDark ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-[#f8f9fa] border-neutral-300'
              }`}
            >
              <button
                onClick={() => setActiveTabRightTop('env')}
                className={`px-2.5 py-1 rounded-t border-t-2 font-medium flex items-center gap-1 transition-colors ${
                  activeTabRightTop === 'env'
                    ? isDark
                      ? 'bg-[#252526] text-neutral-100'
                      : 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                }`}
                style={{
                  borderTopColor: activeTabRightTop === 'env' ? mainColor : 'transparent',
                  color: activeTabRightTop === 'env' ? (isCustomized ? mainColor : undefined) : undefined,
                }}
              >
                <Database className="w-3 h-3" />
                <span>Environment</span>
              </button>
              <button
                onClick={() => setActiveTabRightTop('history')}
                className={`px-2.5 py-1 rounded-t border-t-2 font-medium flex items-center gap-1 transition-colors ${
                  activeTabRightTop === 'history'
                    ? isDark
                      ? 'bg-[#252526] text-neutral-100'
                      : 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                }`}
                style={{
                  borderTopColor: activeTabRightTop === 'history' ? mainColor : 'transparent',
                }}
              >
                <span>History</span>
              </button>
            </div>

            <div
              className={`p-3 flex-1 overflow-auto text-[11px] ${
                isDark ? 'bg-[#1e1e1e] text-neutral-300' : 'bg-white text-neutral-800'
              }`}
            >
              <div className="border border-neutral-700/50 rounded overflow-hidden">
                <div className="bg-neutral-800/60 px-2 py-1 text-[10px] text-neutral-400 font-semibold flex justify-between">
                  <span>Name</span>
                  <span>Value</span>
                </div>
                <div className="divide-y divide-neutral-800/40 text-[10.5px]">
                  <div className="px-2 py-1 flex justify-between items-center hover:bg-white/5">
                    <span className="font-semibold" style={{ color: mainColor }}>
                      main_color
                    </span>
                    <span className="text-neutral-400">"{palette.mainColor}"</span>
                  </div>
                  <div className="px-2 py-1 flex justify-between items-center hover:bg-white/5">
                    <span className="font-semibold text-neutral-300">target_os</span>
                    <span className="text-neutral-400">"Windows 11 (64-bit)"</span>
                  </div>
                  <div className="px-2 py-1 flex justify-between items-center hover:bg-white/5">
                    <span className="font-semibold text-neutral-300">pixel_cat_status</span>
                    <span className="text-emerald-400 font-medium">"Embedded Top-Header"</span>
                  </div>
                  <div className="px-2 py-1 flex justify-between items-center hover:bg-white/5">
                    <span className="font-semibold text-neutral-300">backup_state</span>
                    <span className="text-neutral-400">"SHA256 Verified"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right: Plots / Files / Packages */}
          <div className="flex-1 flex flex-col min-h-[200px]">
            <div
              className={`flex items-center px-2 pt-1 border-b gap-1 text-[11px] ${
                isDark ? 'bg-[#1e1e1e] border-neutral-800' : 'bg-[#f8f9fa] border-neutral-300'
              }`}
            >
              {(['plots', 'files', 'packages'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabRightBottom(tab)}
                  className={`px-2.5 py-1 rounded-t border-t-2 font-medium capitalize flex items-center gap-1 transition-colors ${
                    activeTabRightBottom === tab
                      ? isDark
                        ? 'bg-[#252526] text-neutral-100'
                        : 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                  }`}
                  style={{
                    borderTopColor: activeTabRightBottom === tab ? mainColor : 'transparent',
                    color: activeTabRightBottom === tab ? (isCustomized ? mainColor : undefined) : undefined,
                  }}
                >
                  {tab === 'plots' && <BarChart2 className="w-3 h-3" />}
                  {tab === 'files' && <FolderOpen className="w-3 h-3" />}
                  {tab === 'packages' && <Package className="w-3 h-3" />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>

            <div
              className={`p-3 flex-1 flex flex-col items-center justify-center overflow-auto ${
                isDark ? 'bg-[#181818]' : 'bg-[#f8f9fa]'
              }`}
            >
              {activeTabRightBottom === 'plots' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <div className="w-full max-w-[260px] bg-neutral-900/60 p-3 rounded-lg border border-neutral-800 text-center">
                    <p className="text-[11px] font-semibold text-neutral-300 mb-2">
                      RStudio UI Theme Palette Distribution
                    </p>
                    <div className="h-16 flex items-end justify-center gap-2 px-2 pb-1 border-b border-neutral-700/60">
                      <div
                        className="w-8 rounded-t transition-all duration-300"
                        style={{ height: '70%', backgroundColor: palette.darkColor }}
                        title="Dark Accent"
                      ></div>
                      <div
                        className="w-8 rounded-t transition-all duration-300 shadow-md"
                        style={{ height: '100%', backgroundColor: palette.mainColor }}
                        title="Main Color"
                      ></div>
                      <div
                        className="w-8 rounded-t transition-all duration-300"
                        style={{ height: '85%', backgroundColor: palette.lightColor }}
                        title="Light Accent"
                      ></div>
                      <div
                        className="w-8 rounded-t transition-all duration-300"
                        style={{ height: '40%', backgroundColor: palette.borderColor }}
                        title="Border Tint"
                      ></div>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-2">Active accent: {palette.mainColor}</p>
                  </div>
                </div>
              )}

              {activeTabRightBottom === 'files' && (
                <div className="w-full text-[11px] text-neutral-300 space-y-1">
                  <div className="flex items-center gap-2 py-0.5 hover:bg-white/5 px-2 rounded">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>R/ (R source functions)</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5 hover:bg-white/5 px-2 rounded">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>inst/assets/ (cat.svg pixel mascot)</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5 hover:bg-white/5 px-2 rounded">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>DESCRIPTION</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5 hover:bg-white/5 px-2 rounded">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>NAMESPACE</span>
                  </div>
                </div>
              )}

              {activeTabRightBottom === 'packages' && (
                <div className="w-full text-[11px] text-neutral-300 space-y-1.5">
                  <div
                    className="flex items-center justify-between p-1.5 rounded border"
                    style={{ backgroundColor: bgTint, borderColor: palette.borderColor }}
                  >
                    <div>
                      <p className="font-semibold" style={{ color: mainColor }}>
                        rs.ui.windows 0.1.0
                      </p>
                      <p className="text-[10px] text-neutral-400">RStudio Windows UI Customizer</p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                      Loaded
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
