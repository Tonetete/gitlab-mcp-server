# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in the `dist/` directory
- **Development**: `npm run dev` - Runs the server directly with ts-node for development
- **Watch mode**: `npm run watch` - Uses nodemon to auto-restart on file changes during development
- **Start**: `npm run start` - Runs the compiled server from `dist/index.js`

## Architecture Overview

This is a GitLab MCP (Model Context Protocol) Server that provides GitLab API integration through standardized tools. The server follows a modular architecture:

### Core Components

- **`src/index.ts`**: Main server entry point that initializes the MCP server, loads environment configuration, and sets up tool routing
- **`src/gitlab-client.ts`**: Core GitLab API client wrapper using axios for HTTP requests. Handles authentication with Bearer tokens and provides base methods for all GitLab operations
- **`src/tools/`**: Modular tool definitions, each file exports `create*Tools()` and `handle*Tool()` functions

### Tool Architecture

The server organizes GitLab functionality into four main tool categories:

1. **Repository tools** (`tools/repository.ts`): Project listing and details
2. **Branch tools** (`tools/branches.ts`): Branch management (list, create, delete)
3. **Merge Request tools** (`tools/merge-requests.ts`): PR operations (create, list, merge)
4. **File tools** (`tools/files.ts`): Repository file operations (CRUD)

Each tool module follows the same pattern:
- `create*Tools()` returns MCP tool definitions with JSON schemas
- `handle*Tool()` processes tool invocations and calls appropriate GitLabClient methods

### Environment Configuration

Required environment variables:
- `GITLAB_TOKEN`: GitLab personal access token or API token
- `GITLAB_URL`: GitLab API base URL (defaults to https://gitlab.com/api/v4)
- `DEFAULT_PROJECT_ID`: Optional default project for operations

### MCP Server Integration

The server implements the Model Context Protocol using `@modelcontextprotocol/sdk`:
- Communicates via stdio transport
- Registers tools dynamically from all tool modules
- Routes tool calls to appropriate handlers based on tool name
- Returns structured JSON responses or error messages

## Key Implementation Details

- All file content is handled as base64 encoded strings when communicating with GitLab API
- Project IDs can be numeric IDs or path strings (e.g., "username/project-name")
- Error handling returns structured error responses with `isError: true`
- Uses CommonJS modules with TypeScript compilation target ES2022