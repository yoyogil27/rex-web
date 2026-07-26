import type { Organization } from "@/types";


type Props = {

  organization?: Organization;

};



export default function OrganizationCard({

  organization

}: Props) {


  if (!organization) return null;


  return (

    <section

      className="
        mx-6
        my-8
        p-6
        rounded-3xl
        bg-white/5
        border
        border-white/10
      "

    >


      <div className="
        flex
        items-center
        justify-between
      ">


        <div>


          <h2 className="
            text-2xl
            font-black
          ">

            {organization.name}

          </h2>



          <p className="
            text-white/60
            mt-1
          ">

            {organization.type}

          </p>


        </div>





        {
          organization.verified && (

            <span

              className="
                px-3
                py-1
                rounded-full
                bg-green-500/20
                text-green-400
                text-sm
                font-bold
              "

            >

              ✓ Verified

            </span>

          )
        }


      </div>


    </section>

  );

}