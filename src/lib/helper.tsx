import React from "react";
// We use the Prism build because it supports a massive variety of languages accurately
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// You can swap this out for one-dark, dracula, etc.
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// Detect language from generated code
export const detectLanguage = (code: string): string => {
  if (
    code.includes("import React") ||
    code.includes("useState") ||
    code.includes("useEffect") ||
    code.includes("jsx") ||
    code.includes("tsx")
  ) {
    return code.includes("interface") ||
      code.includes(": string") ||
      code.includes(": number")
      ? "typescript"
      : "javascript";
  }
  if (
    code.includes("def ") ||
    (code.includes("import ") && code.includes("from "))
  )
    return "python";
  if (
    code.includes("<?php") ||
    code.includes("$_GET") ||
    code.includes("$_POST")
  )
    return "php";
  if (
    code.includes("package ") ||
    (code.includes("func ") && code.includes("go"))
  )
    return "go";
  if (
    code.includes("fn ") ||
    code.includes("let mut") ||
    code.includes("impl ")
  )
    return "rust";
  if (code.includes("public class") || code.includes("public static void"))
    return "java";
  if (code.includes("using System") || code.includes("namespace "))
    return "csharp";
  if (
    code.includes("SELECT") ||
    code.includes("INSERT INTO") ||
    code.includes("CREATE TABLE")
  )
    return "sql";
  if (code.includes("<html") || code.includes("<!DOCTYPE")) return "html";
  if (
    code.includes("display:") ||
    code.includes("background:") ||
    code.includes(".class")
  )
    return "css";
  if (code.includes("#!/bin/bash") || code.includes("#!/bin/sh")) return "bash";
  return "javascript";
};

// Syntax highlighting function

export const highlightCode = (
  line: string,
  language: string = "javascript",
) => {
  if (!line.trim()) return line;

  // Language aliases
  const langMap: Record<string, string> = {
    js: "javascript",
    javascript: "javascript",
    ts: "javascript",
    py: "python",
    python: "python",
    rb: "ruby",
    ruby: "ruby",
    cs: "csharp",
    "c#": "csharp",
    csharp: "csharp",
    sh: "bash",
    bash: "bash",
    golang: "go",
    go: "go",
    html: "html",
    htm: "html",
  };

  const lang = langMap[language.toLowerCase()] || "javascript";

  // Keyword sets
  const keywords: Record<string, string[]> = {
    javascript: [
      "import",
      "export",
      "default",
      "from",
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "try",
      "catch",
      "async",
      "await",
      "class",
      "extends",
      "new",
      "this",
      "typeof",
      "instanceof",
      "switch",
      "case",
      "break",
      "continue",
    ],

    python: [
      "def",
      "return",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "import",
      "from",
      "as",
      "class",
      "try",
      "except",
      "finally",
      "with",
      "lambda",
      "pass",
      "break",
      "continue",
    ],

    ruby: [
      "def",
      "end",
      "class",
      "module",
      "if",
      "elsif",
      "else",
      "unless",
      "while",
      "do",
      "begin",
      "rescue",
      "ensure",
      "return",
      "yield",
    ],

    csharp: [
      "using",
      "namespace",
      "class",
      "public",
      "private",
      "protected",
      "void",
      "int",
      "string",
      "bool",
      "return",
      "if",
      "else",
      "for",
      "while",
      "new",
    ],

    go: [
      "package",
      "import",
      "func",
      "return",
      "if",
      "else",
      "for",
      "range",
      "struct",
      "interface",
      "go",
      "defer",
      "map",
    ],

    bash: [
      "if",
      "then",
      "else",
      "fi",
      "for",
      "do",
      "done",
      "case",
      "esac",
      "function",
      "echo",
      "exit",
    ],

    html: [],
  };

  const reactKeywords = [
    "useState",
    "useEffect",
    "useCallback",
    "useMemo",
    "useRef",
    "useContext",
    "React",
  ];

  const activeKeywords = keywords[lang] || [];

  const keywordPattern = `\\b(?:${[...activeKeywords, ...reactKeywords].join("|")})\\b`;

  const tokenRegex = new RegExp(
    `(${keywordPattern}|'[^']*'|"[^"]*"|\`[^\\\`]*\`|\\/\\/.*$|#.*$|\\/\\*[\\s\\S]*?\\*\\/|\\b\\d+(?:\\.\\d+)?\\b|=>|[{}()[\\];,.=+\\-*/<>!&|]+|\\s+)`,
    "g",
  );

  const tokens = line.split(tokenRegex).filter(Boolean);

  const parts: React.ReactNode[] = [];

  tokens.forEach((token, i) => {
    // Comments
    if (
      token.startsWith("//") ||
      token.startsWith("/*") ||
      token.startsWith("#")
    ) {
      parts.push(
        <span key={i} className="text-gray-500 italic">
          {token}
        </span>,
      );
    }

    // Strings
    else if (/^['"`]/.test(token)) {
      parts.push(
        <span key={i} className="text-green-400">
          {token}
        </span>,
      );
    }

    // Numbers
    else if (/^\d+(\.\d+)?$/.test(token)) {
      parts.push(
        <span key={i} className="text-orange-400">
          {token}
        </span>,
      );
    }

    // Keywords
    else if (activeKeywords.includes(token)) {
      parts.push(
        <span key={i} className="text-purple-400">
          {token}
        </span>,
      );
    }

    // React keywords
    else if (reactKeywords.includes(token)) {
      parts.push(
        <span key={i} className="text-cyan-400">
          {token}
        </span>,
      );
    }

    // Function names
    else if (/^[A-Za-z_$][\w$]*$/.test(token)) {
      let isFunction = false;

      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j].trim() === "") continue;

        if (tokens[j].startsWith("(")) {
          isFunction = true;
        }
        break;
      }

      if (isFunction) {
        parts.push(
          <span key={i} className="text-blue-400">
            {token}
          </span>,
        );
      } else {
        parts.push(
          <span key={i} className="text-gray-100">
            {token}
          </span>,
        );
      }
    }

    // Operators / punctuation
    else if (/^[{}()[\];,.=+\-*/<>!&|]+$/.test(token)) {
      parts.push(
        <span key={i} className="text-gray-400">
          {token}
        </span>,
      );
    }

    // Default
    else {
      parts.push(<span key={i}>{token}</span>);
    }
  });

  return <>{parts}</>;
};
