test_that("Backup and restore lifecycle operates cleanly on mock RStudio directory", {
  # Create a sandbox directory representing RStudio layout
  temp_rstudio <- file.path(tempdir(), paste0("mock_rstudio_", as.integer(runif(1, 1000, 9999))))
  www_dir <- file.path(temp_rstudio, "resources", "app", "resources", "www")
  dir.create(www_dir, recursive = TRUE, showWarnings = FALSE)

  index_file <- file.path(www_dir, "index.htm")
  original_html <- "<!DOCTYPE html><html><head><title>RStudio</title></head><body><div id='rstudio_container'></div></body></html>"
  writeLines(original_html, index_file)

  # Mock detection object
  mock_detect <- list(
    detected = TRUE,
    rstudio_dir = temp_rstudio,
    index_htm = index_file,
    www_dir = www_dir,
    version = "2026.01.0-mock",
    architecture = "electron",
    is_running = FALSE,
    is_writable = TRUE,
    status_message = "Mock RStudio"
  )

  # Test backup creation
  backup_res <- create_ui_backup(mock_detect)
  expect_true(backup_res$success)
  expect_true(file.exists(file.path(backup_res$backup_dir, "index.htm")))
  expect_true(file.exists(file.path(backup_res$backup_dir, "metadata.json")))

  # Test dry run
  dry_res <- rs.ui(main_color = "#dc6601", custom_path = temp_rstudio, dry_run = TRUE)
  expect_true(dry_res$dry_run)

  # Clean up mock sandbox
  unlink(temp_rstudio, recursive = TRUE)
})
