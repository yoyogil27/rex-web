"use client";

import Link from "next/link";

import type { Experience } from "@/types";

import ActionButtons from "./ActionButtons";



type Props = {

  experience: Experience & {

    placeId?: string;

  };

};





export default function ExperienceVideo({

  experience,

}: Props) {



  const video = experience.media?.[0]?.url ?? "";



  return (

    <section className="experience-item">





      <video

        src={video}

        autoPlay

        muted

        loop

        playsInline

        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "

      />






      <div className="
        video-overlay
      "/>







      <div className="
        absolute
        bottom-28
        left-6
        right-20
        z-20
      ">




        <p className="
          rex-green
          font-semibold
        ">

          {experience.category}

        </p>






        <Link

          href={`/place/${experience.placeId}`}

          className="
            block
            mt-2
          "

        >


          <h2 className="
            text-3xl
            font-bold
          ">

            {experience.title}

          </h2>



        </Link>







        <p className="
          mt-3
          text-gray-300
        ">

          {experience.description}

        </p>





      </div>







      <ActionButtons />





    </section>

  );

}