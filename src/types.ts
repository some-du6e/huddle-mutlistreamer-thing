export type Account = {
    xoxcToken: string;
    xoxdToken: string;
};

export type CachetUserResult = {
  "id": string,
  "userId": string,
  "displayName": string,
  "realName": string,
  "pronouns": string,
  "imageUrl": string
}

export type PreparePhotoResponse = {
  "ok": boolean,
  "id": string,
  "url": string
}

export type ChimeMeeting = {
    MeetingId: string;
    MediaPlacement: Record<string, string>;
    [key: string]: unknown;
};

export type ChimeAttendee = {
    AttendeeId: string;
    ExternalUserId: string;
    JoinToken: string;
    [key: string]: unknown;
};

export type ChimeJoinInfo = {
    meeting: ChimeMeeting;
    attendee: ChimeAttendee;
};

export type SlackHuddleCall = {
    survey_percent: number;
    free_willy: ChimeJoinInfo;
    call_id: string;
};

export type SlackHuddleCanvas = {
    canvas_file_id: string;
    thread_channel_id: string;
    root_thread_ts: string;
};

export type SlackHuddle = {
    id: string;
    name: string;
    created_by: string;
    date_start: number;
    date_end: number;
    participants: string[];
    participant_history: string[];
    channels: string[];
    has_ended: boolean;
    huddle_link: string;
    thread_root_ts: string;
    background_id: string;
    external_unique_id: string;
    attached_file_ids: string[];
    pending_invitees: Record<string, unknown>;
    last_invite_status_by_user: Record<string, unknown>;
    prototypes: {
        is_prewarmed: boolean;
        is_scheduled: boolean;
    };
    recording: {
        can_record_summary: string;
    };
    locale: string;
};

export type JoinChannelHuddleResponse = {
    ok: true;
    call: SlackHuddleCall;
    canvas: SlackHuddleCanvas;
    huddle: SlackHuddle;
};
