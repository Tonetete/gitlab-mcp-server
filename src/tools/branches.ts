import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GitLabClient } from '../gitlab-client.js';

export function createBranchTools(client: GitLabClient): Tool[] {
    return [
        {
            name: 'list_branches',
            description: 'List all branches in a GitLab project',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    }
                },
                required: ['projectId']
            }
        },
        {
            name: 'create_branch',
            description: 'Create a new branch in a GitLab project',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    branchName: {
                        type: 'string',
                        description: 'Name of the new branch'
                    },
                    ref: {
                        type: 'string',
                        description: 'Source branch or commit SHA (default: main)',
                        default: 'main'
                    }
                },
                required: ['projectId', 'branchName']
            }
        },
        {
            name: 'delete_branch',
            description: 'Delete a branch from a GitLab project',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    branchName: {
                        type: 'string',
                        description: 'Name of the branch to delete'
                    }
                },
                required: ['projectId', 'branchName']
            }
        }
    ];
}

export async function handleBranchTool(name: string, args: any, client: GitLabClient) {
    switch (name) {
        case 'list_branches':
            return await client.listBranches(args.projectId);

        case 'create_branch':
            return await client.createBranch(args.projectId, args.branchName, args.ref || 'main');

        case 'delete_branch':
            return await client.deleteBranch(args.projectId, args.branchName);

        default:
            throw new Error(`Unknown branch tool: ${name}`);
    }
}