#' Backup System for RStudio Desktop UI Files
#'
#' Securely creates non-destructive backups of original RStudio UI files
#' before any patch operation. Calculates and verifies cryptographic checksums,
#' saves metadata, and preserves un-modded base states.
#'
#' @keywords internal

#' Create a safe backup of RStudio UI files
#' @param detected_info Output from rs.ui.detect()
#' @param force Logical whether to overwrite existing backup if corrupted
#' @return List with status, backup path, and metadata
create_ui_backup <- function(detected_info, force = FALSE) {
  if (!isTRUE(detected_info$detected)) {
    stop("Cannot create backup: RStudio Desktop was not detected.", call. = FALSE)
  }

  storage_dir <- get_user_storage_dir()
  ver_tag <- gsub("[^a-zA-Z0-9._-]", "_", detected_info$version)
  if (!nzchar(ver_tag) || ver_tag == "unknown") ver_tag <- "default"

  backup_dir <- file.path(storage_dir, "backups", paste0("RStudio-version-", ver_tag))
  meta_file <- file.path(backup_dir, "metadata.json")

  # Check if a valid un-modded backup already exists
  if (dir.exists(backup_dir) && file.exists(meta_file) && !force) {
    tryCatch({
      existing_meta <- jsonlite::fromJSON(meta_file)
      # Verify integrity of existing backup file
      backup_file <- file.path(backup_dir, "index.htm")
      if (file.exists(backup_file)) {
        current_hash <- calculate_file_hash(backup_file)
        if (identical(current_hash, existing_meta$files$index_htm$backup_hash)) {
          message("==> Valid original backup already exists at: ", backup_dir)
          return(list(
            success = TRUE,
            backup_dir = backup_dir,
            metadata = existing_meta,
            is_new = FALSE
          ))
        }
      }
    }, error = function(e) NULL)
  }

  # Ensure directory exists
  if (!dir.exists(backup_dir)) {
    dir.create(backup_dir, recursive = TRUE, showWarnings = FALSE)
  }

  # Copy original files
  orig_index <- detected_info$index_htm
  if (!file.exists(orig_index)) {
    stop("Original UI entry point not found: ", orig_index, call. = FALSE)
  }

  # Verify original content is unpatched (must not already contain rs-ui markers)
  orig_content <- paste(readLines(orig_index, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  if (grepl("rs-ui-custom-theme|rs.ui.css", orig_content)) {
    warning("Target index.htm appears to already have been patched. Looking for existing clean backup...", call. = FALSE)
  }

  dest_index <- file.path(backup_dir, "index.htm")
  copy_ok <- file.copy(orig_index, dest_index, overwrite = TRUE)

  if (!copy_ok) {
    stop("Failed to copy ", orig_index, " to backup location ", dest_index, call. = FALSE)
  }

  orig_hash <- calculate_file_hash(orig_index)
  backup_hash <- calculate_file_hash(dest_index)

  if (!identical(orig_hash, backup_hash)) {
    stop("Backup verification failed: Hash mismatch between source and backup copy!", call. = FALSE)
  }

  metadata <- list(
    package = "rs.ui.windows",
    created_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%S%z"),
    rstudio_version = detected_info$version,
    architecture = detected_info$architecture,
    rstudio_dir = detected_info$rstudio_dir,
    files = list(
      index_htm = list(
        original_path = orig_index,
        backup_path = dest_index,
        original_hash = orig_hash,
        backup_hash = backup_hash
      )
    )
  )

  jsonlite::write_json(metadata, meta_file, pretty = TRUE, auto_unbox = TRUE)

  message("==> Successfully created verified UI backup at: ", backup_dir)
  list(
    success = TRUE,
    backup_dir = backup_dir,
    metadata = metadata,
    is_new = TRUE
  )
}

#' Retrieve latest backup metadata
#' @param custom_storage Optional path to storage directory
#' @return Metadata object or NULL
get_latest_backup_metadata <- function(custom_storage = NULL) {
  storage_dir <- if (!is.null(custom_storage)) custom_storage else get_user_storage_dir()
  backups_root <- file.path(storage_dir, "backups")
  if (!dir.exists(backups_root)) return(NULL)

  backup_dirs <- list.dirs(backups_root, full.names = TRUE, recursive = FALSE)
  if (length(backup_dirs) == 0) return(NULL)

  # Check metadata in newest directory
  for (bdir in rev(backup_dirs)) {
    meta_file <- file.path(bdir, "metadata.json")
    if (file.exists(meta_file)) {
      res <- tryCatch(jsonlite::fromJSON(meta_file), error = function(e) NULL)
      if (!is.null(res)) return(res)
    }
  }
  NULL
}
