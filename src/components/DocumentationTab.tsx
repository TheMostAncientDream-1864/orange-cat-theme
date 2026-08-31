import React from 'react';
import { ShieldCheck, Terminal, AlertCircle, FileCode, CheckCircle2, RefreshCw } from 'lucide-react';

export const DocumentationTab: React.FC = () => {
  return (
    <div id="documentation-hub" className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl text-neutral-200 space-y-8">
      {/* 1. Research & Architectural Analysis */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          1. Research Analysis: RStudio Desktop Windows Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <h4 className="font-semibold text-amber-400">Modern Electron Architecture (2022.07 – 2026+)</h4>
            <p className="text-neutral-400 leading-relaxed">
              In modern RStudio Desktop for Windows, Posit migrated from QtWebEngine to Electron. Web assets are located at:
            </p>
            <code className="block p-2 rounded bg-neutral-900 text-cyan-300 font-mono text-[11px] break-all">
              C:\Program Files\RStudio\resources\app\resources\www\index.htm
            </code>
            <p className="text-neutral-400 text-[11px]">
              The HTML entry point loads Google Web Toolkit (GWT) modules and the Ace code editor DOM.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <h4 className="font-semibold text-blue-400">Why `.rstheme` is Insufficient</h4>
            <p className="text-neutral-400 leading-relaxed">
              Official RStudio <code className="font-mono text-neutral-200">.rstheme</code> files only target the scoped Ace editor container (`.ace_editor`).
            </p>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              They cannot style the outer application window, menubars, toolbar panels, or inject persistent visual widgets like the <strong>Orange Pixel Cat</strong> in the top header.
            </p>
          </div>
        </div>
      </div>

      {/* 2. 5-Step Verified Patch Workflow */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          2. Safe Patching Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {[
            { step: '1. Detect', desc: 'Auto-finds RStudio via Registry, Program Files, or env variables' },
            { step: '2. Validate', desc: 'Checks running processes and file write permissions' },
            { step: '3. Backup', desc: 'Creates SHA256/MD5 verified backup in %LOCALAPPDATA%' },
            { step: '4. Patch', desc: 'Compiles custom CSS & embeds Base64 SVG Cat into index.htm' },
            { step: '5. Verify', desc: 'Confirms file integrity and enables auto-rollback on failure' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-neutral-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{item.step}</span>
              </div>
              <p className="text-[11px] text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Administrator Privileges on Windows */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          3. Handling Windows Administrator Permissions
        </h3>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-3">
          <p className="text-neutral-300 leading-relaxed">
            Because RStudio default installation is located in <code className="font-mono text-amber-400">C:\Program Files\RStudio</code>, Windows restricts write access for standard user accounts.
          </p>

          <p className="text-neutral-400 font-medium">
            To apply customization seamlessly, open PowerShell as Administrator and run:
          </p>

          <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 font-mono text-[11.5px] text-emerald-300 flex items-center justify-between overflow-x-auto">
            <code>R.exe -e "rs.ui.windows::rs.ui(main_color='#dc6601')"</code>
          </div>

          <p className="text-[11px] text-neutral-500">
            Alternatively, right click your R / RStudio shortcut and choose <em>"Run as administrator"</em> before running <code className="font-mono text-neutral-400">rs.ui()</code>.
          </p>
        </div>
      </div>

      {/* 4. Comparison Table */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-neutral-100">
          4. Comparison: macOS `rs.ui` vs Windows `rs.ui.windows`
        </h3>

        <div className="overflow-x-auto border border-neutral-800 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-semibold">
              <tr>
                <th className="p-3">Capability</th>
                <th className="p-3">Original `grcatlin/rs.ui` (macOS)</th>
                <th className="p-3 text-amber-400">`rs.ui.windows` (Windows)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono text-[11.5px]">
              <tr className="hover:bg-white/5">
                <td className="p-3 font-sans font-medium text-neutral-200">OS Target</td>
                <td className="p-3 text-neutral-400">macOS only</td>
                <td className="p-3 text-emerald-400">Windows 10 & 11 (64-bit)</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-sans font-medium text-neutral-200">Orange Pixel Cat Mascot</td>
                <td className="p-3 text-neutral-500">None</td>
                <td className="p-3 text-emerald-400">🐱 Embedded in Top Header Bar</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-sans font-medium text-neutral-200">Asset Delivery</td>
                <td className="p-3 text-neutral-400">External file paths</td>
                <td className="p-3 text-emerald-400">Self-contained Base64 Data URI</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-sans font-medium text-neutral-200">Backup Verification</td>
                <td className="p-3 text-neutral-400">Basic file copy</td>
                <td className="p-3 text-emerald-400">SHA256 Checksum & Metadata</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="p-3 font-sans font-medium text-neutral-200">Process Guard</td>
                <td className="p-3 text-neutral-500">None</td>
                <td className="p-3 text-emerald-400">Detects active rstudio.exe process</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
