import ModalVideo from "react-modal-video"; 
import 'react-modal-video/css/modal-video.css';


type Props = {
  isVideoOpen: boolean;
  setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  videoId?: string;
};

const VideoPopup = ({isVideoOpen, setIsVideoOpen, videoId = "bgMEvrd2E"}: Props ) => {
  return (
    <>
      <ModalVideo
        channel="youtube"
        // autoplay
        isOpen={isVideoOpen}
        videoId={videoId}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
};

export default VideoPopup;

