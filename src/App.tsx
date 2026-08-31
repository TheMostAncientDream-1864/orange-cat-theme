import React, { useState } from 'react';
import { computeThemePalette } from './utils/colorUtils';
import { RStudioWindowSimulation } from './components/RStudioWindowSimulation';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { InteractiveConsole } from './components/InteractiveConsole';
import { FileExplorer } from './components/FileExplorer';
import { PixelCatInspector } from './components/PixelCatInspector';
import { DocumentationTab } from './components/DocumentationTab';
import {
  Monitor,
  FolderCode,
  Sparkles,
  BookOpen,
  Github,
  CheckCircle2,
  Layers,
  Palette,
} from 'lucide-react';

export default function App() {
  const [mainColor, setMainColor] = useState<string>('#dc6601');
  const [isCustomized, setIsCustomized] = useState<boolean>(true);
  const [showCat, setShowCat] = useState<boolean>(true);
  const [uiMode, setUiMode] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'simulation' | 'files' | 'cat' | 'docs'>('simulation');

  const palette = computeThemePalette(mainColor);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Application Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-lg border border-amber-500/30 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: `${palette.mainColor}20` }}
            >
              🐱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  rs.ui.windows
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium border border-amber-500/30">
                  v0.1.0 (Windows Port)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                RStudio Desktop Windows UI Customizer with Embedded Orange Pixel Cat
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                activeTab === 'simulation'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>IDE Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                activeTab === 'files'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <FolderCode className="w-3.5 h-3.5" />
              <span>Package Code</span>
            </button>

            <button
              onClick={() => setActiveTab('cat')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                activeTab === 'cat'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pixel Cat Mascot</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs & Architecture</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Tab 1: Interactive RStudio Simulation & Workbench */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {/* Top Row: RStudio Window Simulation */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    RStudio Desktop Windows - Live Interface Simulation
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Notice the Orange Pixel Cat in the top header menubar and dynamic color accents across tabs and toolbars.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SHA256 Backup Ready
                  </span>
                </div>
              </div>

              <RStudioWindowSimulation
                palette={palette}
                isCustomized={isCustomized}
                showCat={showCat}
                uiMode={uiMode}
              />
            </div>

            {/* Bottom Row: Theme Customizer (Left) + Interactive Console Simulator (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <ThemeCustomizer
                  palette={palette}
                  onColorChange={setMainColor}
                  isCustomized={isCustomized}
                  onApplyTheme={() => setIsCustomized(true)}
                  onRestore={() => setIsCustomized(false)}
                  showCat={showCat}
                  onToggleCat={() => setShowCat(!showCat)}
                  uiMode={uiMode}
                  onToggleUiMode={() => setUiMode(uiMode === 'dark' ? 'light' : 'dark')}
                />
              </div>

              <div className="lg:col-span-7">
                <InteractiveConsole
                  palette={palette}
                  isCustomized={isCustomized}
                  onApplyTheme={() => setIsCustomized(true)}
                  onRestore={() => setIsCustomized(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Package Code & Explorer */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <FolderCode className="w-4 h-4 text-amber-400" />
                R Package File Architecture (rs.ui.windows)
              </h2>
              <p className="text-xs text-neutral-400">
                Inspect every R script, DESCRIPTION manifest, CSS template, and test file in the package.
              </p>
            </div>

            <FileExplorer />
          </div>
        )}

        {/* Tab 3: Orange Pixel Cat Inspector */}
        {activeTab === 'cat' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Orange Pixel Cat Asset & Data URI Studio
              </h2>
              <p className="text-xs text-neutral-400">
                Detailed 24x18 pixel grid breakdown, color palettes, and Base64 CSS embedding mechanism.
              </p>
            </div>

            <PixelCatInspector />
          </div>
        )}

        {/* Tab 4: Architecture & Documentation */}
        {activeTab === 'docs' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Technical Analysis & Implementation Notes
              </h2>
              <p className="text-xs text-neutral-400">
                In-depth research on Windows RStudio Electron DOM, path discovery, and administrative privileges.
              </p>
            </div>

            <DocumentationTab />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>rs.ui.windows © 2026</span>
            <span>•</span>
            <span>Windows port & fork of concept from <code className="text-neutral-400">grcatlin/rs.ui</code></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-mono text-[11px]">Safe 5-Step Patch Pipeline</span>
            <span>•</span>
            <span className="text-amber-400 font-mono text-[11px]">Embedded Orange Pixel Cat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
