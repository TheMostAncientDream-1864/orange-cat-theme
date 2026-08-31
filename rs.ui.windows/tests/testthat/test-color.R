test_that("Color utility functions calculate derivatives correctly", {
  # Test hex_to_rgb
  rgb <- hex_to_rgb("#dc6601")
  expect_equal(rgb["r"], c(r = 220))
  expect_equal(rgb["g"], c(g = 102))
  expect_equal(rgb["b"], c(b = 1))

  # Test rgb_to_hex
  expect_equal(rgb_to_hex(c(220, 102, 1)), "#dc6601")

  # Test lighten and darken
  lighter <- lighten_hex("#dc6601", 0.3)
  darker <- darken_hex("#dc6601", 0.3)
  expect_true(is.character(lighter) && nchar(lighter) == 7)
  expect_true(is.character(darker) && nchar(darker) == 7)
  expect_false(identical(lighter, darker))

  # Test derive_theme_palette
  palette <- derive_theme_palette("#dc6601")
  expect_equal(palette$main_color, "#dc6601")
  expect_true(!is.null(palette$light_color))
  expect_true(!is.null(palette$dark_color))
  expect_true(!is.null(palette$bg_tint))
  expect_true(grepl("rgba\\(", palette$bg_tint))
})
