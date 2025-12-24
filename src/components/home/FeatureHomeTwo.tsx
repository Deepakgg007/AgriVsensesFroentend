  
import { useState } from 'react'
import VideoPopup from '../../modals/VideoPopup';

export default function FeatureHomeTwo() {

  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);


  return (
    <>
      <div className="feature-videov02" style={{ backgroundImage: 'url(assets/img/about/feature-video02.jpg)' }}>
        <div className="container">
          <div className="feature-video-wrap d-center w-100">
            <a
              onClick={() => setIsVideoOpen(true)}
              style={{ cursor: "pointer" }}
              className="video-cmn d-center video-popup">
              <i className="fa-solid fa-play"></i>
            </a>
          </div>
        </div>
      </div>

      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"-hTVNidxg2s"}
      />
      {/* video modal end  */}
    </>
  )
}
