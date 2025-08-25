import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GitLabClient } from '../gitlab-client.js';

export function createFileTools(client: GitLabClient): Tool[] {
    return [
        {
            name: 'create_file',
            description: 'Create a new file in a GitLab repository',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    filePath: {
                        type: 'string',
                        description: 'Path to the file in the repository'
                    },
                    content: {
                        type: 'string',
                        description: 'File content'
                    },
                    commitMessage: {
                        type: 'string',
                        description: 'Commit message'
                    },
                    branch: {
                        type: 'string',
                        description: 'Target branch (default: main)',
                        default: 'main'
                    }
                },
                required: ['projectId', 'filePath', 'content', 'commitMessage']
            }
        },
        {
            name: 'update_file',
            description: 'Update an existing file in a GitLab repository',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    filePath: {
                        type: 'string',
                        description: 'Path to the file in the repository'
                    },
                    content: {
                        type: 'string',
                        description: 'New file content'
                    },
                    commitMessage: {
                        type: 'string',
                        description: 'Commit message'
                    },
                    branch: {
                        type: 'string',
                        description: 'Target branch (default: main)',
                        default: 'main'
                    }
                },
                required: ['projectId', 'filePath', 'content', 'commitMessage']
            }
        },
        {
            name: 'get_file',
            description: 'Get file content from a GitLab repository',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    filePath: {
                        type: 'string',
                        description: 'Path to the file in the repository'
                    },
                    ref: {
                        type: 'string',
                        description: 'Branch or commit SHA (default: main)',
                        default: 'main'
                    }
                },
                required: ['projectId', 'filePath']
            }
        },
        {
            name: 'delete_file',
            description: 'Delete a file from a GitLab repository',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    filePath: {
                        type: 'string',
                        description: 'Path to the file in the repository'
                    },
                    commitMessage: {
                        type: 'string',
                        description: 'Commit message'
                    },
                    branch: {
                        type: 'string',
                        description: 'Target branch (default: main)',
                        default: 'main'
                    }
                },
                required: ['projectId', 'filePath', 'commitMessage']
            }
        }
    ];
}

export async function handleFileTool(name: string, args: any, client: GitLabClient) {
    switch (name) {
        case 'create_file':
            return await client.createFile(
                args.projectId,
                args.filePath,
                args.content,
                args.commitMessage,
                args.branch || 'main'
            );

        case 'update_file':
            return await client.updateFile(
                args.projectId,
                args.filePath,
                args.content,
                args.commitMessage,
                args.branch || 'main'
            );

        case 'get_file':
            const file = await client.getFile(args.projectId, args.filePath, args.ref || 'main');
            return {
                ...file,
                content: Buffer.from(file.content, 'base64').toString('utf-8')
            };

        case 'delete_file':
            return await client.deleteFile(
                args.projectId,
                args.filePath,
                args.commitMessage,
                args.branch || 'main'
            );

        default:
            throw new Error(`Unknown file tool: ${name}`);
    }
}