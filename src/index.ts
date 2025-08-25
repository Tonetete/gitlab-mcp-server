#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { GitLabClient } from './gitlab-client.js';
import { createRepositoryTools, handleRepositoryTool } from './tools/repository.js';
import { createBranchTools, handleBranchTool } from './tools/branches.js';
import { createMergeRequestTools, handleMergeRequestTool } from './tools/merge-requests.js';
import { createFileTools, handleFileTool } from './tools/files.js';
import { createDiscussionTools, handleDiscussionTool } from './tools/discussions.js';

// Load environment variables
dotenv.config();

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_URL = process.env.GITLAB_URL || 'https://gitlab.com/api/v4';
const DEFAULT_PROJECT_ID = process.env.DEFAULT_PROJECT_ID;

if (!GITLAB_TOKEN) {
    console.error('GITLAB_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize GitLab client
const gitlabClient = new GitLabClient({
    token: GITLAB_TOKEN,
    baseUrl: GITLAB_URL,
    defaultProjectId: DEFAULT_PROJECT_ID
});

// Create server instance
const server = new Server(
    {
        name: 'gitlab-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Combine all tools
const allTools = [
    ...createRepositoryTools(gitlabClient),
    ...createBranchTools(gitlabClient),
    ...createMergeRequestTools(gitlabClient),
    ...createFileTools(gitlabClient),
    ...createDiscussionTools(gitlabClient),
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: allTools,
    };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        let result;

        // Route to appropriate tool handler
        if (['list_projects', 'get_project'].includes(name)) {
            result = await handleRepositoryTool(name, args, gitlabClient);
        } else if (['list_branches', 'create_branch', 'delete_branch'].includes(name)) {
            result = await handleBranchTool(name, args, gitlabClient);
        } else if (['create_merge_request', 'list_merge_requests', 'merge_merge_request'].includes(name)) {
            result = await handleMergeRequestTool(name, args, gitlabClient);
        } else if (['create_file', 'update_file', 'get_file', 'delete_file'].includes(name)) {
            result = await handleFileTool(name, args, gitlabClient);
        } else if (['list_merge_request_discussions', 'get_merge_request_discussion', 'create_merge_request_discussion', 'add_note_to_discussion', 'update_discussion_note', 'delete_discussion_note', 'resolve_discussion'].includes(name)) {
            result = await handleDiscussionTool(name, args, gitlabClient);
        } else {
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('GitLab MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});