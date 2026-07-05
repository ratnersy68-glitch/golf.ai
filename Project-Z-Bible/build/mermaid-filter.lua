-- Pandoc Lua filter: replaces ```mermaid fenced code blocks with pre-rendered
-- images from assets/images/diagrams/, in the fixed chapter order documented in
-- diagrams/README.md. Must be run with the working directory set to the project
-- root (build/export-pdf.sh and build/export-docx.sh both do this).
--
-- If a rendered image isn't found (e.g. build/render-diagrams.sh was never run
-- because mermaid-cli isn't installed), the original code block is left as-is
-- so the export still succeeds -- just with the diagram shown as source text
-- instead of a rendered image.

local order = {
  "build-arc",
  "dyno-sheet-anatomy",
  "cooling-system",
  "phase1-scope",
  "transmission-decision",
  "budget-pie",
  "suspension-geometry",
  "brake-heat-management",
  "turbo-system-flow",
  "driving-decision",
}

local idx = 0

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

  idx = idx + 1
  local name = order[idx]
  if not name then
    return el
  end

  local path = "assets/images/diagrams/" .. name .. ".svg"
  if not file_exists(path) then
    return el
  end

  return pandoc.Para({ pandoc.Image({ pandoc.Str(name .. " diagram") }, path, name) })
end
