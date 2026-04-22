import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// getToolLabel — pure function tests
// ---------------------------------------------------------------------------

describe("getToolLabel – str_replace_editor", () => {
  test("create command returns Creating <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "create", path: "src/Card.jsx" }))
      .toBe("Creating Card.jsx");
  });

  test("str_replace command returns Editing <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.tsx" }))
      .toBe("Editing App.tsx");
  });

  test("insert command returns Editing <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/App.tsx" }))
      .toBe("Editing App.tsx");
  });

  test("view command returns Reading <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "view", path: "README.md" }))
      .toBe("Reading README.md");
  });

  test("undo_edit command returns Undoing changes to <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "src/App.tsx" }))
      .toBe("Undoing changes to App.tsx");
  });

  test("unrecognised command returns Processing <filename>", () => {
    expect(getToolLabel("str_replace_editor", { command: "other", path: "src/App.tsx" }))
      .toBe("Processing App.tsx");
  });

  test("extracts filename from a nested Unix path", () => {
    expect(getToolLabel("str_replace_editor", { command: "create", path: "src/components/ui/Button.tsx" }))
      .toBe("Creating Button.tsx");
  });

  test("extracts filename from a Windows-style path", () => {
    expect(getToolLabel("str_replace_editor", { command: "view", path: "C:\\Users\\user\\project\\App.tsx" }))
      .toBe("Reading App.tsx");
  });

  test("missing path falls back to 'file'", () => {
    expect(getToolLabel("str_replace_editor", { command: "create" }))
      .toBe("Creating file");
  });

  test("null args falls back to 'file'", () => {
    expect(getToolLabel("str_replace_editor", null))
      .toBe("Processing file");
  });

  test("empty args object falls back to 'file'", () => {
    expect(getToolLabel("str_replace_editor", {}))
      .toBe("Processing file");
  });
});

describe("getToolLabel – unknown tools", () => {
  test("returns the raw tool name for an unrecognised tool", () => {
    expect(getToolLabel("bash", { command: "ls -la" })).toBe("bash");
  });

  test("returns the raw tool name when args are empty", () => {
    expect(getToolLabel("web_search", {})).toBe("web_search");
  });
});

// ---------------------------------------------------------------------------
// ToolCallBadge — component tests
// ---------------------------------------------------------------------------

describe("ToolCallBadge – loading states", () => {
  test("shows spinner when state is 'call'", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "Card.jsx" }}
        state="call"
      />
    );
    expect(screen.getByTestId("tool-loading")).toBeDefined();
    expect(screen.queryByTestId("tool-complete")).toBeNull();
  });

  test("shows spinner when state is 'partial-call'", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "str_replace", path: "App.tsx" }}
        state="partial-call"
      />
    );
    expect(screen.getByTestId("tool-loading")).toBeDefined();
    expect(screen.queryByTestId("tool-complete")).toBeNull();
  });

  test("shows spinner when state is 'result' but result is absent", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "Card.jsx" }}
        state="result"
      />
    );
    expect(screen.getByTestId("tool-loading")).toBeDefined();
    expect(screen.queryByTestId("tool-complete")).toBeNull();
  });

  test("shows spinner when state is 'result' but result is falsy", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "Card.jsx" }}
        state="result"
        result=""
      />
    );
    expect(screen.getByTestId("tool-loading")).toBeDefined();
  });
});

describe("ToolCallBadge – complete state", () => {
  test("shows green dot when state is 'result' and result is present", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "Card.jsx" }}
        state="result"
        result="File created successfully."
      />
    );
    expect(screen.getByTestId("tool-complete")).toBeDefined();
    expect(screen.queryByTestId("tool-loading")).toBeNull();
  });
});

describe("ToolCallBadge – label rendering", () => {
  test("renders 'Creating <filename>' for a create command", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "src/Card.jsx" }}
        state="result"
        result="ok"
      />
    );
    expect(screen.getByText("Creating Card.jsx")).toBeDefined();
  });

  test("renders 'Editing <filename>' for a str_replace command", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "str_replace", path: "src/App.tsx" }}
        state="call"
      />
    );
    expect(screen.getByText("Editing App.tsx")).toBeDefined();
  });

  test("renders 'Editing <filename>' for an insert command", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "insert", path: "src/App.tsx" }}
        state="call"
      />
    );
    expect(screen.getByText("Editing App.tsx")).toBeDefined();
  });

  test("renders 'Reading <filename>' for a view command", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "view", path: "CLAUDE.md" }}
        state="call"
      />
    );
    expect(screen.getByText("Reading CLAUDE.md")).toBeDefined();
  });

  test("renders 'Undoing changes to <filename>' for an undo_edit command", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "undo_edit", path: "src/index.ts" }}
        state="call"
      />
    );
    expect(screen.getByText("Undoing changes to index.ts")).toBeDefined();
  });

  test("renders the raw tool name for an unknown tool", () => {
    render(
      <ToolCallBadge
        toolName="bash"
        args={{ command: "ls" }}
        state="result"
        result="output"
      />
    );
    expect(screen.getByText("bash")).toBeDefined();
  });
});
