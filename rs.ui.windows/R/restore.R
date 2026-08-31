#' Restore Original RStudio Desktop UI Files
#'
#' Restores RStudio UI files from the verified backup created prior to patching.
#' Removes custom CSS injections and returns RStudio to its pristine original state.
#'
#' @param custom_path Optional custom path to RStudio installation directory.
#' @param force Logical whether to force restore even if version mismatch warning is present.
#' @return Logical TRUE (invisibly) if restore was successful.
#' @export
#' @examples
#' \dontrun{
#' rs.ui.restore()
#' }
rs.ui.restore <- function(custom_path = NULL, force = FALSE) {
  detected <- rs.ui.detect(custom_path = custom_path)

  if (!isTRUE(detected$detected)) {
    stop("Restore aborted: Unable to locate RStudio Desktop installation.", call. = FALSE)
  }

  if (isTRUE(detected$is_running)) {
    warning("RStudio is currently running. Please restart RStudio after restore completes.", call. = FALSE)
  }

  # Look for backup metadata
  storage_dir <- get_user_storage_dir()
  ver_tag <- gsub("[^a-zA-Z0-9._-]", "_", detected$version)
  if (!nzchar(ver_tag) || ver_tag == "unknown") ver_tag <- "default"

  backup_dir <- file.path(storage_dir, "backups", paste0("RStudio-version-", ver_tag))
  meta_file <- file.path(backup_dir, "metadata.json")

  # Fallback to any latest backup if version-specific dir not found
  if (!file.exists(meta_file)) {
    latest_meta <- get_latest_backup_metadata(storage_dir)
    if (!is.null(latest_meta)) {
      meta_file <- file.path(dirname(latest_meta$files$index_htm$backup_path), "metadata.json")
      backup_dir <- dirname(meta_file)
    }
  }

  if (!file.exists(meta_file)) {
    # Check if index.htm can simply have the link tag stripped if no backup folder exists
    if (file.exists(detected$index_htm)) {
      idx_txt <- paste(readLines(detected$index_htm, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
      if (grepl("rs-ui-custom-theme", idx_txt, fixed = TRUE)) {
        cleaned <- gsub('<link rel="stylesheet" id="rs-ui-custom-theme"[^>]*>', '', idx_txt)
        writeLines(cleaned, detected$index_htm, useBytes = TRUE)
        target_css <- file.path(detected$www_dir, "rs.ui.css")
        if (file.exists(target_css)) unlink(target_css)
        cat("==> Notice: No backup metadata found, but custom rs.ui link tag was safely stripped.\n")
        return(invisible(TRUE))
      }
    }
    stop("No backup found in: ", file.path(storage_dir, "backups"), call. = FALSE)
  }

  meta <- jsonlite::fromJSON(meta_file)
  backup_index <- meta$files$index_htm$backup_path

  if (!file.exists(backup_index)) {
    stop("Backup file is missing from expected path: ", backup_index, call. = FALSE)
  }

  # Verify backup hash against metadata
  cur_backup_hash <- calculate_file_hash(backup_index)
  if (!identical(cur_backup_hash, meta$files$index_htm$backup_hash) && !force) {
    stop("Backup verification failed: Backup file hash does not match original metadata!", call. = FALSE)
  }

  # Version compatibility check
  compat <- verify_version_compatibility(detected$version, meta$rstudio_version)
  if (!isTRUE(compat$compatible) && !force) {
    warning(compat$warning, "\nProceeding with restore from backup...", call. = FALSE)
  }

  # Copy backup back to index.htm
  copy_ok <- file.copy(backup_index, detected$index_htm, overwrite = TRUE)
  if (!copy_ok) {
    stop("Failed to restore index.htm. Administrator permissions may be required.", call. = FALSE)
  }

  # Remove generated rs.ui.css if present in www directory
  target_css <- file.path(detected$www_dir, "rs.ui.css")
  if (file.exists(target_css)) {
    unlink(target_css)
  }

  # Verify clean state
  restored_content <- paste(readLines(detected$index_htm, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  is_clean <- !grepl("rs-ui-custom-theme", restored_content, fixed = TRUE)

  if (!is_clean) {
    warning("Restore completed, but patch signature may still be present in index.htm.", call. = FALSE)
  } else {
    cat("==> Original RStudio UI successfully restored from verified backup!\n")
    cat("==> RStudio has been returned to default un-modded configuration.\n")
    cat("==> Backup was preserved at: ", backup_dir, "\n", sep = "")
  }

  invisible(TRUE)
}
