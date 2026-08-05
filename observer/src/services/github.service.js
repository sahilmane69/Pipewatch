export const parseWorkflowRun = (payload) => {
    return {
        id: payload.workflow_run.id,
        name: payload.workflow_run.name,
        status: payload.workflow_run.status,
        conclusion: payload.workflow_run.conclusion,
        branch: payload.workflow_run.head_branch,
        repository: payload.repository.full_name,
        url: payload.workflow_run.html_url
    };
};