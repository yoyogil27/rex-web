type Props = {

  organization?: {

    name: string;

    type: string;

    verified: boolean;

  };


  place: {

    description: string;

    location: string;

    category?: string;

    rating?: number;

    amenities?: string[];

  };

};



export default function PlaceInfo({

  organization,

  place

}: Props) {



  return (

    <section

      className="
        px-6
        py-10
      "

    >


      <div

        className="
          rounded-3xl
          bg-white/5
          border
          border-white/10
          p-6
        "

      >



        <div

          className="
            flex
            justify-between
            items-start
            gap-5
          "

        >



          <div>


            <h2

              className="
                text-2xl
                font-black
              "

            >

              {organization?.name}

            </h2>




            <p

              className="
                text-green-400
                font-semibold
                mt-1
              "

            >

              {place.category ?? organization?.type}

            </p>


          </div>





          {

            organization?.verified && (

              <span

                className="
                  bg-green-500/20
                  text-green-400
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-bold
                "

              >

                Verified ✓

              </span>

            )

          }


        </div>






        {

          place.rating && (

            <p

              className="
                mt-5
                text-yellow-400
                font-bold
              "

            >

              ★ {place.rating}

            </p>

          )

        }







        <p

          className="
            mt-5
            text-white/70
            leading-relaxed
          "

        >

          {place.description}

        </p>







        {

          place.amenities && (

            <div

              className="
                mt-8
                grid
                grid-cols-2
                md:grid-cols-3
                gap-3
              "

            >

              {

                place.amenities.map((item)=>(


                  <div

                    key={item}

                    className="
                      rounded-2xl
                      bg-black/30
                      border
                      border-white/10
                      p-4
                      text-center
                      text-sm
                    "

                  >

                    {item}

                  </div>


                ))

              }


            </div>

          )

        }



      </div>


    </section>

  );

}