import type { Experience } from "@/types";


type Props = {

  title: string;

  items: Experience[];

};




export default function ExperienceSection({

  title,

  items

}: Props){



  return (

    <section className="
      px-6
      py-8
    ">



      <h2 className="
        text-2xl
        font-bold
        mb-5
      ">

        {title}

      </h2>





      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
      ">




        {

          items.map((item)=>(



            <div

              key={item.id}

              className="
                relative
                h-72
                rounded-3xl
                overflow-hidden
              "

            >




              <video

                src={item.media?.[0]?.url}

                autoPlay

                loop

                muted

                playsInline

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
                to-transparent
              "/>







              <div className="
                absolute
                bottom-5
                left-5
                right-5
              ">



                <h3 className="
                  text-xl
                  font-bold
                ">

                  {item.title}

                </h3>





                <p className="
                  text-gray-300
                  text-sm
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