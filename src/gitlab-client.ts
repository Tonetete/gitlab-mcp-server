import axios, { AxiosInstance } from 'axios';

export interface GitLabConfig {
    token: string;
    baseUrl: string;
    defaultProjectId?: string;
}

export class GitLabClient {
    private client: AxiosInstance;
    private defaultProjectId?: string;

    constructor(config: GitLabConfig) {
        this.defaultProjectId = config.defaultProjectId;
        this.client = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // Repository operations
    async getProject(projectId: string) {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}`);
        return response.data;
    }

    async listProjects() {
        const response = await this.client.get('/projects?membership=true&simple=true');
        return response.data;
    }

    // Branch operations
    async listBranches(projectId: string) {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/repository/branches`);
        return response.data;
    }

    async createBranch(projectId: string, branchName: string, ref: string = 'main') {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/repository/branches`, {
            branch: branchName,
            ref: ref
        });
        return response.data;
    }

    async deleteBranch(projectId: string, branchName: string) {
        const response = await this.client.delete(`/projects/${encodeURIComponent(projectId)}/repository/branches/${encodeURIComponent(branchName)}`);
        return response.data;
    }

    // File operations
    async getFile(projectId: string, filePath: string, ref: string = 'main') {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`, {
            params: { ref }
        });
        return response.data;
    }

    async createFile(projectId: string, filePath: string, content: string, commitMessage: string, branch: string = 'main') {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`, {
            branch,
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
            commit_message: commitMessage
        });
        return response.data;
    }

    async updateFile(projectId: string, filePath: string, content: string, commitMessage: string, branch: string = 'main') {
        const response = await this.client.put(`/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`, {
            branch,
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
            commit_message: commitMessage
        });
        return response.data;
    }

    async deleteFile(projectId: string, filePath: string, commitMessage: string, branch: string = 'main') {
        const response = await this.client.delete(`/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}`, {
            data: {
                branch,
                commit_message: commitMessage
            }
        });
        return response.data;
    }

    // Commit operations
    async getCommits(projectId: string, branch?: string) {
        const params = branch ? { ref_name: branch } : {};
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/repository/commits`, {
            params
        });
        return response.data;
    }

    async createCommit(projectId: string, branch: string, commitMessage: string, actions: any[]) {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/repository/commits`, {
            branch,
            commit_message: commitMessage,
            actions
        });
        return response.data;
    }

    // Merge Request operations
    async listMergeRequests(projectId: string, state: string = 'opened') {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/merge_requests`, {
            params: { state }
        });
        return response.data;
    }

    async createMergeRequest(projectId: string, sourceBranch: string, targetBranch: string, title: string, description?: string) {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/merge_requests`, {
            source_branch: sourceBranch,
            target_branch: targetBranch,
            title,
            description: description || ''
        });
        return response.data;
    }

    async getMergeRequest(projectId: string, mergeRequestIid: number) {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}`);
        return response.data;
    }

    async updateMergeRequest(projectId: string, mergeRequestIid: number, updates: any) {
        const response = await this.client.put(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}`, updates);
        return response.data;
    }

    async mergeMergeRequest(projectId: string, mergeRequestIid: number, mergeCommitMessage?: string) {
        const response = await this.client.put(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/merge`, {
            merge_commit_message: mergeCommitMessage
        });
        return response.data;
    }

    // Issues operations
    async listIssues(projectId: string, state: string = 'opened') {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/issues`, {
            params: { state }
        });
        return response.data;
    }

    async createIssue(projectId: string, title: string, description?: string, labels?: string[]) {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/issues`, {
            title,
            description: description || '',
            labels: labels || []
        });
        return response.data;
    }

    // Discussion operations
    async listDiscussions(projectId: string, mergeRequestIid: number) {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions`);
        return response.data;
    }

    async getDiscussion(projectId: string, mergeRequestIid: number, discussionId: string) {
        const response = await this.client.get(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}`);
        return response.data;
    }

    async createDiscussion(projectId: string, mergeRequestIid: number, body: string, position?: any) {
        const payload: any = { body };
        if (position) {
            payload.position = position;
        }
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions`, payload);
        return response.data;
    }

    async addNoteToDiscussion(projectId: string, mergeRequestIid: number, discussionId: string, body: string) {
        const response = await this.client.post(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}/notes`, {
            body
        });
        return response.data;
    }

    async updateDiscussionNote(projectId: string, mergeRequestIid: number, discussionId: string, noteId: number, body: string) {
        const response = await this.client.put(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}/notes/${noteId}`, {
            body
        });
        return response.data;
    }

    async deleteDiscussionNote(projectId: string, mergeRequestIid: number, discussionId: string, noteId: number) {
        const response = await this.client.delete(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}/notes/${noteId}`);
        return response.data;
    }

    async resolveDiscussion(projectId: string, mergeRequestIid: number, discussionId: string, resolved: boolean = true) {
        const response = await this.client.put(`/projects/${encodeURIComponent(projectId)}/merge_requests/${mergeRequestIid}/discussions/${discussionId}`, {
            resolved
        });
        return response.data;
    }
}