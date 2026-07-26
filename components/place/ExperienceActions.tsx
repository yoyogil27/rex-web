"use client";

import type { Experience, Place } from "@/types";



type Props = {

  experience: Experience;

  place: Place;

};





export default function ExperienceActions({

  experience,

  place

}: Props){



  return (

    <div className="
      absolute
      right-6
      bottom-32
      flex
      flex-col
      gap-4
    ">



      {

        experience.actions?.booking && (

          <button

            className="
              bg-green-500
              text-black
              font-bold
              px-5
              py-3
              rounded-full
            "

            onClick={()=>{


              console.log(

                "Booking",

                place.name,

                experience.title

              );


            }}

          >

            Book

          </button>

        )

      }





      {

        experience.actions?.contact && (

          <button

            className="
              bg-white
              text-black
              font-bold
              px-5
              py-3
              rounded-full
            "

            onClick={()=>{


              console.log(

                "Contact",

                place.name

              );


            }}

          >

            Contact

          </button>

        )

      }





    </div>

  );

}