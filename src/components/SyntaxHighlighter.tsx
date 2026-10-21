import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import diff from "react-syntax-highlighter/dist/esm/languages/prism/diff";
import graphql from "react-syntax-highlighter/dist/esm/languages/prism/graphql";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import scss from "react-syntax-highlighter/dist/esm/languages/prism/scss";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";

// The full `Prism` build bundles every grammar Prism has (~600 kB of JS that was
// parsed on every blog and project page). The light build only carries the
// languages registered here; anything else still renders, just without colors.
// No "use client": imported from a server component (blog posts) it highlights on
// the server and ships no JS at all.
const languages = {
  bash,
  sh: bash,
  shell: bash,
  css,
  diff,
  graphql,
  javascript,
  js: javascript,
  json,
  jsx,
  markdown,
  md: markdown,
  markup,
  html: markup,
  xml: markup,
  python,
  py: python,
  scss,
  sql,
  tsx,
  typescript,
  ts: typescript,
  yaml,
  yml: yaml,
};

for (const [name, grammar] of Object.entries(languages)) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}

export default SyntaxHighlighter;
