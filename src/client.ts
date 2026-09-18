/// <reference lib="dom" />

import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
    type AudioVideoObserver,
} from "amazon-chime-sdk-js";
import type { ChimeJoinInfo } from "./types";

declare global {
    var joinChimeMeeting: (joinInfo: ChimeJoinInfo) => Promise<void>;
    var chimeMeetingSession: DefaultMeetingSession | undefined;
}

globalThis.joinChimeMeeting = async ({ meeting, attendee }) => {
    const logger = new ConsoleLogger("HuddleJoiner", LogLevel.WARN);
    const deviceController = new DefaultDeviceController(logger);
    const configuration = new MeetingSessionConfiguration(meeting, attendee);
    const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
    globalThis.chimeMeetingSession = meetingSession;

    await meetingSession.audioVideo.startAudioInput(null);

    await new Promise<void>((resolve, reject) => {
        let started = false;
        const observer: AudioVideoObserver = {
            audioVideoDidStart: () => {
                started = true;
                resolve();
            },
            audioVideoDidStop: sessionStatus => {
                if (!started) {
                    reject(new Error(`Chime stopped before joining (${sessionStatus.statusCode()})`));
                }
            },
        };

        meetingSession.audioVideo.addObserver(observer);
        meetingSession.audioVideo.start();
    });
};
