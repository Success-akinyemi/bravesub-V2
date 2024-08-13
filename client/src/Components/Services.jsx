import { useEffect, useState } from "react"
import { services } from "../data/services"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";


function Services() {
    const [ currentPage, setCurrentPage ] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [swipeDirection, setSwipeDirection] = useState(null);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 640) {
            setItemsPerPage(5);
          } else if (window.innerWidth < 1024) {
            setItemsPerPage(4);
          } else {
            setItemsPerPage(5);
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
          setSwipeDirection('left');  
          setCurrentPage(currentPage + 1)
        }
        if(direction === 'right' && currentPage > 0){
          setSwipeDirection('right');  
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
        enter: (direction) => {
            return {
                x: direction === 'left' ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction) => {
            return {
                x: direction === 'left' ? -1000 : 1000,
                opacity: 0,
                transition: {
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                }
            };
        }
    };

      const swipeTransition = { duration: 0.3, ease: "easeInOut" };

  return (
    <div className="p-3 pr-5 pl-5 h-[300px] phone:h-[210px] flex flex-col">
        <div className="font-bold flex items-center justify-between small-phone:text-[15px]">Services</div>

        <div {...handlers} className="relative flex overflow-hidden w-full flex-wrap">
          <AnimatePresence initial={false} custom={swipeDirection}>
            <motion.div
              key={currentPage}
              custom={swipeDirection}
              variants={swipeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative flex flex-wrap w-full"
              >
                {
                    displayServices.map((item, idx) => (
                        <Link to={`/${item.link}`} key={idx} className="m-4 flex flex-col items-center justify-center">
                            <img className="w-13 sm:w-10 phone:w-[20px]" src={item?.icon} alt={item?.service} />
                            <p className="font-semibold text-center phone:text-[13px]">{item?.service}</p>
                        </Link>
                    ))
                }
              </motion.div>
          </AnimatePresence>
        </div>
        {/**
          <div {...handlers} className="flex overflow-x-hidden w-full flex-wrap">
          </div>
        */}

        <div className="flex items-center justify-center mt-auto gap-1">
            {
                Array.from({ length: totalPages }).map((_, idx) => (
                    <div key={idx} className={`h-1 cursor-pointer w-5 small-phone:w-[17px] rounded-sm ${currentPage === idx ? 'bg-main-color': 'bg-gray-400'}`} onClick={() => handleDotClick(idx)}>

                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Services