import type { Experience } from "@/types";


type Props = {

  title: string;

  items: Experience[];

};





export default function PlaceSection({

  title,

  items

}: Props){



  return (

    <section className="
      px-6
      py-8
    ">



      <h2 className="
        text-3xl
        font-bold
        mb-5
      ">

        {title}

      </h2>





      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-5
      ">



        {

          items.map((item)=>(


            <div

              key={item.id}

              className="
                rounded-3xl
                overflow-hidden
                bg-white/5
                border
                border-white/10
              "

            >



              <video

                src={item.media?.[0]?.url}

                muted

                autoPlay

                loop

                playsInline

                className="
                  h-64
                  w-full
                  object-cover
                "

              />





              <div className="
                p-5
              ">



                <h3 className="
                  text-xl
                  font-bold
                ">

                  {item.title}

                </h3>





                <p className="
                  text-gray-400
                  mt-2
                ">

                  {item.description}

                </p>



              </div>




            </div>


          ))

        }



      </div>



    </section>

  );

}