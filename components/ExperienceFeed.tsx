"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { Experience, Place } from "@/types";

import ExperienceActions from "./place/ExperienceActions";


type FeedExperience = Experience & {

  place: Place;

};



type Props = {

  experiences: FeedExperience[];

};



const filters = [

  "All",
  "Food",
  "Adventure",
  "Nature",
  "Lifestyle",
  "Culture",
  "Stay",
  "Event"

];




export default function ExperienceFeed({

  experiences

}: Props){



  const [activeVideo,setActiveVideo] = useState(0);

  const [selectedFilter,setSelectedFilter] = useState("All");


  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);





  const filteredExperiences =

    selectedFilter === "All"

    ?

    experiences

    :

    experiences.filter(

      (experience)=>

        experience.category === selectedFilter

    );







  useEffect(()=>{


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
        threshold:0.75
      }

    );




    const slides = document.querySelectorAll(

      ".explore-slide"

    );



    slides.forEach((slide)=>{

      observer.observe(slide);

    });



    return ()=>{

      observer.disconnect();

    };


  },[filteredExperiences]);








  useEffect(()=>{


    videoRefs.current.forEach(

      (video,index)=>{


        if(!video) return;


        if(index === activeVideo){


          video.play()
            .catch(()=>{});


        }

        else{


          video.pause();

        }


      }

    );


  },[activeVideo]);








  return (

    <div className="
      relative
      h-screen
      w-full
    ">



      <div className="
        absolute
        top-20
        left-0
        right-0
        z-30
        px-4
        flex
        gap-3
        overflow-x-auto
        no-scrollbar
      ">



        {

          filters.map((filter)=>(


            <button

              key={filter}

              onClick={()=>setSelectedFilter(filter)}

              className={

                selectedFilter === filter

                ?

                "bg-green-500 text-black px-5 py-2 rounded-full"

                :

                "bg-white/20 text-white px-5 py-2 rounded-full"

              }

            >

              {filter}

            </button>


          ))

        }



      </div>







      <div className="
        h-screen
        overflow-y-scroll
        snap-y
        snap-mandatory
      ">



        {

          filteredExperiences.map((experience,index)=>{


            const video =

              experience.media?.[0]?.url ?? "";



            return (

              <section

                key={experience.id}

                data-index={index}

                className="
                  explore-slide
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

                  poster={

                    experience.media?.[0]?.thumbnail

                  }

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
                  bottom-28
                  left-6
                  right-24
                ">


                  <p className="
                    text-green-400
                    font-bold
                  ">

                    {experience.category}

                  </p>




                  <h1 className="
                    text-4xl
                    font-bold
                  ">

                    {experience.title}

                  </h1>




                  <Link

                    href={`/place/${experience.place.id}`}

                    className="
                      block
                      mt-3
                      text-lg
                    "

                  >

                    📍 {experience.place.name}

                  </Link>




                  <p className="
                    mt-3
                    text-gray-300
                  ">

                    {experience.description}

                  </p>



                </div>






                <ExperienceActions

                  experience={experience}

                  place={experience.place}

                />





              </section>

            );


          })

        }



      </div>



    </div>

  );

}