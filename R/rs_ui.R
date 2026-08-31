#' Customize RStudio Desktop UI on Windows
#'
#' Modifies internal RStudio Desktop Windows resources to inject custom theme
#' colors and an adorable Orange Pixel Cat into the RStudio header bar.
#' Automatically performs pre-checks, non-destructive backups, and post-patch
#' verification.
#'
#' @param main_color Hex string of the main accent color (default: "#dc6601" - RStudio Orange).
#' @param cat_svg_path Optional custom path to an SVG file for the pixel cat icon.
#' @param custom_path Optional path to RStudio Desktop installation directory if not in default location.
#' @param dry_run Logical. If TRUE, runs all detection and validation steps without modifying any files.
#' @return Invisibly returns a status list.
#' @export
#' @examples
#' \dontrun{
#' # Customize with classic vibrant orange
#' rs.ui(main_color = "#dc6601")
#'
#' # Test with dry-run first
#' rs.ui(main_color = "#dc6601", dry_run = TRUE)
#' }
rs.ui <- function(main_color = "#dc6601",
                  cat_svg_path = NULL,
                  custom_path = NULL,
                  dry_run = FALSE) {
  apply_ui_patch(
    main_color = main_color,
    cat_svg_path = cat_svg_path,
    custom_path = custom_path,
    dry_run = dry_run
  )
}

#' Diagnostic Status of RStudio UI Customization
#'
#' Displays comprehensive status regarding RStudio detection, version,
#' active customization state, backup availability, and file integrity.
#'
#' @param custom_path Optional custom path to RStudio installation directory.
#' @return A list with diagnostic status values (printed to console).
#' @export
#' @examples
#' \dontrun{
#' rs.ui.status()
#' }
rs.ui.status <- function(custom_path = NULL) {
  detected <- rs.ui.detect(custom_path = custom_path)
  storage_dir <- get_user_storage_dir()
  meta <- get_latest_backup_metadata(storage_dir)

  is_customized <- FALSE
  if (isTRUE(detected$detected) && file.exists(detected$index_htm)) {
    idx_content <- paste(readLines(detected$index_htm, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
    is_customized <- grepl("rs-ui-custom-theme", idx_content, fixed = TRUE)
  }

  cat("\n============================================================\n")
  cat("         rs.ui.windows - RStudio Desktop Status\n")
  cat("============================================================\n")
  cat("OS Platform            : ", .Platform$OS.type, " (", Sys.info()[["sysname"]], ")\n", sep = "")
  cat("RStudio detected       : ", if (isTRUE(detected$detected)) "TRUE" else "FALSE", "\n", sep = "")
  cat("RStudio version        : ", detected$version, "\n", sep = "")
  cat("RStudio architecture   : ", detected$architecture, "\n", sep = "")
  cat("RStudio running        : ", if (isTRUE(detected$is_running)) "YES (active)" else "NO", "\n", sep = "")
  cat("Installation path      : ", detected$rstudio_dir, "\n", sep = "")
  cat("Write permissions      : ", if (isTRUE(detected$is_writable)) "OK (Writable)" else "RESTRICTED (Admin needed)", "\n", sep = "")
  cat("Customization state    : ", if (is_customized) "ACTIVE (Patched with Orange Cat)" else "DEFAULT (Un-modded)", "\n", sep = "")
  cat("Backup available       : ", if (!is.null(meta)) paste0("YES (", meta$rstudio_version, ")") else "NONE", "\n", sep = "")

  # Check version drift
  if (!is.null(meta) && isTRUE(detected$detected)) {
    compat <- verify_version_compatibility(detected$version, meta$rstudio_version)
    if (!isTRUE(compat$compatible)) {
      cat("\nWARNING:\n")
      cat("RStudio appears to have been updated since the last customization.\n")
      cat("Installed version : ", detected$version, "\n", sep = "")
      cat("Patched version   : ", meta$rstudio_version, "\n", sep = "")
      cat("Recommendation    : Run rs.ui.restore() and reapply rs.ui() to match the new build.\n")
    }
  }

  cat("============================================================\n\n")

  invisible(list(
    detected = detected$detected,
    version = detected$version,
    architecture = detected$architecture,
    is_running = detected$is_running,
    is_writable = detected$is_writable,
    customized = is_customized,
    backup_meta = meta
  ))
}

#' Explicitly Create a UI Backup Without Patching
#'
#' @param custom_path Optional custom path to RStudio installation directory.
#' @param force Logical whether to force a fresh backup.
#' @return Output of backup creation.
#' @export
#' @examples
#' \dontrun{
#' rs.ui.backup()
#' }
rs.ui.backup <- function(custom_path = NULL, force = FALSE) {
  detected <- rs.ui.detect(custom_path = custom_path)
  create_ui_backup(detected, force = force)
}
