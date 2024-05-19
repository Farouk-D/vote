import { useCallback, useEffect, useState } from "react";

const Timer3 = ({ dateEnd }) => {
  const [countDownTime, setCountDownTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [timeOver,setTimeOver] = useState(false)

  const getTimeDifference = (endTime) => {
    const currentTime = new Date().getTime();
    const timeDifference = new Date(endTime).getTime() - currentTime;
    console.log(countDownTime)
    if (timeDifference < 0) {
      setCountDownTime({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
      setTimeOver(true)
      return;
    }

    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

    setCountDownTime({
      days: days < 10 ? `0${days}` : days.toString(),
      hours: hours < 10 ? `0${hours}` : hours.toString(),
      minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
      seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
    });
  };

  const startCountDown = useCallback(() => {
    const interval = setInterval(() => {
      getTimeDifference(dateEnd);
    }, 1000);

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage
  }, [dateEnd]);

  useEffect(() => {
    const stopCountDown = startCountDown();
    return stopCountDown;
  }, [startCountDown]);

  return (
    <div className="h-[5vh]">
      <div className="flex flex-col items-center justify-center w-full h-full gap-8 sm:gap-16">
        <div className="flex justify-center gap-4 sm:gap-8">
          <div className="flex flex-col relative">
            <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-30 lg:h-30 flex justify-between items-center bg-[#161618] rounded-lg">
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-transparent "></div>
              <span className={`lg:text-7xl sm:text-6xl text-3xl font-semibold ${timeOver ? "text-red-600":"text-yellow-600"} `}>
                {countDownTime.days}
              </span>
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-transparent "></div>
            </div>
            <span className={`${timeOver ? "text-red-600":"text-yellow-600"} text-xs sm:text-2xl text-center capitalize`}>
              {countDownTime.days == 1 ? "Jour" : "Jours"}
            </span>
          </div>
          <div className="flex flex-col relative">
            <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-30 lg:h-30 flex justify-between items-center bg-[#161618] rounded-lg">
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-transparent "></div>
              <span className={`lg:text-7xl sm:text-6xl text-3xl font-semibold ${timeOver ? "text-red-600":"text-yellow-600"} `}>
                {countDownTime.hours}
              </span>
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-transparent "></div>
            </div>
            <span className={`${timeOver ? "text-red-600":"text-yellow-600"} text-xs sm:text-2xl text-center capitalize`}>
              {countDownTime.hours == 1 ? "Heure" : "Heures"}
            </span>
          </div>
          <div className="flex flex-col relative">
            <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-30 lg:h-30 flex justify-between items-center bg-[#161618] rounded-lg">
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-transparent "></div>
              <span className={`lg:text-7xl sm:text-6xl text-3xl font-semibold ${timeOver ? "text-red-600":"text-yellow-600"} `}>
                {countDownTime.minutes}
              </span>
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-transparent "></div>
            </div>
            <span className={`${timeOver ? "text-red-600":"text-yellow-600"} text-xs sm:text-2xl text-center capitalize`}>
              {countDownTime.minutes == 1 ? "Minute" : "Minutes"}
            </span>
          </div>
          <div className="flex flex-col relative">
            <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-30 lg:h-30 flex justify-between items-center bg-[#161618] rounded-lg">
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-transparent "></div>
              <span className={`lg:text-7xl sm:text-6xl text-3xl font-semibold ${timeOver ? "text-red-600":"text-yellow-600"} `}>
                {countDownTime.seconds}
              </span>
              <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-transparent "></div>
            </div>
            <span className={`${timeOver ? "text-red-600":"text-yellow-600"} text-xs sm:text-2xl text-center capitalize`}>
              {countDownTime.seconds == 1 ? "Seconde" : "Secondes"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer3;