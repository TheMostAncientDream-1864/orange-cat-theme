#' Generate Custom CSS with Orange Pixel Cat for RStudio UI
#'
#' Generates complete, self-contained CSS styles including calculated
#' color palettes and the embedded Orange Pixel Cat SVG data URI.
#'
#' @param main_color Primary hex color string (e.g. "#dc6601")
#' @param cat_svg_path Optional path to custom SVG cat file. Defaults to bundled inst/assets/cat.svg
#' @param output_file Optional path to write generated CSS file
#' @return The generated CSS string (invisibly if output_file is provided)
#' @keywords internal
generate_theme_css <- function(main_color = "#dc6601",
                               cat_svg_path = NULL,
                               output_file = NULL) {
  # 1. Resolve Palette
  palette <- derive_theme_palette(main_color)

  # 2. Resolve Cat SVG
  if (is.null(cat_svg_path) || !file.exists(cat_svg_path)) {
    bundled_cat <- system.file("assets", "cat.svg", package = "rs.ui.windows")
    if (file.exists(bundled_cat)) {
      cat_svg_path <- bundled_cat
    } else {
      # Fallback to local dev path or inline SVG
      dev_path <- file.path("inst", "assets", "cat.svg")
      if (file.exists(dev_path)) {
        cat_svg_path <- dev_path
      } else {
        cat_svg_path <- file.path(dirname(getwd()), "inst", "assets", "cat.svg")
      }
    }
  }

  cat_data_uri <- if (file.exists(cat_svg_path)) {
    svg_to_data_uri(cat_svg_path)
  } else {
    # Inline fallback pixel cat SVG if file is unreachable
    svg_to_data_uri(get_inline_cat_svg(palette$main_color, palette$light_color, palette$dark_color))
  }

  # 3. Load base CSS template
  base_css_file <- system.file("css", "base.css", package = "rs.ui.windows")
  if (!file.exists(base_css_file)) {
    dev_css <- file.path("inst", "css", "base.css")
    if (file.exists(dev_css)) {
      base_css_file <- dev_css
    }
  }

  if (file.exists(base_css_file)) {
    css_template <- paste(readLines(base_css_file, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  } else {
    css_template <- get_fallback_css_template()
  }

  # 4. Substitute placeholders
  compiled_css <- css_template
  compiled_css <- gsub("\\{\\{MAIN_COLOR\\}\\}", palette$main_color, compiled_css)
  compiled_css <- gsub("\\{\\{LIGHT_COLOR\\}\\}", palette$light_color, compiled_css)
  compiled_css <- gsub("\\{\\{DARK_COLOR\\}\\}", palette$dark_color, compiled_css)
  compiled_css <- gsub("\\{\\{BG_TINT\\}\\}", palette$bg_tint, compiled_css)
  compiled_css <- gsub("\\{\\{BORDER_COLOR\\}\\}", palette$border_color, compiled_css)
  compiled_css <- gsub("\\{\\{HOVER_COLOR\\}\\}", palette$hover_color, compiled_css)
  compiled_css <- gsub("\\{\\{ACTIVE_COLOR\\}\\}", palette$active_color, compiled_css)
  compiled_css <- gsub("\\{\\{CAT_SVG_DATA_URI\\}\\}", cat_data_uri, compiled_css)

  # Write if output path requested
  if (!is.null(output_file)) {
    out_dir <- dirname(output_file)
    if (!dir.exists(out_dir)) dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)
    writeLines(compiled_css, output_file, useBytes = TRUE)
    invisible(compiled_css)
  } else {
    compiled_css
  }
}

#' Fallback template if file is not found
#' @keywords internal
get_fallback_css_template <- function() {
  paste(
    ":root {",
    "  --rs-ui-main: {{MAIN_COLOR}};",
    "  --rs-ui-light: {{LIGHT_COLOR}};",
    "  --rs-ui-dark: {{DARK_COLOR}};",
    "  --rs-ui-bg-tint: {{BG_TINT}};",
    "  --rs-ui-border: {{BORDER_COLOR}};",
    "  --rs-ui-hover: {{HOVER_COLOR}};",
    "  --rs-ui-active: {{ACTIVE_COLOR}};",
    "  --rs-ui-cat-data-uri: url(\"{{CAT_SVG_DATA_URI}}\");",
    "}",
    "/* Orange Pixel Cat Floating in Header */",
    "body::before, #rstudio_shell::before, #rstudio_container::before {",
    "  content: \"\" !important;",
    "  position: fixed !important;",
    "  top: 4px !important;",
    "  right: 86px !important;",
    "  width: 36px !important;",
    "  height: 27px !important;",
    "  background-image: var(--rs-ui-cat-data-uri) !important;",
    "  background-size: contain !important;",
    "  background-repeat: no-repeat !important;",
    "  background-position: center !important;",
    "  image-rendering: pixelated !important;",
    "  z-index: 999999 !important;",
    "  pointer-events: auto !important;",
    "  cursor: pointer !important;",
    "}",
    ".rstudio-themes-flat .gwt-TabLayoutPanelTab-selected {",
    "  border-top: 3px solid var(--rs-ui-main) !important;",
    "  color: var(--rs-ui-main) !important;",
    "}",
    sep = "\n"
  )
}

#' Get inline Cat SVG string
#' @keywords internal
get_inline_cat_svg <- function(main = "#dc6601", light = "#ff8e32", dark = "#b84f00") {
  sprintf(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" width="48" height="36" shape-rendering="crispEdges"><rect x="3" y="1" width="3" height="1" fill="#1e130a"/><rect x="18" y="1" width="3" height="1" fill="#1e130a"/><rect x="2" y="2" width="1" height="3" fill="#1e130a"/><rect x="3" y="2" width="3" height="1" fill="%s"/><rect x="6" y="2" width="1" height="1" fill="#1e130a"/><rect x="17" y="2" width="1" height="1" fill="#1e130a"/><rect x="18" y="2" width="3" height="1" fill="%s"/><rect x="21" y="2" width="1" height="3" fill="#1e130a"/><rect x="4" y="3" width="2" height="2" fill="#ff7597"/><rect x="7" y="3" width="10" height="1" fill="#1e130a"/><rect x="18" y="3" width="2" height="2" fill="#ff7597"/><rect x="1" y="5" width="1" height="7" fill="#1e130a"/><rect x="2" y="5" width="20" height="2" fill="%s"/><rect x="22" y="5" width="1" height="7" fill="#1e130a"/><rect x="5" y="7" width="4" height="3" fill="#0f0a06"/><rect x="5" y="7" width="2" height="2" fill="#ffffff"/><rect x="15" y="7" width="4" height="3" fill="#0f0a06"/><rect x="15" y="7" width="2" height="2" fill="#ffffff"/><rect x="11" y="9" width="2" height="1" fill="#ff7597"/><rect x="7" y="10" width="10" height="2" fill="#fff5eb"/><rect x="11" y="11" width="2" height="1" fill="#1e130a"/><rect x="0" y="8" width="2" height="1" fill="#1e130a"/><rect x="22" y="8" width="2" height="1" fill="#1e130a"/><rect x="4" y="15" width="16" height="1" fill="#1e130a"/></svg>',
    main, main, main
  )
}
