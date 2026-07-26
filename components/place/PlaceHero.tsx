"use client";

import type { Place } from "@/types";

import {
  MapPin
} from "lucide-react";



type Props = {

  place: Place;

};





export default function PlaceHero({

  place

}: Props){



  return (

    <section className="
      relative
      h-[60dvh]
      overflow-hidden
    ">




      {

        place.coverVideo && (

          <video

            src={place.coverVideo}

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

        )

      }







      <div className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black
        via-black/40
        to-transparent
      "/>







      <div className="
        absolute
        bottom-8
        left-6
        right-6
      ">




        <p className="
          text-green-400
          font-semibold
          flex
          items-center
          gap-2
        ">

          <MapPin size={18}/>

          {place.location}

        </p>





        <h1 className="
          text-4xl
          md:text-6xl
          font-black
          mt-3
        ">

          {place.name}

        </h1>






        <p className="
          text-white/70
          mt-4
          max-w-xl
        ">

          {place.description}

        </p>





      </div>




    </section>

  );

}