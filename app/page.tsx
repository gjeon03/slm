export default function Home() {
  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col  max-w-3xl w-full gap-2">
        <div className="flex gap-2 mt-3 ml-3">
          <h1 className="text-5xl font-extrabold text-[#FBFBFB] text-outline">
            SLM
          </h1>
          <div className="flex items-end text-[#FBFBFB] text-outline">
            <span>Short Link Manager</span>
          </div>
        </div>
        <div className="flex bg-white flex-1 rounded-t-3xl p-6 flex-col gap-2 shadow-xl">
          <div className="flex gap-2">
            <div className="border-2 px-2 rounded-md w-14 flex justify-center border-[#ffddae]">
              100
            </div>
            <ul className="flex gap-1">
              <li className="border rounded-md w-12 flex justify-center items-center border-[#ffddae]">
                min
              </li>
              <li className="border rounded-md w-12 flex justify-center items-center border-[#ffddae]">
                hour
              </li>
              <li className="border border-[#ffddae] rounded-md w-12 flex justify-center items-center bg-[#ffddae]">
                day
              </li>
            </ul>
          </div>
          <div className="flex gap-1">
            <div className="flex-1 border-2 border-[#ffddae] rounded-md p-2">
              input
            </div>
            <div className="w-30 flex justify-center items-center rounded-md bg-[#ffddae] text-[#FBFBFB] text-outline font-extrabold">
              Create
            </div>
          </div>
          <div className="bg-[#ffddae] w-full h-48 rounded-md"></div>
          <div className="bg-[#ffddae] w-full min-h-80 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
