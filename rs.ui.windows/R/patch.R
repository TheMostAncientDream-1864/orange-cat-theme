#' Safe Patching Routine for RStudio Windows Desktop UI
#'
#' Executes the verified patch workflow:
#' detect -> validate -> backup -> patch -> verify
#'
#' @keywords internal
apply_ui_patch <- function(main_color = "#dc6601",
                           cat_svg_path = NULL,
                           custom_path = NULL,
                           dry_run = FALSE) {
  # 1. DETECT
  detected <- rs.ui.detect(custom_path = custom_path)

  if (!isTRUE(detected$detected)) {
    stop("Patch aborted: Unable to locate RStudio Desktop installation.\n",
         detected$status_message, "\n",
         "If installed in a custom path, supply: rs.ui(custom_path = 'C:/MyCustom/RStudio')",
         call. = FALSE)
  }

  cat("==> Detected RStudio installation:", detected$rstudio_dir, "\n")
  cat("==> Architecture:", detected$architecture, "| Version:", detected$version, "\n")
  cat("==> UI Entrypoint:", detected$index_htm, "\n")

  # 2. VALIDATE RUNNING STATE & PERMISSIONS
  if (isTRUE(detected$is_running)) {
    warning("RStudio is currently running.\n",
            "Please close RStudio before applying the UI patch, or restart it afterward for changes to take effect.",
            call. = FALSE)
  }

  if (!isTRUE(detected$is_writable) && !dry_run) {
    elevated_cmd <- sprintf(
      'Start-Process R.exe -ArgumentList "-e \\"rs.ui.windows::rs.ui(main_color=\'%s\')\\"" -Verb RunAs',
      main_color
    )
    stop("Write permission denied for target files in:\n",
         detected$rstudio_dir, "\n\n",
         "Administrator privileges are required because RStudio is installed in Program Files.\n",
         "To resolve this, open PowerShell as Administrator and run:\n\n",
         elevated_cmd, "\n",
         call. = FALSE)
  }

  # DRY RUN REPORTING
  if (isTRUE(dry_run)) {
    storage_dir <- get_user_storage_dir()
    cat("\n------------------------------------------------------------\n")
    cat("  rs.ui.windows DRY-RUN VERIFICATION (No files modified)\n")
    cat("------------------------------------------------------------\n")
    cat("RStudio detected       : TRUE\n")
    cat("Installation directory : ", detected$rstudio_dir, "\n", sep = "")
    cat("Target HTML entrypoint : ", detected$index_htm, "\n", sep = "")
    cat("Target CSS destination : ", file.path(detected$www_dir, "rs.ui.css"), "\n", sep = "")
    cat("Backup storage target  : ", file.path(storage_dir, "backups"), "\n", sep = "")
    cat("Theme accent color     : ", main_color, "\n", sep = "")
    cat("Orange Pixel Cat       : Embedded SVG Base64 (top header placement)\n")
    cat("Permissions writable   : ", detected$is_writable, "\n", sep = "")
    cat("------------------------------------------------------------\n")
    cat("Dry run completed successfully. Pass dry_run = FALSE to apply.\n\n")
    return(invisible(list(success = TRUE, dry_run = TRUE, info = detected)))
  }

  # 3. BACKUP (Mandatory & Verified)
  backup_res <- create_ui_backup(detected, force = FALSE)
  if (!isTRUE(backup_res$success)) {
    stop("Patch aborted: Backup operation failed. No modifications were made.", call. = FALSE)
  }

  # 4. GENERATE CSS & WRITE TO WWW DIRECTORY
  target_css <- file.path(detected$www_dir, "rs.ui.css")
  generated_css <- generate_theme_css(
    main_color = main_color,
    cat_svg_path = cat_svg_path,
    output_file = target_css
  )

  # Also save a copy in user storage for reference
  storage_dir <- get_user_storage_dir()
  local_gen_css <- file.path(storage_dir, "generated", "theme.css")
  generate_theme_css(main_color = main_color, cat_svg_path = cat_svg_path, output_file = local_gen_css)

  # 5. PATCH INDEX.HTM
  index_content <- paste(readLines(detected$index_htm, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  link_tag <- '<link rel="stylesheet" id="rs-ui-custom-theme" href="rs.ui.css" type="text/css" />'

  if (!grepl("rs-ui-custom-theme", index_content, fixed = TRUE)) {
    # Insert before </head>
    if (grepl("</head>", index_content, ignore.case = TRUE)) {
      new_index <- sub("(?i)</head>", paste0("  ", link_tag, "\n</head>"), index_content, perl = TRUE)
    } else {
      # Append at end if no </head>
      new_index <- paste0(index_content, "\n", link_tag)
    }

    tryCatch({
      writeLines(new_index, detected$index_htm, useBytes = TRUE)
    }, error = function(e) {
      # If patch failed, attempt rollback immediately
      rs.ui.restore(custom_path = detected$rstudio_dir)
      stop("Failed writing to index.htm. Rollback executed: ", e$message, call. = FALSE)
    })
  }

  # 6. VERIFY PATCH
  patched_index <- paste(readLines(detected$index_htm, warn = FALSE, encoding = "UTF-8"), collapse = "\n")
  if (!grepl("rs-ui-custom-theme", patched_index, fixed = TRUE) || !file.exists(target_css)) {
    rs.ui.restore(custom_path = detected$rstudio_dir)
    stop("Patch verification failed! Original state automatically restored.", call. = FALSE)
  }

  cat("==> Patch applied and verified successfully!\n")
  cat("==> Orange Pixel Cat is now embedded in RStudio Desktop header.\n")
  cat("==> Restart RStudio to enjoy your new customized UI!\n")

  invisible(list(
    success = TRUE,
    rstudio_dir = detected$rstudio_dir,
    version = detected$version,
    main_color = main_color,
    css_file = target_css
  ))
}
