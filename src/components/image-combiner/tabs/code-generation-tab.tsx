import { highlightCode } from "@/lib/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  SvgCopyCodeIcon,
  SvgSuggestionIcon,
  SvgExpandIcon,
  SvgGeneratingIcon,
  SvgGenerateIcon,
} from "../icons";

interface CodeGenerationTabProps {
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  isGeneratingCode: boolean;
  codePrompt: string;
  setCodePrompt: (prompt: string) => void;
  handleGenerateCode: () => void;
  codeLanguage: string;
  handleLanguageChange: (lang: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  showToast: (message: string, type: "success" | "error" | undefined) => void;
}

export const CodeGenerationTab = ({
  generatedCode,
  setGeneratedCode,
  isGeneratingCode,
  codePrompt,
  setCodePrompt,
  handleGenerateCode,
  codeLanguage,
  handleLanguageChange,
  showSuggestions,
  setShowSuggestions,
  showToast,
}: CodeGenerationTabProps) => {
  return (
    <div className="space-y-6 w-full px-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">AI Code Generation</h2>
          {generatedCode && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                showToast("Code copied to clipboard!", "success");
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <SvgCopyCodeIcon />
              Copy Code
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-2">
              <SvgSuggestionIcon />
              <span className="text-yellow-300 font-semibold text-sm">
                Quick Suggestions
              </span>
              <span className="text-yellow-400/60 text-xs">
                (Click to expand)
              </span>
            </div>
            <SvgExpandIcon showSuggestions={showSuggestions} />
          </button>

          {showSuggestions && (
            <div className="px-4 pb-4 pt-2 bg-linear-to-r from-yellow-500/5 to-orange-500/5 border-t border-yellow-500/20 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Write a JavaScript function to validate email addresses",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    📧 Email Validator
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Validate email format
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Create a React hook for fetching data with loading and error states",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    ⚛️ Custom Hook
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Data fetching hook
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Write a Python function to sort a list of dictionaries by a specific key",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    🐍 Python Sort
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Sort dictionaries
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Create a debounce function in JavaScript for search input",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    ⏱️ Debounce
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Optimize search input
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Write a TypeScript interface for a user profile with nested address object",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    📝 TS Interface
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    User profile types
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Create a CSS flexbox layout with centered content and responsive design",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    🎨 Flexbox Layout
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Responsive center
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Write a SQL query to join two tables and aggregate data",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    🗄️ SQL Join
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Join & aggregate
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Create a Node.js Express middleware for authentication",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    🔐 Auth Middleware
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Express auth
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCodePrompt(
                      "Write a regex pattern to validate phone numbers in various formats",
                    );
                    setShowSuggestions(false);
                  }}
                  className="text-left px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-yellow-100 text-xs transition-all group"
                >
                  <span className="block font-medium mb-0.5 group-hover:text-yellow-300">
                    📞 Phone Regex
                  </span>
                  <span className="text-yellow-200/60 text-[10px]">
                    Format validation
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* placeholder */}
        <div className="grid grid-cols-1 gap-4 max-w-[1800px] mx-auto">
          {/* Input Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe the code you want to generate
              </label>
              <textarea
                value={codePrompt}
                onChange={(e) => setCodePrompt(e.target.value)}
                disabled={isGeneratingCode}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
                placeholder="Example: Create a React component that displays a todo list with add, delete, and mark as complete functionality"
              />
            </div>
            <button
              onClick={() => handleGenerateCode()}
              disabled={!codePrompt.trim() || isGeneratingCode}
              className="w-full py-3 bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-yellow-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingCode ? (
                <>
                  <SvgGeneratingIcon />
                  Generating...
                </>
              ) : (
                <>
                  <SvgGenerateIcon />
                  Generate Code
                </>
              )}
            </button>
          </div>

          {/* Language Conversion Tip */}
          {generatedCode && (
            <div className="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-yellow-300 text-sm font-medium mb-1">
                  💡 Transform & Test Across Languages
                </p>
                <p className="text-yellow-200/80 text-xs">
                  Change the language dropdown below to instantly convert your
                  code to another language. Perfect for testing implementations
                  across different tech stacks!
                </p>
              </div>
            </div>
          )}

          {/* Output Section */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden code-container">
            <div className="bg-gray-800/50 px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                </div>
                <Select
                  value={codeLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[140px] h-7 bg-gray-700/50 text-gray-100 text-xs border-gray-600 focus:ring-1 focus:ring-yellow-500 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                    <SelectItem
                      value="javascript"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        <span className="text-gray-100">JavaScript</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="typescript"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">●</span>
                        <span className="text-gray-100">TypeScript</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="python"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        <span className="text-gray-100">Python</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="java"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-red-400">●</span>
                        <span className="text-gray-100">Java</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="csharp"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        <span className="text-gray-100">C#</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="go"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">●</span>
                        <span className="text-gray-100">Go</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="rust"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400">●</span>
                        <span className="text-gray-100">Rust</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="php"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400">●</span>
                        <span className="text-gray-100">PHP</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="ruby"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">●</span>
                        <span className="text-gray-100">Ruby</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="html"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">●</span>
                        <span className="text-gray-100">HTML</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="css"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">●</span>
                        <span className="text-gray-100">CSS</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="sql"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">●</span>
                        <span className="text-gray-100">SQL</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="bash"
                      className="text-xs cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">●</span>
                        <span className="text-gray-100">Bash</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-gray-500">
                  {generatedCode
                    ? `${generatedCode.split("\n").length} lines`
                    : "Editable"}
                </span>
              </div>
            </div>

            <div className="relative bg-[#0d1117] h-[600px] overflow-auto">
              <div className="relative min-h-full">
                {/* Line Numbers */}
                {generatedCode && (
                  <div className="absolute left-0 top-0 w-14 bg-[#161b22] border-r border-gray-700/50 py-4 px-2 text-right select-none z-10">
                    {generatedCode.split("\n").map((_, i) => (
                      <div
                        key={i}
                        className="text-xs text-gray-600 leading-6 font-mono"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Display with Syntax Highlighting */}
                <div
                  className={`relative min-h-full ${
                    generatedCode ? "pl-16" : ""
                  }`}
                >
                  <pre className="w-full p-4 m-0">
                    <code
                      className="font-mono text-sm leading-6 block"
                      style={{
                        color: "#c9d1d9",
                        tabSize: 2,
                      }}
                    >
                      {generatedCode ? (
                        generatedCode.split("\n").map((line, i) => (
                          <div
                            key={i}
                            className="whitespace-pre hover:bg-gray-800/30"
                            style={{ minHeight: "1.5rem" }}
                          >
                            {highlightCode(line, codeLanguage)}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-600">
                          {`// Your generated code will appear here...
      //
      // Example output:
      function greet(name) {
        return \`Hello, \${name}!\`;
      }`}
                        </span>
                      )}
                    </code>
                  </pre>
                  {/* Hidden textarea for editing */}
                  {generatedCode && (
                    <textarea
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text font-mono text-sm leading-6 p-4 pl-16 resize-none bg-transparent selection:bg-blue-500/30 selection:text-white"
                      style={{ caretColor: "white" }}
                      spellCheck={false}
                      onFocus={(e) => {
                        e.currentTarget.style.opacity = "0.05";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.opacity = "0";
                        e.currentTarget.style.background = "transparent";
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {generatedCode && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> You can edit the generated code directly
              in the output area. Copy it when you&apos;re ready!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
