-- Pandoc Lua filter: replaces ```mermaid fenced code blocks with pre-rendered
-- images from assets/images/diagrams/. Must be run with the working directory
-- set to the project root (build/export-pdf.sh and build/export-docx.sh both
-- do this).
--
-- Each mermaid code block in the chapters carries a leading comment line like:
--   %% diagram-id: build-arc
-- which maps 1:1 to a source file at diagrams/build-arc.mmd and, once rendered
-- by build/render-diagrams.sh, an image at assets/images/diagrams/build-arc.png.
-- This filter reads that id straight out of the block's own text -- it does
-- NOT rely on counting/ordering blocks -- so adding, removing, or reordering
-- diagrams in the chapters never desyncs the mapping.
--
-- PNG, not SVG: Mermaid's default renderer draws node labels as HTML inside
-- an SVG <foreignObject>, which the SVG-to-PDF path pandoc/rsvg-convert use
-- can't read, leaving blank boxes. A PNG is a screenshot of the actual
-- rendered pixels, so text always shows up correctly -- see
-- build/render-diagrams.sh for the full explanation.
--
-- If a block has no diagram-id comment, or its rendered image isn't found
-- (e.g. build/render-diagrams.sh was never run because mermaid-cli isn't
-- installed), the original code block is left as-is so the export still
-- succeeds -- just with the diagram shown as source text instead of an image.

local function file_exists(path)
  local f = io.open(path, "r")
  if f then
    f:close()
    return true
  end
  return false
end

function CodeBlock(el)
  local is_mermaid = false
  for _, class in ipairs(el.classes) do
    if class == "mermaid" then
      is_mermaid = true
    end
  end
  if not is_mermaid then
    return el
  end

  local name = el.text:match("%%%%%s*diagram%-id:%s*([%w%-]+)")
  if not name then
    return el
  end

  local path = "assets/images/diagrams/" .. name .. ".png"
  if not file_exists(path) then
    return el
  end

  return pandoc.Para({ pandoc.Image({ pandoc.Str(name .. " diagram") }, path, name) })
end
