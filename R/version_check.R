#' Detect RStudio Version
#'
#' Extracts the version identifier from an RStudio Desktop installation.
#'
#' @param rstudio_dir Path to the RStudio root directory
#' @return Version string (e.g. "2026.01.0") or "unknown"
#' @keywords internal
detect_rstudio_version <- function(rstudio_dir) {
  if (is.null(rstudio_dir) || is.na(rstudio_dir) || !dir.exists(rstudio_dir)) {
    return("unknown")
  }

  # 1. Try Electron package.json
  pkg_json <- file.path(rstudio_dir, "resources", "app", "package.json")
  if (file.exists(pkg_json)) {
    tryCatch({
      pkg_data <- jsonlite::fromJSON(pkg_json)
      if (!is.null(pkg_data$version) && nzchar(pkg_data$version)) {
        return(as.character(pkg_data$version))
      }
    }, error = function(e) NULL)
  }

  # 2. Try VERSION file
  ver_file <- file.path(rstudio_dir, "VERSION")
  if (file.exists(ver_file)) {
    tryCatch({
      lines <- readLines(ver_file, warn = FALSE)
      if (length(lines) > 0 && nzchar(lines[1])) {
        return(trimws(lines[1]))
      }
    }, error = function(e) NULL)
  }

  # 3. Check if running inside RStudio
  if (exists(".rs.rpc.version", mode = "function") || exists("RStudio.Version", mode = "function")) {
    tryCatch({
      fn <- get("RStudio.Version", envir = asNamespace("rstudioapi"))
      v <- fn()
      if (!is.null(v$version)) return(as.character(v$version))
    }, error = function(e) NULL)
  }

  "unknown"
}

#' Check Version Compatibility Against Backup Metadata
#'
#' @param current_version Current detected RStudio version
#' @param backup_meta_version Version recorded when backup was created
#' @return A list with compatibility boolean and diagnostic message
#' @keywords internal
verify_version_compatibility <- function(current_version, backup_meta_version) {
  if (is.na(current_version) || current_version == "unknown" ||
      is.na(backup_meta_version) || backup_meta_version == "unknown") {
    return(list(
      compatible = TRUE,
      warning = "Version details could not be fully verified; proceeding with checksum safety guards."
    ))
  }

  if (identical(current_version, backup_meta_version)) {
    return(list(
      compatible = TRUE,
      warning = NULL
    ))
  }

  list(
    compatible = FALSE,
    warning = sprintf(
      "RStudio version mismatch! Installed: %s, Patched: %s. RStudio may have been updated since last customization.",
      current_version, backup_meta_version
    )
  )
}
