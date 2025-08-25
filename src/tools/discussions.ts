import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GitLabClient } from '../gitlab-client.js';

export function createDiscussionTools(client: GitLabClient): Tool[] {
    return [
        {
            name: 'list_merge_request_discussions',
            description: 'List all discussions in a merge request',
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
                    }
                },
                required: ['projectId', 'mergeRequestIid']
            }
        },
        {
            name: 'get_merge_request_discussion',
            description: 'Get a specific discussion in a merge request',
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
                    discussionId: {
                        type: 'string',
                        description: 'Discussion ID'
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'discussionId']
            }
        },
        {
            name: 'create_merge_request_discussion',
            description: 'Create a new discussion in a merge request',
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
                    body: {
                        type: 'string',
                        description: 'Discussion body/comment text'
                    },
                    position: {
                        type: 'object',
                        description: 'Position object for line-specific comments (optional)',
                        properties: {
                            base_sha: { type: 'string', description: 'Base commit SHA' },
                            start_sha: { type: 'string', description: 'Start commit SHA' },
                            head_sha: { type: 'string', description: 'Head commit SHA' },
                            old_path: { type: 'string', description: 'Old file path' },
                            new_path: { type: 'string', description: 'New file path' },
                            position_type: { type: 'string', enum: ['text'], description: 'Position type' },
                            old_line: { type: 'number', description: 'Old line number' },
                            new_line: { type: 'number', description: 'New line number' }
                        }
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'body']
            }
        },
        {
            name: 'add_note_to_discussion',
            description: 'Add a reply note to an existing discussion',
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
                    discussionId: {
                        type: 'string',
                        description: 'Discussion ID'
                    },
                    body: {
                        type: 'string',
                        description: 'Reply note text'
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'discussionId', 'body']
            }
        },
        {
            name: 'update_discussion_note',
            description: 'Update an existing note in a discussion',
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
                    discussionId: {
                        type: 'string',
                        description: 'Discussion ID'
                    },
                    noteId: {
                        type: 'number',
                        description: 'Note ID'
                    },
                    body: {
                        type: 'string',
                        description: 'Updated note text'
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'discussionId', 'noteId', 'body']
            }
        },
        {
            name: 'delete_discussion_note',
            description: 'Delete a note from a discussion',
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
                    discussionId: {
                        type: 'string',
                        description: 'Discussion ID'
                    },
                    noteId: {
                        type: 'number',
                        description: 'Note ID'
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'discussionId', 'noteId']
            }
        },
        {
            name: 'resolve_discussion',
            description: 'Resolve or unresolve a discussion',
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
                    discussionId: {
                        type: 'string',
                        description: 'Discussion ID'
                    },
                    resolved: {
                        type: 'boolean',
                        description: 'Whether to resolve (true) or unresolve (false) the discussion',
                        default: true
                    }
                },
                required: ['projectId', 'mergeRequestIid', 'discussionId']
            }
        }
    ];
}

export async function handleDiscussionTool(name: string, args: any, client: GitLabClient) {
    switch (name) {
        case 'list_merge_request_discussions':
            return await client.listDiscussions(args.projectId, args.mergeRequestIid);

        case 'get_merge_request_discussion':
            return await client.getDiscussion(args.projectId, args.mergeRequestIid, args.discussionId);

        case 'create_merge_request_discussion':
            return await client.createDiscussion(args.projectId, args.mergeRequestIid, args.body, args.position);

        case 'add_note_to_discussion':
            return await client.addNoteToDiscussion(args.projectId, args.mergeRequestIid, args.discussionId, args.body);

        case 'update_discussion_note':
            return await client.updateDiscussionNote(args.projectId, args.mergeRequestIid, args.discussionId, args.noteId, args.body);

        case 'delete_discussion_note':
            return await client.deleteDiscussionNote(args.projectId, args.mergeRequestIid, args.discussionId, args.noteId);

        case 'resolve_discussion':
            return await client.resolveDiscussion(args.projectId, args.mergeRequestIid, args.discussionId, args.resolved ?? true);

        default:
            throw new Error(`Unknown discussion tool: ${name}`);
    }
}