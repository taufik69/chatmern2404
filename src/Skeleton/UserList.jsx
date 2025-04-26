export const UserListSkeleton = ()=> {
    return (
        <div className="shadow-2xs mt-3 animate-pulse p-10">
        <div className="flex items-center justify-between">
          <h1 className="relative w-32 h-6 bg-gray-700 rounded"></h1>
          <span className="w-5 h-5 rounded-full bg-gray-600" />
        </div>

        <div className="overflow-y-scroll h-[38dvh] scrollable-content mt-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={
                index === 4
                  ? "flex items-center justify-between mt-3 pb-2"
                  : "flex items-center justify-between mt-3 border-b border-b-gray-800 pb-2"
              }
            >
              <div className="w-[50px] h-[50px] rounded-full bg-gray-700" />
              <div className="flex-1 ml-3">
                <div className="w-24 h-4 bg-gray-700 rounded mb-1"></div>
                <div className="w-40 h-3 bg-gray-600 rounded"></div>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
}