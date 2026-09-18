
"use client"

export default function ResetView({resetView}:{resetView:()=>void}){



        return <button className="absolute bottom-2 right-2 py-2 px-4 rounded-md active:scale-95 bg-slate-500 text-white/90 cursor-pointer" onClick={resetView}>
                ResetView
        </button>
}