export const parseWorkflowRun = (payload) => {
    const run = payload.workflow_run;

    return {
        workflowId: run.id,
        repository: payload.repository.full_name,
        workflow: run.name,
        branch: run.head_branch,
        status: run.status,
        conclusion: run.conclusion,
        url: run.html_url,
    };
};