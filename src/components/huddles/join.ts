import type { Account } from "../../types";

type JoinChannelHuddleResponse = {
    ok: boolean;
    error?: string;
    [key: string]: unknown;
};

export async function joinChannelHuddle(
    channelId: string,
    acc: Account,
): Promise<JoinChannelHuddleResponse> {
    const body = new FormData();
    body.append("channel_id", channelId);
    body.append("regions", "us-east-2");
    body.append("token", acc.xoxcToken);

    const response = await fetch("https://hackclub.slack.com/api/rooms.join", {
        method: "POST",
        headers: {
            cookie: `d=${acc.xoxdToken}`,
        },
        body,
    });

    if (!response.ok) {
        throw new Error(`Slack rooms.join returned HTTP ${response.status}`);
    }

    const result = await response.json() as JoinChannelHuddleResponse;
    if (!result.ok) {
        throw new Error(`Slack rooms.join failed: ${result.error ?? "unknown error"}`);
    }

    return result;
}
