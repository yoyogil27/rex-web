"use client";

import Link from "next/link";

import type { Experience, Place } from "@/types";


type Props = {

  experience: Experience & {
    place: Place;
  };

  index: number;

  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;

};





export default function ExperienceSlide({

  experience,

  index,

  videoRefs

}: Props) {



  const video =

    experience.media?.find(

      (item) => item.type === "video"

    )?.url ?? "";





  return (

    <section

      className="
        h-screen
        w-full
        snap-start
        relative
        overflow-hidden
      "

    >



      <video

        ref={(element)=>{

          videoRefs.current[index] = element;

        }}

        src={video}

        autoPlay

        muted

        loop

        playsInline

        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "

      />





      <div

        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black
          via-black/30
          to-transparent
        "

      />





      <div

        className="
          absolute
          bottom-24
          left-6
          right-6
          z-10
        "

      >



        <p

          className="
            text-green-400
            font-bold
          "

        >

          {experience.category}

        </p>




        <Link

          href={`/place/${experience.place.id}`}

        >

          <h1

            className="
              text-4xl
              font-black
              mt-2
            "

          >

            {experience.title}

          </h1>

        </Link>





        <p

          className="
            text-white/70
            mt-3
            max-w-xl
          "

        >

          {experience.description}

        </p>



      </div>



    </section>

  );

}