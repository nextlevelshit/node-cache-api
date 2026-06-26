import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

/**
 * HTML Template Service
 * Simple template rendering with {{key}} placeholder replacement.
 */

export interface HtmlOptions {
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Base path for template files (default: current directory) */
  basePath?: string | null;
}

export class Html {
  options: HtmlOptions;
  basePath: string;

  constructor(options: HtmlOptions = { debug: false, basePath: null }) {
    this.options = options;
    this.basePath = options.basePath || dirname(fileURLToPath(import.meta.url));
  }

  /**
   * Render a template with replacements
   * @param templatePath - Path to template file (Note: relative to basePath or absolute to current directory)
   * @param replacements - Key-value pairs for placeholder replacement
   * @returns Rendered HTML string
   */
  render(
    templatePath: string,
    replacements: Record<string, unknown> = {},
  ): string {
    if (!templatePath) {
      throw new Error("Template path is required");
    }

    const template = this.readFile(templatePath);
    return this.replace(template, replacements);
  }

  /**
   * Read template file from disk
   * @param filePath - Path to template file
   * @returns Template content
   */
  readFile(filePath: string): string {
    const fullPath = join(this.basePath, filePath);

    try {
      return readFileSync(fullPath, "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read template file: ${filePath} - ${message}`);
    }
  }

  /**
   * Replace placeholders in template with values
   * @param template - Template string with {{key}} placeholders
   * @param replacements - Replacement values
   * @returns Processed template
   */
  replace(template: string, replacements: Record<string, unknown>): string {
    if (!template) {
      throw new Error("Template content is required");
    }

    if (!replacements || typeof replacements !== "object") {
      throw new Error("Replacements must be an object");
    }

    return Object.entries(replacements).reduce((html, [key, value]) => {
      if (value === undefined || value === null) {
        this.log(
          `Warning: Replacing ${key} with empty string (value was ${value})`,
        );
        value = "";
      }

      // Convert non-string values to strings safely
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      const regex = new RegExp(`{{\\s*${this.escapeRegex(key)}\\s*}}`, "g");
      return html.replace(regex, stringValue);
    }, template);
  }

  /**
   * Escape special regex characters in replacement keys
   * @param string - String to escape
   * @returns Escaped string
   */
  escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Log debug messages
   * @param message - Message to log
   */
  log(message: string): void {
    if (this.options.debug) {
      console.log(`[Html] ${message}`);
    }
  }
}
