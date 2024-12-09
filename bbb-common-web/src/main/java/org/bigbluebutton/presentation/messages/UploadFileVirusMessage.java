package org.bigbluebutton.presentation.messages;

public record UploadFileVirusMessage(String podId, String meetingId, String filename, String messageKey,
                                     String temporaryPresentationId,
                                     String presentationId) implements IDocConversionMsg {
}
