export interface ThemePalette {
  mainColor: string;
  lightColor: string;
  darkColor: string;
  hoverColor: string;
  activeColor: string;
  borderColor: string;
  bgTint: string;
}

export interface PackageFile {
  path: string;
  name: string;
  category: 'core' | 'r' | 'inst' | 'tests' | 'docs';
  language: string;
  content: string;
  description: string;
}

export interface RStudioDiagnostic {
  detected: boolean;
  rstudioDir: string;
  version: string;
  architecture: 'electron' | 'qt' | 'unknown';
  isRunning: boolean;
  isWritable: boolean;
  customized: boolean;
  backupAvailable: boolean;
  statusMessage: string;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'step';
  text: string;
}
