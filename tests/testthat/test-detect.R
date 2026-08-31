test_that("rs.ui.detect resolves standard Electron resources/app/www layout", {
  temp_rstudio <- file.path(tempdir(), paste0("mock_rs_electron_", as.integer(runif(1, 10000, 99999))))
  www_dir <- file.path(temp_rstudio, "resources", "app", "www")
  dir.create(www_dir, recursive = TRUE, showWarnings = FALSE)

  index_file <- file.path(www_dir, "index.htm")
  writeLines("<!DOCTYPE html><html><head></head><body></body></html>", index_file)

  # Also add mock package.json for version detection
  pkg_json <- file.path(temp_rstudio, "resources", "app", "package.json")
  writeLines('{"name": "rstudio", "version": "2026.01.0"}', pkg_json)

  detected <- rs.ui.detect(custom_path = temp_rstudio)

  expect_true(detected$detected)
  expect_equal(normalizePath(detected$rstudio_dir, winslash = "/"), normalizePath(temp_rstudio, winslash = "/"))
  expect_equal(normalizePath(detected$index_htm, winslash = "/"), normalizePath(index_file, winslash = "/"))
  expect_equal(normalizePath(detected$www_dir, winslash = "/"), normalizePath(www_dir, winslash = "/"))
  expect_equal(detected$architecture, "electron")
  expect_equal(detected$version, "2026.01.0")

  # Clean up
  unlink(temp_rstudio, recursive = TRUE)
})

test_that("rs.ui.detect resolves alternate and legacy layouts in proper priority", {
  # 1. Test nested resources/app/resources/www layout
  temp_nested <- file.path(tempdir(), paste0("mock_rs_nested_", as.integer(runif(1, 10000, 99999))))
  nested_www <- file.path(temp_nested, "resources", "app", "resources", "www")
  dir.create(nested_www, recursive = TRUE, showWarnings = FALSE)
  writeLines("<html></html>", file.path(nested_www, "index.htm"))

  res_nested <- rs.ui.detect(custom_path = temp_nested)
  expect_true(res_nested$detected)
  expect_equal(res_nested$architecture, "electron")
  expect_equal(normalizePath(res_nested$index_htm, winslash = "/"), normalizePath(file.path(nested_www, "index.htm"), winslash = "/"))
  unlink(temp_nested, recursive = TRUE)

  # 2. Test legacy Qt layout: www/index.htm
  temp_qt <- file.path(tempdir(), paste0("mock_rs_qt_", as.integer(runif(1, 10000, 99999))))
  qt_www <- file.path(temp_qt, "www")
  dir.create(qt_www, recursive = TRUE, showWarnings = FALSE)
  writeLines("<html></html>", file.path(qt_www, "index.htm"))

  res_qt <- rs.ui.detect(custom_path = temp_qt)
  expect_true(res_qt$detected)
  expect_equal(res_qt$architecture, "qt")
  expect_equal(normalizePath(res_qt$index_htm, winslash = "/"), normalizePath(file.path(qt_www, "index.htm"), winslash = "/"))
  unlink(temp_qt, recursive = TRUE)
})

test_that("rs.ui.detect handles invalid or non-existent directories gracefully", {
  fake_dir <- file.path(tempdir(), "non_existent_rstudio_dir_12345")
  detected <- rs.ui.detect(custom_path = fake_dir)
  expect_false(detected$detected)
  expect_true(is.na(detected$rstudio_dir) || !nzchar(detected$rstudio_dir))
})
