import { isScreenBroadcasting, isCameraAsContentBroadcasting } from '/imports/ui/components/screenshare/service';
import Settings from '/imports/ui/services/settings';
import getFromUserSettings from '/imports/ui/services/users-settings';
import {
  isScreenSharingEnabled, isCameraAsContentEnabled, isPresentationEnabled,
} from '/imports/ui/services/features';
import { ACTIONS } from '../layout/enums';
import UserService from '/imports/ui/components/user-list/service';

const LAYOUT_CONFIG = window.meetingClientSettings.public.layout;
const KURENTO_CONFIG = window.meetingClientSettings.public.kurento;
const PRESENTATION_CONFIG = window.meetingClientSettings.public.presentation;

function shouldShowWhiteboard() {
  return true;
}

function shouldShowScreenshare(active, sharingContentType) {
  const { viewScreenshare } = Settings.dataSaving;
  return (isScreenSharingEnabled() || isCameraAsContentEnabled())
    && (viewScreenshare || UserService.isUserPresenter())
    && (
      isScreenBroadcasting(active, sharingContentType)
      || isCameraAsContentBroadcasting(active, sharingContentType)
    );
}

function shouldShowOverlay() {
  return getFromUserSettings('bbb_enable_video', KURENTO_CONFIG.enableVideo);
}

const setPresentationIsOpen = (layoutContextDispatch, value) => {
  layoutContextDispatch({
    type: ACTIONS.SET_PRESENTATION_IS_OPEN,
    value,
  });
};

const buildLayoutWhenPresentationAreaIsDisabled = (
  layoutContextDispatch,
  isSharingVideo,
  isSharedNotesPinned,
  isThereWebcam,
) => {
  const hasScreenshare = isScreenSharingEnabled();
  const isGeneralMediaOff = !hasScreenshare && !isSharedNotesPinned && !isSharingVideo
  const webcamIsOnlyContent = isThereWebcam && isGeneralMediaOff;
  const isThereNoMedia = !isThereWebcam && isGeneralMediaOff;
  const isPresentationDisabled = !isPresentationEnabled();

  if (isPresentationDisabled && (webcamIsOnlyContent || isThereNoMedia)) {
    setPresentationIsOpen(layoutContextDispatch, false);
  }

}

export default {
  buildLayoutWhenPresentationAreaIsDisabled,
  shouldShowWhiteboard,
  shouldShowScreenshare,
  shouldShowOverlay,
  isScreenBroadcasting,
  isCameraAsContentBroadcasting,
  setPresentationIsOpen,
};
