import React, { useState } from 'react';
import { CAT_RAW_SVG, getCatSvgDataUri } from '../utils/colorUtils';
import { Sparkles, Copy, Check, Download, Layers, ZoomIn } from 'lucide-react';

export const PixelCatInspector: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(8);
  const [copiedDataUri, setCopiedDataUri] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const dataUri = getCatSvgDataUri();

  const handleCopyUri = () => {
    navigator.clipboard.writeText(dataUri);
    setCopiedDataUri(true);
    setTimeout(() => setCopiedDataUri(false), 2000);
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(CAT_RAW_SVG);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([CAT_RAW_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cat.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="pixel-cat-inspector-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl text-neutral-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
            🐱
          </div>
          <div>
            <h3 className="font-semibold text-base text-neutral-100 flex items-center gap-2">
              Orange Pixel Cat UI Mascot
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                24x18 Grid
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Bundled inside <code className="font-mono text-amber-400">inst/assets/cat.svg</code> and injected via self-contained Base64 Data URI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyUri}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition-colors"
          >
            {copiedDataUri ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Data URI Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Data URI</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSvg}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      {/* Grid Inspector & Palette breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pixel Art Canvas Zoom */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-neutral-950 rounded-xl border border-neutral-800">
          <div className="flex items-center justify-between w-full mb-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono">
              <ZoomIn className="w-3.5 h-3.5" />
              Scale: {zoomLevel}x
            </span>
            <div className="flex items-center gap-1.5">
              {[4, 8, 12].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setZoomLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    zoomLevel === lvl ? 'bg-amber-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {lvl}x
                </button>
              ))}
            </div>
          </div>

          {/* Rendered SVG with crisp pixel grid */}
          <div
            className="p-6 rounded-lg bg-[#121212] border border-neutral-800 flex items-center justify-center shadow-2xl relative overflow-hidden group"
            style={{
              backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          >
            <div
              style={{
                width: `${24 * zoomLevel}px`,
                height: `${18 * zoomLevel}px`,
                imageRendering: 'pixelated',
              }}
              className="transition-transform duration-200 group-hover:scale-105"
              dangerouslySetInnerHTML={{ __html: CAT_RAW_SVG }}
            />
          </div>

          <p className="text-[11px] text-neutral-500 mt-4 text-center">
            Zero blurriness. Rendered via <code className="font-mono text-neutral-400">shape-rendering="crispEdges"</code> and CSS <code className="font-mono text-neutral-400">image-rendering: pixelated</code>.
          </p>
        </div>

        {/* Right: Technical Details & Color Anatomy */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Color Anatomy & Layers
          </h4>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#dc6601' }} />
              <div>
                <p className="font-semibold text-neutral-200">#dc6601</p>
                <p className="text-[10px] text-neutral-400">Primary Orange Fur</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#ff8e32' }} />
              <div>
                <p className="font-semibold text-neutral-200">#ff8e32</p>
                <p className="text-[10px] text-neutral-400">Head Highlight</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#b84f00' }} />
              <div>
                <p className="font-semibold text-neutral-200">#b84f00</p>
                <p className="text-[10px] text-neutral-400">Tabby Forehead Stripes</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#fff5eb' }} />
              <div>
                <p className="font-semibold text-neutral-200">#fff5eb</p>
                <p className="text-[10px] text-neutral-400">White Muzzle & Chest</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#ff7597' }} />
              <div>
                <p className="font-semibold text-neutral-200">#ff7597</p>
                <p className="text-[10px] text-neutral-400">Pink Nose & Inner Ears</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: '#1e130a' }} />
              <div>
                <p className="font-semibold text-neutral-200">#1e130a</p>
                <p className="text-[10px] text-neutral-400">Crisp Pixel Outlines</p>
              </div>
            </div>
          </div>

          {/* RStudio Electron Injection Logic */}
          <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-2">
            <p className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              How it is positioned in RStudio Desktop Windows:
            </p>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Injected into <code className="text-neutral-200 font-mono">#rstudio_shell::before</code> with <code className="text-neutral-200 font-mono">position: fixed; top: 4px; right: 86px; z-index: 999999</code>.
              This guarantees the cat stays visible in the top header menubar on Windows without obstructing tabs, dropdown menus, or window close buttons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
