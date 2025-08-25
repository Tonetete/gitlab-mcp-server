import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GitLabClient } from '../gitlab-client.js';

export function createRepositoryTools(client: GitLabClient): Tool[] {
    return [
        {
            name: 'list_projects',
            description: 'List all GitLab projects the user has access to',
            inputSchema: {
                type: 'object',
                properties: {},
                required: []
            }
        },
        {
            name: 'get_project',
            description: 'Get details of a specific GitLab project',
            inputSchema: {
                type: 'object',
                properties: {
                    projectId: {
                        type: 'string',
                        description: 'Project ID or path (e.g., "username/project-name" or "123")'
                    }
                },
                required: ['projectId']
            }
        }
    ];
}

export async function handleRepositoryTool(name: string, args: any, client: GitLabClient) {
    switch (name) {
        case 'list_projects':
            return await client.listProjects();

        case 'get_project':
            return await client.getProject(args.projectId);

        default:
            throw new Error(`Unknown repository tool: ${name}`);
    }
}