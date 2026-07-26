"use client";

type Props = {
  filters: string[];
};


export default function FilterBar({ filters }: Props) {


  return (

    <div
      className="
      fixed
      top-24
      left-0
      right-0
      z-40
      flex
      gap-3
      overflow-x-auto
      px-5
      no-scrollbar
      "
    >

      {
        filters.map((filter, index) => (

          <button

            key={filter}

            className={`
              shrink-0
              rounded-full
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-300
              border
              backdrop-blur-xl

              ${
                index === 0
                  ? "bg-green-500/20 text-green-300 border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }
            `}

          >

            {filter}

          </button>

        ))
      }


    </div>

  );

}