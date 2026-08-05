export const processPipelineEvent = (payload) => {

    const event = {
        repository: payload.repository?.full_name || "Unknown",
        branch: payload.ref || "Unknown",
        status: payload.status || "running",
        receivedAt: new Date().toISOString()
    };

    console.log(event);

    return event;
};