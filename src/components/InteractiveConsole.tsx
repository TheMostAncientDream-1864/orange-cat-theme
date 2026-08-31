import React, { useState } from 'react';
import { ThemePalette, SimulationLog } from '../types';
import { Terminal, Play, Trash2, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface Props {
  palette: ThemePalette;
  isCustomized: boolean;
  onApplyTheme: () => void;
  onRestore: () => void;
}

export const InteractiveConsole: React.FC<Props> = ({
  palette,
  isCustomized,
  onApplyTheme,
  onRestore,
}) => {
  const [logs, setLogs] = useState<SimulationLog[]>([
    {
      id: '1',
      timestamp: '00:00:01',
      type: 'info',
      text: '> library(rs.ui.windows)',
    },
    {
      id: '2',
      timestamp: '00:00:02',
      type: 'info',
      text: 'Loading required package: rs.ui.windows (v0.1.1)',
    },
    {
      id: '3',
      timestamp: '00:00:03',
      type: 'info',
      text: 'Type rs.ui() to customize RStudio Desktop Windows or rs.ui.status() for diagnostics.',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const addLog = (type: SimulationLog['type'], text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { id: Math.random().toString(), timestamp: time, type, text }]);
  };

  const handleRunCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    addLog('info', `> ${cleanCmd}`);

    if (cleanCmd.includes('detect')) {
      addLog('info', 'Searching for RStudio Desktop installations in Windows Registry, Program Files & LocalAppData...');
      setTimeout(() => {
        addLog('step', '$detected: TRUE');
        addLog('step', '$rstudio_dir: "C:/Program Files/RStudio"');
        addLog('step', '$index_htm: "C:/Program Files/RStudio/resources/app/www/index.htm"');
        addLog('step', '$www_dir: "C:/Program Files/RStudio/resources/app/www"');
        addLog('step', '$architecture: "electron"');
        addLog('step', '$version: "2026.01.0"');
        addLog('success', '$status_message: "RStudio detected and resources are verified."');
      }, 250);
    } else if (cleanCmd.includes('dry_run = TRUE') || cleanCmd.includes('dry_run=T')) {
      addLog('warning', '--- DRY-RUN VERIFICATION MODE (No files modified) ---');
      setTimeout(() => {
        addLog('step', '✓ RStudio Desktop Windows installation located at: C:/Program Files/RStudio');
        addLog('step', '✓ Architecture verified: Electron layout (resources/app/www/index.htm)');
        addLog('step', `✓ Target theme palette generated with main_color: ${palette.mainColor}`);
        addLog('step', '✓ Orange Pixel Cat embedded as Base64 Data URI (zero external network reliance)');
        addLog('step', '✓ Backup target prepared at: %LOCALAPPDATA%\\rs.ui.windows\\backups\\');
        addLog('success', 'Dry run verification passed! Call rs.ui() without dry_run to apply.');
      }, 300);
    } else if (cleanCmd.includes('status')) {
      setTimeout(() => {
        addLog('info', '============================================================');
        addLog('info', '         rs.ui.windows - RStudio Desktop Status');
        addLog('info', '============================================================');
        addLog('step', 'OS Platform            : windows (Windows 11 64-bit)');
        addLog('step', 'RStudio detected       : TRUE');
        addLog('step', 'RStudio version        : 2026.01.0 (Electron)');
        addLog('step', 'RStudio running        : NO');
        addLog('step', 'Installation path      : C:/Program Files/RStudio');
        addLog('step', 'Write permissions      : OK (Writable)');
        addLog(
          isCustomized ? 'success' : 'info',
          `Customization state    : ${isCustomized ? 'ACTIVE (Patched with Orange Cat)' : 'DEFAULT (Un-modded)'}`
        );
        addLog('step', 'Backup available       : YES (RStudio-version-2026_01_0)');
        addLog('info', '============================================================');
      }, 200);
    } else if (cleanCmd.includes('restore')) {
      addLog('info', 'Initiating restore workflow...');
      setTimeout(() => {
        addLog('step', '1. Finding verified backup in %LOCALAPPDATA%\\rs.ui.windows\\backups\\...');
        addLog('step', '2. Verifying SHA256 integrity hash against original metadata: MATCHED ✓');
        addLog('step', '3. Restoring original index.htm to resources/app/resources/www/...');
        addLog('step', '4. Removing generated rs.ui.css injection...');
        onRestore();
        addLog('success', '==> Original RStudio UI successfully restored! Restart RStudio.');
      }, 400);
    } else if (cleanCmd.startsWith('rs.ui')) {
      addLog('info', 'Executing safe patch workflow (detect -> validate -> backup -> patch -> verify)...');
      setTimeout(() => {
        addLog('step', '1. Detected RStudio Electron installation in C:/Program Files/RStudio');
        addLog('step', '2. Creating verified backup with SHA256 checksum...');
        addLog('step', `3. Generating CSS theme tokens with primary color: ${palette.mainColor}`);
        addLog('step', '4. Embedding Orange Pixel Cat in header menubar (#rstudio_shell::before)');
        addLog('step', '5. Injecting stylesheet link into index.htm and verifying integrity...');
        onApplyTheme();
        addLog('success', '==> Patch applied and verified successfully! Orange Pixel Cat is active. 🐱');
      }, 500);
    } else {
      addLog('warning', `Command not recognized: '${cleanCmd}'. Try: rs.ui(), rs.ui.status(), rs.ui.detect(), or rs.ui.restore()`);
    }

    setInputVal('');
  };

  return (
    <div id="interactive-terminal-panel" className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full text-neutral-200">
      {/* Top Console Bar */}
      <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-neutral-200">
            R Interactive Session Simulator
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs([])}
            className="p-1 text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="px-3 py-2 bg-neutral-900/50 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider mr-1">Quick Run:</span>
        <button
          onClick={() => handleRunCommand(`rs.ui(main_color = "${palette.mainColor}")`)}
          className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 font-mono transition-colors whitespace-nowrap"
        >
          rs.ui(main_color = "{palette.mainColor}")
        </button>
        <button
          onClick={() => handleRunCommand('rs.ui.status()')}
          className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-mono transition-colors whitespace-nowrap"
        >
          rs.ui.status()
        </button>
        <button
          onClick={() => handleRunCommand('rs.ui.detect()')}
          className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-mono transition-colors whitespace-nowrap"
        >
          rs.ui.detect()
        </button>
        <button
          onClick={() => handleRunCommand(`rs.ui(main_color = "${palette.mainColor}", dry_run = TRUE)`)}
          className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20 font-mono transition-colors whitespace-nowrap"
        >
          rs.ui(dry_run = TRUE)
        </button>
        <button
          onClick={() => handleRunCommand('rs.ui.restore()')}
          className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 font-mono transition-colors whitespace-nowrap"
        >
          rs.ui.restore()
        </button>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 flex-1 overflow-y-auto font-mono text-xs space-y-1.5 min-h-[220px]">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            {log.type === 'step' && <span className="text-cyan-400 select-none">│</span>}
            {log.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />}
            {log.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />}
            <span
              className={`${
                log.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : log.type === 'warning'
                  ? 'text-amber-300'
                  : log.type === 'step'
                  ? 'text-neutral-300'
                  : 'text-neutral-400'
              }`}
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand(inputVal);
        }}
        className="px-3 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
      >
        <span className="text-emerald-400 font-mono text-xs font-bold">&gt;</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='rs.ui(main_color = "#dc6601")'
          className="flex-1 bg-transparent text-xs font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded border border-neutral-700 font-medium transition-colors"
        >
          Execute
        </button>
      </form>
    </div>
  );
};
