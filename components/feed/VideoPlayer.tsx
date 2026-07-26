"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";


type Props = {

  src: string;

  poster?: string;

  className?: string;

};



export default function VideoPlayer({

  src,

  poster,

  className = ""

}: Props) {


  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(true);



  function toggleVideo() {


    const video = videoRef.current;


    if (!video) return;



    if (video.paused) {


      video.play();

      setPlaying(true);


    } else {


      video.pause();

      setPlaying(false);


    }

  }





  return (

    <div

      className={`
      relative
      w-full
      h-full
      overflow-hidden
      bg-black
      ${className}
      `}

    >



      <video

        ref={videoRef}

        src={src}

        poster={poster}

        autoPlay

        muted

        loop

        playsInline

        onClick={toggleVideo}

        className="
        w-full
        h-full
        object-cover
        "

      />





      {!playing && (

        <div

          className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          "

        >

          <div

            className="
            w-16
            h-16
            rounded-full
            bg-black/40
            backdrop-blur-md
            flex
            items-center
            justify-center
            "

          >

            <Play

              size={30}

              className="text-white"

              fill="white"

            />

          </div>


        </div>

      )}





    </div>

  );

}