# rs.ui.windows 🐱🟧

> **Windows Port & Modern Customizer for RStudio Desktop UI with Orange Pixel Cat Integration**
> 
> *A robust, safe, and reproducible Windows fork of the concept from [`grcatlin/rs.ui`](https://github.com/grcatlin/rs.ui).*

---

## 📖 Overview

Standard `.rstheme` files in RStudio only style the Ace code editor. **`rs.ui.windows`** extends beyond editor syntax highlighting by customizing the **outer RStudio Desktop Windows interface itself** (window headers, menubars, tab layouts, status indicators, and toolbar highlights) and embedding an authentic **Orange Pixel Art Cat** directly into the top header of RStudio!

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ RStudio Desktop  [File] [Edit] [Code] [View]          [ 🐱 Orange Cat ] ✕ │
├───────────────────────────────────────────────────────────────────────────┤
│ [Active Tab: script.R] (orange top accent) | [Console] | [Terminal]       │
├──────────────────────────────────────┬────────────────────────────────────┤
│ 1 | library(rs.ui.windows)           │ R version 4.x.x                    │
│ 2 | rs.ui(main_color = "#dc6601")    │ > rs.ui(main_color = "#dc6601")    │
│ 3 |                                  │ ==> Patch applied successfully!    │
└──────────────────────────────────────┴────────────────────────────────────┘
```

---

## 🛠️ Key Features

- **🐾 Authentic Orange Pixel Cat**: A pixel-art SVG embedded via self-contained Base64 Data URI that sits persistently in the RStudio header bar.
- **🎨 Dynamic Theme Engine**: Accepts any `main_color` (default: `#dc6601` RStudio orange) and automatically derives matching tints, hover states, border accents, and active tab highlights.
- **🛡️ 5-Step Safe Patching**: Enforces `detect -> validate -> backup -> patch -> verify`. If any step fails, changes are automatically rolled back.
- **💾 SHA256/MD5 Backup Preservation**: Backs up pristine un-modded UI files to `%LOCALAPPDATA%\rs.ui.windows\backups\` before modifying anything. Never blindly overwrites good backups.
- **⚡ Instant 1-Command Restore**: `rs.ui.restore()` immediately restores default un-modded RStudio files.
- **🔍 Windows Discovery**: Automatically finds RStudio across Electron (2022.07 - 2026+) and legacy Qt installations in Program Files, LocalAppData, Registry keys, or custom paths.
- **🧪 Dry-Run Mode**: Test and inspect all file operations without modifying your system via `rs.ui(dry_run = TRUE)`.

---

## 📦 Installation

Install `rs.ui.windows` directly from GitHub using `remotes` or `devtools`:

```r
# Install remotes if needed
if (!requireNamespace("remotes", quietly = TRUE)) install.packages("remotes")

# Install rs.ui.windows directly from GitHub repository root
remotes::install_github("TheMostAncientDream-1864/orange-cat-theme")
```

---

## 🚀 Quick Start

### 1. Apply UI Theme & Orange Pixel Cat

Close RStudio Desktop (or run from an R terminal / RGui), then execute:

```r
library(rs.ui.windows)

# Apply with default classic orange (#dc6601)
rs.ui(main_color = "#dc6601")
```

### 2. Test Before Modifying (Dry Run)

```r
rs.ui(main_color = "#dc6601", dry_run = TRUE)
```

### 3. Check System Status & Diagnostics

```r
rs.ui.status()
```

Output:
```text
============================================================
         rs.ui.windows - RStudio Desktop Status
============================================================
OS Platform            : windows (Windows 11)
RStudio detected       : TRUE
RStudio version        : 2026.01.0
RStudio architecture   : electron
RStudio running        : NO
Installation path      : C:/Program Files/RStudio
Write permissions      : OK (Writable)
Customization state    : ACTIVE (Patched with Orange Cat)
Backup available       : YES (2026.01.0)
============================================================
```

### 4. Restore to Pristine Default

```r
rs.ui.restore()
```

---

## 🔐 Administrator Privileges on Windows

When RStudio Desktop is installed in `C:\Program Files\RStudio`, modifying internal UI files requires Administrator write permissions.

If `rs.ui()` reports write permission restrictions, run R with Administrator privileges:

### Option A: Via PowerShell (Admin)
Open PowerShell as Administrator (Right click -> Run as Administrator):
```powershell
R.exe -e "rs.ui.windows::rs.ui(main_color='#dc6601')"
```

### Option B: Run R / RStudio as Administrator
Right click your R terminal or RStudio shortcut -> **Run as administrator**, then run `rs.ui()`.

---

## 🔬 Architectural Comparison: macOS `rs.ui` vs Windows `rs.ui.windows`

| Feature | Original `grcatlin/rs.ui` (macOS) | `rs.ui.windows` (Windows) |
| :--- | :--- | :--- |
| **Target OS** | macOS (`/Applications/RStudio.app`) | Windows 10 & 11 (`C:\Program Files\RStudio`) |
| **Electron Path Support** | `Contents/Resources/app/...` | `resources/app/resources/www/index.htm` |
| **Discovery Mechanism** | Hardcoded macOS path | Auto Registry, Env Vars, Program Files, LocalAppData |
| **Pixel Cat Mascot** | None (CSS color only) | 🐱 **Embedded Orange Pixel Cat** in header |
| **Asset Delivery** | File copy | **Self-contained Base64 Data URI** (zero path breakage) |
| **Backup Verification** | Basic copy | **SHA256/MD5 Hash metadata & integrity check** |
| **Process Inspection** | None | Detects if `rstudio.exe` is running via `tasklist` |
| **Version Drift Alert** | None | Alerts if RStudio updated after patch |

---

## 📂 Repository Structure

```text
orange-cat-theme/
│
├── DESCRIPTION               # R package metadata (Package: rs.ui.windows)
├── NAMESPACE                 # Exported functions & imports
├── README.md                 # Complete documentation & usage instructions
├── .Rbuildignore             # Build ignore file for R CMD build
│
├── R/
│   ├── rs_ui.R               # Main user entry points (rs.ui, rs.ui.status, rs.ui.backup)
│   ├── detect_rstudio.R      # Windows RStudio installation discovery & path resolution
│   ├── version_check.R       # Electron & Qt version inspection & drift detection
│   ├── backup.R              # Non-destructive backup creation & hash verification
│   ├── patch.R               # Verified patch workflow & rollback guards
│   ├── restore.R             # 1-click pristine rollback restoration
│   ├── css_generator.R       # CSS generator & palette derivation
│   └── utils.R               # Color arithmetic, SVG Base64 encoding, Windows utilities
│
├── inst/
│   ├── css/
│   │   └── base.css          # Base CSS template for RStudio GWT workbench
│   └── assets/
│       └── cat.svg           # Authentic pixel art orange cat SVG
│
└── tests/
    ├── testthat.R
    └── testthat/
        ├── test-color.R
        ├── test-css.R
        └── test-backup-restore.R
```

---

## ❓ Exported Functions Summary

| Function | Purpose | Example |
| :--- | :--- | :--- |
| `rs.ui(main_color = "#dc6601")` | Applies custom color theme & embeds Orange Pixel Cat | `rs.ui(main_color = "#e06c75")` |
| `rs.ui.status()` | Comprehensive status & diagnostics for RStudio on Windows | `rs.ui.status()` |
| `rs.ui.restore()` | Restores pristine un-modded RStudio UI files from backup | `rs.ui.restore()` |
| `rs.ui.detect()` | Discovers RStudio installation path & architecture | `rs.ui.detect()` |
| `rs.ui.backup()` | Creates SHA256-verified backup of RStudio UI files | `rs.ui.backup()` |
| `rs.ui(dry_run = TRUE)` | Simulates patch validation without touching any system files | `rs.ui(dry_run = TRUE)` |

---

## 📄 License

MIT License © 2026 rs.ui.windows contributors.
Concept inspired by `grcatlin/rs.ui`.
