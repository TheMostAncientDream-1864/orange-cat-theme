#' Detect RStudio Desktop Installation on Windows
#'
#' Automatically detects the RStudio Desktop installation directory,
#' verifies internal UI resource paths (Electron & Qt architectures),
#' checks write permissions, and inspects process activity.
#'
#' @param custom_path Optional custom path to RStudio installation directory.
#' @return A list containing detection status, resolved paths, and diagnostics:
#'   \item{detected}{Logical indicating if a valid RStudio installation was found}
#'   \item{rstudio_dir}{Root installation directory}
#'   \item{index_htm}{Path to the target UI entry point index.htm}
#'   \item{www_dir}{Path to the internal web resources directory}
#'   \item{version}{Detected version string or character NA}
#'   \item{architecture}{"electron" or "qt" or "unknown"}
#'   \item{is_running}{Logical indicating if rstudio.exe is currently active}
#'   \item{is_writable}{Logical indicating if R has write permissions to the resources}
#'   \item{status_message}{Human-readable summary message}
#' @export
#' @examples
#' \dontrun{
#' info <- rs.ui.detect()
#' print(info)
#' }
rs.ui.detect <- function(custom_path = NULL) {
  # Candidate root search paths on Windows
  candidates <- character(0)

  if (!is.null(custom_path) && nzchar(custom_path)) {
    candidates <- c(candidates, normalizePath(custom_path, winslash = "/", mustWork = FALSE))
  }

  # Check environment variables
  env_desktop <- Sys.getenv("RSTUDIO_DESKTOP_DIR", "")
  if (nzchar(env_desktop)) candidates <- c(candidates, env_desktop)

  env_path <- Sys.getenv("RSTUDIO_PATH", "")
  if (nzchar(env_path)) candidates <- c(candidates, env_path)

  # Check Windows Registry if available
  if (.Platform$OS.type == "windows") {
    reg_keys <- c(
      "Software\\RStudio",
      "Software\\Posit\\RStudio",
      "Software\\WOW6432Node\\RStudio",
      "Software\\WOW6432Node\\Posit\\RStudio"
    )
    for (key in reg_keys) {
      tryCatch({
        val_lm <- utils::readRegistry(key, hive = "HLM", maxdepth = 2)
        if (!is.null(val_lm$InstallPath)) candidates <- c(candidates, val_lm$InstallPath)
      }, error = function(e) NULL)

      tryCatch({
        val_cu <- utils::readRegistry(key, hive = "HCU", maxdepth = 2)
        if (!is.null(val_cu$InstallPath)) candidates <- c(candidates, val_cu$InstallPath)
      }, error = function(e) NULL)
    }
  }

  # Standard Windows directories
  prog_files <- Sys.getenv("ProgramFiles", "C:/Program Files")
  prog_files_x86 <- Sys.getenv("ProgramFiles(x86)", "C:/Program Files (x86)")
  local_app_data <- Sys.getenv("LOCALAPPDATA", "")

  candidates <- c(
    candidates,
    file.path(prog_files, "RStudio"),
    file.path(prog_files, "Posit", "RStudio"),
    file.path(prog_files_x86, "RStudio"),
    if (nzchar(local_app_data)) file.path(local_app_data, "Programs", "RStudio") else character(0),
    "C:/RStudio",
    "C:/Posit/RStudio"
  )

  candidates <- unique(candidates[nzchar(candidates)])

  # Probe candidate directories for index.htm / www
  detected_info <- NULL

  for (cand in candidates) {
    norm_cand <- tryCatch(normalizePath(cand, winslash = "/", mustWork = FALSE), error = function(e) cand)
    if (!dir.exists(norm_cand)) next

    # 1. Check primary Electron path (RStudio Desktop 2022.07+ - 2026+): <rstudio_dir>/resources/app/www/index.htm
    electron_index_1 <- file.path(norm_cand, "resources", "app", "www", "index.htm")
    electron_www_1 <- file.path(norm_cand, "resources", "app", "www")
    if (file.exists(electron_index_1)) {
      detected_info <- list(
        detected = TRUE,
        rstudio_dir = normalizePath(norm_cand, winslash = "/", mustWork = FALSE),
        index_htm = normalizePath(electron_index_1, winslash = "/", mustWork = FALSE),
        www_dir = normalizePath(electron_www_1, winslash = "/", mustWork = FALSE),
        architecture = "electron"
      )
      break
    }

    # 2. Check nested Electron path: <rstudio_dir>/resources/app/resources/www/index.htm
    electron_index_2 <- file.path(norm_cand, "resources", "app", "resources", "www", "index.htm")
    electron_www_2 <- file.path(norm_cand, "resources", "app", "resources", "www")
    if (file.exists(electron_index_2)) {
      detected_info <- list(
        detected = TRUE,
        rstudio_dir = normalizePath(norm_cand, winslash = "/", mustWork = FALSE),
        index_htm = normalizePath(electron_index_2, winslash = "/", mustWork = FALSE),
        www_dir = normalizePath(electron_www_2, winslash = "/", mustWork = FALSE),
        architecture = "electron"
      )
      break
    }

    # 3. Check root resources Electron path: <rstudio_dir>/resources/www/index.htm
    electron_index_3 <- file.path(norm_cand, "resources", "www", "index.htm")
    electron_www_3 <- file.path(norm_cand, "resources", "www")
    if (file.exists(electron_index_3)) {
      detected_info <- list(
        detected = TRUE,
        rstudio_dir = normalizePath(norm_cand, winslash = "/", mustWork = FALSE),
        index_htm = normalizePath(electron_index_3, winslash = "/", mustWork = FALSE),
        www_dir = normalizePath(electron_www_3, winslash = "/", mustWork = FALSE),
        architecture = "electron"
      )
      break
    }

    # 4. Check legacy Qt path (RStudio < 2022.07): <rstudio_dir>/www/index.htm
    qt_index <- file.path(norm_cand, "www", "index.htm")
    qt_www <- file.path(norm_cand, "www")
    if (file.exists(qt_index)) {
      detected_info <- list(
        detected = TRUE,
        rstudio_dir = normalizePath(norm_cand, winslash = "/", mustWork = FALSE),
        index_htm = normalizePath(qt_index, winslash = "/", mustWork = FALSE),
        www_dir = normalizePath(qt_www, winslash = "/", mustWork = FALSE),
        architecture = "qt"
      )
      break
    }
  }

  if (is.null(detected_info)) {
    return(list(
      detected = FALSE,
      rstudio_dir = NA_character_,
      index_htm = NA_character_,
      www_dir = NA_character_,
      version = NA_character_,
      architecture = "unknown",
      is_running = is_rstudio_running(),
      is_writable = FALSE,
      status_message = "RStudio Desktop installation could not be detected automatically. Use custom_path argument if installed in a non-standard directory."
    ))
  }

  # Detect version
  ver <- detect_rstudio_version(detected_info$rstudio_dir)
  detected_info$version <- ver

  # Check running state
  detected_info$is_running <- is_rstudio_running()

  # Check write permissions
  detected_info$is_writable <- is_path_writable(detected_info$index_htm) && is_path_writable(detected_info$www_dir)

  detected_info$status_message <- if (detected_info$is_writable) {
    "RStudio detected and resources are writable."
  } else {
    "RStudio detected, but administrator permissions are required to modify resources."
  }

  detected_info
}
