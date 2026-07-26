"use client";

import { useState } from "react";


type Props = {

onChange:(tab:string)=>void;

};


export default function PlaceTabs({
onChange
}:Props){


const tabs=[

"Overview",
"Explore",
"Stay",
"Events"

];


const [active,setActive]=useState("Overview");



function change(tab:string){

setActive(tab);

onChange(tab);

}



return (

<div className="
sticky
top-20
z-40
flex
gap-3
px-6
py-4
bg-black/60
backdrop-blur-xl
overflow-x-auto
">


{
tabs.map(tab=>(

<button

key={tab}

onClick={()=>change(tab)}

className={`
px-5
py-2
rounded-full
text-sm
transition

${
active===tab

?

"bg-green-400 text-black font-bold"

:

"bg-white/10 text-white"

}

`}

>

{tab}

</button>

))

}


</div>

)

}