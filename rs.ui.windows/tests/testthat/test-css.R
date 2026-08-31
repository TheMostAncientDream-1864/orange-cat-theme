test_that("CSS generation incorporates tokens and cat SVG data URI", {
  svg_path <- system.file("assets", "cat.svg", package = "rs.ui.windows")
  if (!file.exists(svg_path)) {
    svg_path <- file.path("..", "..", "inst", "assets", "cat.svg")
  }

  css <- generate_theme_css(main_color = "#dc6601", cat_svg_path = svg_path)

  # Check that main color token is replaced
  expect_true(grepl("#dc6601", css, fixed = TRUE))

  # Check that cat SVG data URI is injected
  expect_true(grepl("data:image/svg\\+xml;base64,", css))

  # Check that header pixel cat selector is present
  expect_true(grepl("#rstudio_shell::before", css, fixed = TRUE) || grepl("body::before", css, fixed = TRUE))

  # Check that active tab indicator is styled
  expect_true(grepl("gwt-TabLayoutPanelTab-selected", css, fixed = TRUE))
})
