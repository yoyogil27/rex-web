"use client";

import Link from "next/link";

import type { Experience, Place } from "@/types";



type Props = {

  experience: Experience;

  place: Place;

};





export default function ExploreCard({

  experience,

  place

}: Props){



  const video = experience.media?.[0]?.url ?? "";



  return (

    <Link

      href={`/place/${place.id}`}

      className="
        relative
        aspect-[4/5]
        rounded-3xl
        overflow-hidden
        bg-white/10
        group
        block
      "

    >




      <video

        src={video}

        muted

        loop

        playsInline

        preload="metadata"

        className="
          w-full
          h-full
          object-cover
          transition
          duration-500
          group-hover:scale-105
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
        right-5
      ">



        <p className="
          text-green-400
          font-bold
          text-sm
        ">

          {experience.category}

        </p>






        <h2 className="
          text-white
          text-xl
          font-bold
        ">

          {experience.title}

        </h2>






        <p className="
          text-gray-300
          mt-1
        ">

          📍 {place.name}

        </p>



      </div>





    </Link>

  );

}