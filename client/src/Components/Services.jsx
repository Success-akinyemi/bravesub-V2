import { useEffect, useState } from "react"
import { services } from "../data/services"
import { useSwipeable } from "react-swipeable"

function Services() {
    const [ currentPage, setCurrentPage ] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 640) {
            setItemsPerPage(9);
          } else if (window.innerWidth < 1024) {
            setItemsPerPage(4);
          } else {
            setItemsPerPage(6);
          }
        };
    
        handleResize(); // Set the initial itemsPerPage based on the current window size
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
    
    const totalPages = Math.ceil(services.length / itemsPerPage)

    const handleSwipe = (direction) => {
        if(direction === 'left' && currentPage < totalPages -1){
            setCurrentPage(currentPage + 1)
        }
        if(direction === 'right' && currentPage > 0){
            setCurrentPage(currentPage - 1)
        }
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'),
        onSwipedRight: () => handleSwipe('right'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    const displayServices = services.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handleDotClick = (pageIndex) => {
        setCurrentPage(pageIndex);
      };

      const swipeVariants = {
        initial: { x: 0 },
        left: { x: "-100%" }, 
        right: { x: "100%" }, 
      };
    
      const swipeTransition = { duration: 0.3, ease: "easeInOut" };

  return (
    <div className="p-3 pr-5 pl-5 h-[300px] flex flex-col">
        <div className="font-bold flex items-center justify-between">Services</div>

        <div {...handlers} className="flex overflow-x-hidden w-full flex-wrap">
            {
                displayServices.map((item, idx) => (
                    <div key={idx} className="m-4 flex flex-col items-center justify-center">
                        <img className="w-13 sm:w-10 phone:w-[20px]" src={item?.icon} alt={item?.service} />
                        <p className="font-semibold text-center">{item?.service}</p>
                    </div>
                ))
            }
        </div>

        <div className="flex items-center justify-center mt-auto gap-1">
            {
                Array.from({ length: totalPages }).map((_, idx) => (
                    <div key={idx} className={`h-1 cursor-pointer w-5 rounded-sm ${currentPage === idx ? 'bg-main-color': 'bg-gray-400'}`} onClick={() => handleDotClick(idx)}>

                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Services