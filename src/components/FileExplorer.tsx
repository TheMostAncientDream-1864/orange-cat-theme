import React, { useState } from 'react';
import { PACKAGE_FILES } from '../data/packageFiles';
import { PackageFile } from '../types';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  FileText,
  Search,
  CheckCircle,
} from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PackageFile>(PACKAGE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = PACKAGE_FILES.filter(
    (f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div id="package-file-explorer" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[540px] text-neutral-200">
      {/* Sidebar: File List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col bg-neutral-950/70">
        {/* Search Header */}
        <div className="p-3 border-b border-neutral-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter package files..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Tree List */}
        <div className="p-2 flex-1 overflow-y-auto space-y-1 text-xs">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {file.category === 'r' ? (
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : file.category === 'inst' ? (
                    <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  )}
                  <span className="font-mono text-[11.5px] truncate">{file.path}</span>
                </div>
                <span className="text-[10px] text-neutral-500 uppercase ml-2 shrink-0">{file.language}</span>
              </button>
            );
          })}
        </div>

        {/* Package Summary Footer */}
        <div className="p-3 border-t border-neutral-800 text-[11px] text-neutral-400 bg-neutral-900/40">
          <p className="font-semibold text-neutral-300">rs.ui.windows v0.1.0</p>
          <p className="text-[10px] text-neutral-500">{PACKAGE_FILES.length} package files ready for Windows</p>
        </div>
      </div>

      {/* Main File Content View */}
      <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
        {/* File Details Top Bar */}
        <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-neutral-200">{selectedFile.path}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
              {lines.length} lines
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-2.5 py-1 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Description Pill */}
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400">
          <span className="font-medium text-neutral-300">Purpose: </span>
          {selectedFile.description}
        </div>

        {/* Code Lines Viewer */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-300 bg-neutral-950/60 leading-relaxed select-text">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="pr-4 py-0.5 text-neutral-600 text-right select-none w-10 text-[11px] align-top">
                    {idx + 1}
                  </td>
                  <td className="py-0.5 pl-2 text-neutral-200 whitespace-pre font-mono text-[11.5px]">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
