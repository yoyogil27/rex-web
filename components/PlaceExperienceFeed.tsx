"use client";

import { useEffect, useRef, useState } from "react";

import type { Experience, Place } from "@/types";

import useAutoPlayVideo from "@/hooks/useAutoPlayVideo";

import ExperienceActions from "./place/ExperienceActions";



type Props = {

  experiences: Experience[];

  place: Place;

};





export default function PlaceExperienceFeed({

  experiences,

  place

}: Props){



  const [viewerOpen,setViewerOpen] = useState(false);

  const [startIndex,setStartIndex] = useState(0);



  const viewerRef = useRef<HTMLDivElement>(null);



  const {
    videoRefs
  } = useAutoPlayVideo();






  const sortedExperiences = [

    ...experiences

  ].sort(

    (a,b)=>

      new Date(b.date ?? "").getTime()

      -

      new Date(a.date ?? "").getTime()

  );






  function openViewer(index:number){

    setStartIndex(index);

    setViewerOpen(true);

  }






  useEffect(()=>{


    if(

      viewerOpen &&

      viewerRef.current

    ){


      const target =

        viewerRef.current.children[startIndex] as HTMLElement;



      target?.scrollIntoView({

        behavior:"instant"

      });


    }


  },[viewerOpen,startIndex]);








  return (

    <section className="
      px-6
      py-10
    ">



      <h2 className="
        text-3xl
        font-black
        mb-8
      ">

        Latest Experiences

      </h2>





      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-5
      ">


        {

          sortedExperiences.map((experience,index)=>{


            const video = experience.media?.[0]?.url ?? "";



            return (

              <button

                key={experience.id}

                onClick={()=>openViewer(index)}

                className="
                  aspect-[4/5]
                  rounded-3xl
                  overflow-hidden
                  relative
                  bg-white/10
                "

              >


                <video

                  src={video}

                  muted

                  playsInline

                  preload="metadata"

                  className="
                    w-full
                    h-full
                    object-cover
                  "

                />




                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  to-transparent
                "/>





                <div className="
                  absolute
                  bottom-5
                  left-5
                  text-left
                ">


                  <p className="
                    text-green-400
                    text-sm
                    font-bold
                  ">

                    {experience.category}

                  </p>



                  <h3 className="
                    text-xl
                    font-bold
                  ">

                    {experience.title}

                  </h3>


                </div>



              </button>

            );


          })

        }


      </div>








      {

        viewerOpen && (


          <div className="
            fixed
            inset-0
            z-50
            bg-black
          ">



            <div

              ref={viewerRef}

              className="
                h-screen
                w-full
                overflow-y-scroll
                snap-y
                snap-mandatory
              "

            >



              {

                sortedExperiences.map((experience,index)=>{


                  const video = experience.media?.[0]?.url ?? "";



                  return (

                    <section

                      key={experience.id}

                      className="
                        h-screen
                        w-full
                        snap-start
                        relative
                      "

                    >



                      <video

                        ref={(element)=>{

                          videoRefs.current[index]=element;

                        }}

                        src={video}

                        autoPlay

                        muted

                        loop

                        playsInline

                        preload="auto"

                        className="
                          absolute
                          inset-0
                          w-full
                          h-full
                          object-cover
                        "

                      />





                      <div className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black
                        via-black/20
                        to-transparent
                      "/>





                      <div className="
                        absolute
                        bottom-10
                        left-6
                        right-24
                      ">


                        <p className="
                          text-green-400
                          font-bold
                        ">

                          {experience.category}

                        </p>




                        <h2 className="
                          text-3xl
                          font-black
                        ">

                          {experience.title}

                        </h2>




                        <p className="
                          text-white/70
                          mt-3
                        ">

                          {experience.description}

                        </p>


                      </div>





                      <ExperienceActions

                        experience={experience}

                        place={place}

                      />




                    </section>

                  );


                })

              }



            </div>







            <button

              onClick={()=>setViewerOpen(false)}

              className="
                absolute
                top-6
                right-6
                z-50
                text-white
                text-4xl
              "

            >

              ×

            </button>



          </div>


        )

      }


    </section>

  );

}