/**
 * Conventional Commits enforcement.
 * Examples:
 *   feat(auth): add email verification
 *   fix(chat): resolve websocket reconnect issue
 *   docs(prd): update MVP scope
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        // apps
        "api",
        "mobile",
        "admin",
        // domain modules (as they come online, per TEC-001)
        "auth",
        "identity",
        "hotspot",
        "discovery",
        "matching",
        "chat",
        "safety",
        "business",
        "verification",
        "storage",
        // cross-cutting
        "infra",
        "ci",
        "docs",
        "config",
        "deps",
        "repo"
      ]
    ],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]
    ]
  }
};
