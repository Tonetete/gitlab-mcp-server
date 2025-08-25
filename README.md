# GitLab MCP Server

A Model Context Protocol (MCP) server that provides GitLab API integration for AI assistants like Claude. This server enables AI agents to interact with GitLab repositories, manage branches, create merge requests, and perform file operations.

## Features

- **Repository Management**: List and get details of GitLab projects
- **Branch Operations**: Create, list, and delete branches
- **Merge Requests**: Create, list, and merge pull requests
- **File Operations**: Read, create, update, and delete repository files
- **Secure Authentication**: Token-based authentication with GitLab API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gitlab-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your GitLab credentials
```

## Configuration

Create a `.env` file with the following variables:

```env
GITLAB_TOKEN=your_gitlab_personal_access_token
GITLAB_URL=https://gitlab.com/api/v4
DEFAULT_PROJECT_ID=your_default_project_id
```

### Environment Variables

- `GITLAB_TOKEN`: Your GitLab personal access token (required)
- `GITLAB_URL`: GitLab API base URL (defaults to https://gitlab.com/api/v4)
- `DEFAULT_PROJECT_ID`: Default project ID for operations (optional)

### Claude Code Configuration

To use this MCP server with Claude Code, you need to configure it in your MCP settings. Create or update the MCP configuration file:

#### Option 1: Project-specific configuration

Create an `mcp.json` file in your project directory:

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": ["/path/to/gitlab-mcp-server/dist/index.js"],
      "env": {
        "GITLAB_TOKEN": "your_gitlab_personal_access_token",
        "GITLAB_URL": "https://gitlab.com/api/v4",
        "DEFAULT_PROJECT_ID": "your_project_id"
      }
    }
  }
}
```

#### Option 2: Global configuration

Add to your global Claude Code configuration file (usually in `~/.config/claude-code/mcp.json` or similar):

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": ["/path/to/gitlab-mcp-server/dist/index.js"],
      "env": {
        "GITLAB_TOKEN": "your_gitlab_personal_access_token",
        "GITLAB_URL": "https://gitlab.com/api/v4"
      }
    }
  }
}
```

**Note**: Replace `/path/to/gitlab-mcp-server` with the actual path where you cloned this repository.

#### Using environment variables instead

For better security, you can reference environment variables in your `mcp.json`:

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "node",
      "args": ["/path/to/gitlab-mcp-server/dist/index.js"],
      "env": {
        "GITLAB_TOKEN": "${GITLAB_TOKEN}",
        "GITLAB_URL": "${GITLAB_URL}",
        "DEFAULT_PROJECT_ID": "${DEFAULT_PROJECT_ID}"
      }
    }
  }
}
```

Then set these environment variables in your shell profile (`~/.bashrc`, `~/.zshrc`, etc.).

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Watch Mode (Auto-restart on changes)

```bash
npm run watch
```

## Available Tools

### Repository Tools

- `list_projects`: List accessible GitLab projects
- `get_project`: Get detailed information about a specific project

### Branch Tools

- `list_branches`: List all branches in a repository
- `create_branch`: Create a new branch from an existing one
- `delete_branch`: Delete a branch from the repository

### Merge Request Tools

- `create_merge_request`: Create a new merge request
- `list_merge_requests`: List merge requests with filtering options
- `merge_merge_request`: Merge an approved merge request

### File Tools

- `get_file`: Read file content from a repository
- `create_file`: Create a new file in the repository
- `update_file`: Update existing file content
- `delete_file`: Delete a file from the repository

## Usage with Claude Code

This MCP server is designed to work seamlessly with Claude Code and other MCP-compatible AI assistants. Here are some example use cases:

### Example 1: Creating a Feature Branch and Merge Request

```
You: "Create a new feature branch called 'add-user-auth' from main, then create a merge request for it"

Claude (using this MCP server):
1. Uses create_branch tool to create 'add-user-auth' branch from 'main'
2. Uses create_merge_request tool to create a merge request
3. Provides you with the merge request URL and details
```

### Example 2: File Operations

```
You: "Add a new configuration file config/database.yml to the repository"

Claude (using this MCP server):
1. Uses create_file tool to add the new file
2. Commits the change with an appropriate message
3. Confirms the file was created successfully
```

### Example 3: Code Review Workflow

```
You: "List all open merge requests and show me the files changed in MR #42"

Claude (using this MCP server):
1. Uses list_merge_requests tool to get open MRs
2. Uses get_file tool to show changed files in the specific MR
3. Provides a summary of the changes for review
```

## Architecture

The server follows a modular architecture:

- **`src/index.ts`**: Main server entry point and MCP setup
- **`src/gitlab-client.ts`**: GitLab API client wrapper
- **`src/tools/`**: Individual tool implementations
  - `repository.ts`: Project management tools
  - `branches.ts`: Branch operation tools
  - `merge-requests.ts`: Merge request tools
  - `files.ts`: File operation tools

## Development

### Project Structure

```
├── src/
│   ├── index.ts              # Main server entry point
│   ├── gitlab-client.ts      # GitLab API client
│   └── tools/                # MCP tool implementations
│       ├── repository.ts
│       ├── branches.ts
│       ├── merge-requests.ts
│       └── files.ts
├── dist/                     # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Testing

The server can be tested by connecting it to any MCP-compatible client or by using the MCP debugging tools.

## Authentication

This server uses GitLab Personal Access Tokens for authentication. To create a token:

1. Go to your GitLab profile settings
2. Navigate to "Access Tokens"
3. Create a new token with appropriate scopes:
   - `api`: Full access to the API
   - `read_user`: Read user information
   - `read_repository`: Read repository content
   - `write_repository`: Write to repositories

## Security Notes

- Store your GitLab token securely in environment variables
- Never commit tokens to version control
- Use minimal required permissions for your token
- Regularly rotate your access tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a merge request

## License

MIT License - see LICENSE file for details.

## Support

For issues and feature requests, please create an issue in the GitLab repository.