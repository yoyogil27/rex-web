"use client";

import {
  Phone,
  MapPin,
  Bookmark
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";


type Props = {

  organization?: {

    phone?: string;

    whatsapp?: string;

    coordinates?: {

      lat:number;

      lng:number;

    };

  };

};



export default function PlaceHeroActions({

  organization

}:Props){


  const phone = organization?.phone ?? "";

  const whatsapp = organization?.whatsapp ?? "";

  const coordinates = organization?.coordinates;



  const mapsUrl = coordinates

    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`

    : "#";





  return (

    <div

      className="
        fixed
        right-5
        bottom-32
        z-40
        flex
        flex-col
        gap-4
      "

    >





      {
        phone && (

          <a

            href={`tel:${phone}`}

            className="
              h-12
              w-12
              rounded-full
              bg-green-600
              flex
              items-center
              justify-center
              text-white
              shadow-xl
            "

          >

            <Phone size={22}/>

          </a>

        )

      }








      {
        whatsapp && (

          <a

            href={`https://wa.me/${whatsapp}`}

            target="_blank"

            rel="noopener noreferrer"

            className="
              h-12
              w-12
              rounded-full
              bg-[#25D366]
              flex
              items-center
              justify-center
              text-white
              shadow-xl
            "

          >

            <FaWhatsapp size={26}/>

          </a>

        )

      }








      {
        coordinates && (

          <a

            href={mapsUrl}

            target="_blank"

            rel="noopener noreferrer"

            className="
              h-12
              w-12
              rounded-full
              bg-black/60
              backdrop-blur-md
              border
              border-white/20
              flex
              items-center
              justify-center
              text-white
              shadow-xl
            "

          >

            <MapPin size={22}/>

          </a>

        )

      }








      <button

        className="
          h-12
          w-12
          rounded-full
          bg-black/60
          backdrop-blur-md
          border
          border-white/20
          flex
          items-center
          justify-center
          text-white
          shadow-xl
        "

      >

        <Bookmark size={22}/>

      </button>





    </div>

  );

}