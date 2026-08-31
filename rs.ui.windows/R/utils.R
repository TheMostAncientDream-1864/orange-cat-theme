#' Utility functions for rs.ui.windows
#'
#' Internal helper utilities for Windows path resolution, color manipulation,
#' process detection, and SVG data URI encoding.
#'
#' @keywords internal

#' Convert hex color string to RGB vector
#' @param hex Hex color code string (e.g., "#dc6601" or "dc6601")
#' @return Numeric vector of length 3 with values 0-255
hex_to_rgb <- function(hex) {
  hex <- gsub("^#", "", trimws(hex))
  if (nchar(hex) == 3) {
    hex <- paste0(rep(strsplit(hex, "")[[1]], each = 2), collapse = "")
  }
  if (nchar(hex) != 6) {
    stop("Invalid hex color code: '", hex, "'. Expected 3 or 6 hex digits.", call. = FALSE)
  }
  r <- strtoi(substr(hex, 1, 2), base = 16)
  g <- strtoi(substr(hex, 3, 4), base = 16)
  b <- strtoi(substr(hex, 5, 6), base = 16)
  if (is.na(r) || is.na(g) || is.na(b)) {
    stop("Failed to parse hex color: '", hex, "'", call. = FALSE)
  }
  c(r = r, g = g, b = b)
}

#' Convert RGB vector to hex color string
#' @param rgb Numeric vector of length 3 (r, g, b) between 0 and 255
#' @return Formatted hex string (e.g., "#dc6601")
rgb_to_hex <- function(rgb) {
  rgb <- pmax(0, pmin(255, round(rgb)))
  sprintf("#%02x%02x%02x", rgb[1], rgb[2], rgb[3])
}

#' Lighten a hex color by a given factor
#' @param hex Hex color string
#' @param factor Numeric between 0 and 1 (0 = unchanged, 1 = white)
#' @return Lightened hex color string
lighten_hex <- function(hex, factor = 0.25) {
  rgb <- hex_to_rgb(hex)
  new_rgb <- rgb + (255 - rgb) * factor
  rgb_to_hex(new_rgb)
}

#' Darken a hex color by a given factor
#' @param hex Hex color string
#' @param factor Numeric between 0 and 1 (0 = unchanged, 1 = black)
#' @return Darkened hex color string
darken_hex <- function(hex, factor = 0.25) {
  rgb <- hex_to_rgb(hex)
  new_rgb <- rgb * (1 - factor)
  rgb_to_hex(new_rgb)
}

#' Generate an RGBA string with alpha opacity
#' @param hex Hex color string
#' @param alpha Alpha value between 0.0 and 1.0
#' @return CSS rgba(...) string
hex_to_rgba_str <- function(hex, alpha = 0.15) {
  rgb <- hex_to_rgb(hex)
  sprintf("rgba(%d, %d, %d, %.2f)", rgb["r"], rgb["g"], rgb["b"], alpha)
}

#' Calculate palette derivatives from a main color
#' @param main_color Primary hex color
#' @return Named list with color variants
derive_theme_palette <- function(main_color) {
  list(
    main_color = main_color,
    light_color = lighten_hex(main_color, 0.35),
    dark_color = darken_hex(main_color, 0.25),
    hover_color = lighten_hex(main_color, 0.15),
    active_color = darken_hex(main_color, 0.35),
    border_color = lighten_hex(main_color, 0.50),
    bg_tint = hex_to_rgba_str(main_color, 0.12)
  )
}

#' Encode SVG file or string into a Base64 data URI
#' @param svg_path Absolute path to SVG file or raw SVG string
#' @return Complete data URI string "data:image/svg+xml;base64,..."
svg_to_data_uri <- function(svg_path) {
  if (file.exists(svg_path)) {
    svg_content <- paste(readLines(svg_path, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  } else {
    svg_content <- svg_path
  }

  raw_bytes <- charToRaw(svg_content)
  base64_encoded <- jsonlite::base64_enc(raw_bytes)
  paste0("data:image/svg+xml;base64,", base64_encoded)
}

#' Get standard Windows LocalAppData directory for rs.ui.windows
#' @return Absolute normalized path
get_user_storage_dir <- function() {
  local_app_data <- Sys.getenv("LOCALAPPDATA", "")
  if (nzchar(local_app_data)) {
    target <- file.path(local_app_data, "rs.ui.windows")
  } else {
    target <- file.path(Sys.getenv("USERPROFILE", "~"), ".rs.ui.windows")
  }
  if (!dir.exists(target)) {
    dir.create(target, recursive = TRUE, showWarnings = FALSE)
  }
  normalizePath(target, winslash = "/", mustWork = FALSE)
}

#' Check if RStudio is currently running on Windows
#' @return Logical TRUE if rstudio.exe is in process list, FALSE otherwise
is_rstudio_running <- function() {
  if (.Platform$OS.type != "windows") {
    # Check via ps on unix/darwin
    res <- tryCatch(system2("pgrep", args = c("-i", "rstudio"), stdout = TRUE, stderr = NULL), error = function(e) character(0))
    return(length(res) > 0)
  }

  tryCatch({
    out <- system2("tasklist", args = c("/FI", "\"IMAGENAME eq rstudio.exe\"", "/NH"), stdout = TRUE, stderr = FALSE)
    any(grepl("rstudio.exe", out, ignore.case = TRUE))
  }, error = function(e) {
    FALSE
  })
}

#' Check whether a directory or file is writable
#' @param path File or directory path
#' @return Logical TRUE if writable
is_path_writable <- function(path) {
  if (!file.exists(path)) {
    parent <- dirname(path)
    return(file.access(parent, mode = 2) == 0)
  }
  file.access(path, mode = 2) == 0
}

#' Calculate SHA256 / MD5 hash of a file
#' @param file_path File path
#' @return Hex hash string
calculate_file_hash <- function(file_path) {
  if (!file.exists(file_path)) return(NA_character_)
  as.character(tools::md5sum(file_path))
}
