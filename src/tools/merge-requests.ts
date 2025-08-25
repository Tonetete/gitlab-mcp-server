import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GitLabClient } from '../gitlab-client.js';

export function createMergeRequestTools(client: GitLabClient): Tool[] {
    return [
        {
            name: 'create_merge_request',
            description: 'Create a new merge request (PR) in GitLab',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    sourceBranch: {
                        type: 'string',
                        description: 'Source branch name'
                    },
                    targetBranch: {
                        type: 'string',
                        description: 'Target branch name (default: main)',
                        default: 'main'
                    },
                    title: {
                        type: 'string',
                        description: 'Merge request title'
                    },
                    description: {
                        type: 'string',
                        description: 'Merge request description (optional)'
                    }
                },
                required: ['projectId', 'sourceBranch', 'title']
            }
        },
        {
            name: 'list_merge_requests',
            description: 'List merge requests in a GitLab project',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    state: {
                        type: 'string',
                        description: 'State filter (opened, closed, merged, all)',
                        default: 'opened'
                    }
                },
                required: ['projectId']
            }
        },
        {
            name: 'merge_merge_request',
            description: 'Merge a merge request',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path'
                    },
                    mergeRequestIid: {
                        type: 'number',
                        description: 'Merge request IID'
                    },
                    mergeCommitMessage: {
                        type: 'string',
                        description: 'Custom merge commit message (optional)'
                    }
                },
                required: ['projectId', 'mergeRequestIid']
            }
        }
    ];
}

export async function handleMergeRequestTool(name: string, args: any, client: GitLabClient) {
    switch (name) {
        case 'create_merge_request':
            return await client.createMergeRequest(
                args.projectId,
                args.sourceBranch,
                args.targetBranch || 'main',
                args.title,
                args.description
            );

        case 'list_merge_requests':
            return await client.listMergeRequests(args.projectId, args.state || 'opened');

        case 'merge_merge_request':
            return await client.mergeMergeRequest(args.projectId, args.mergeRequestIid, args.mergeCommitMessage);

        default:
            throw new Error(`Unknown merge request tool: ${name}`);
    }
}