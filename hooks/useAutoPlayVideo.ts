"use client";

import { useEffect, useRef, useState } from "react";


export default function useAutoPlayVideo(){


  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);


  const [activeVideo,setActiveVideo] = useState(0);



  useEffect(()=>{


    const slides = document.querySelectorAll(
      "[data-video-slide]"
    );


    const observer = new IntersectionObserver(

      (entries)=>{


        entries.forEach((entry)=>{


          if(entry.isIntersecting){


            const index = Number(
              entry.target.getAttribute("data-index")
            );


            setActiveVideo(index);


          }


        });


      },

      {
        threshold:0.5
      }

    );



    slides.forEach((slide)=>{

      observer.observe(slide);

    });



    return ()=>{

      observer.disconnect();

    };


  },[]);






  useEffect(()=>{


    videoRefs.current.forEach((video,index)=>{


      if(!video) return;



      if(index === activeVideo){


        video.muted = true;


        video.play()
          .catch(()=>{});


      }
      else{


        video.pause();


      }


    });


  },[activeVideo]);






  return {

    videoRefs,

    activeVideo

  };


}