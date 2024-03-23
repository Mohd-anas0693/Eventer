import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../utils/useAuthClient";
import { getValueByKeyFromString } from "../utils/getValueByKeyFromString";
import Loader from "../utils/Loader";

// Component for claiming a seat
const ClaimSeat = () => {
  const { backendActor } = useAuth();
  const [isClaimed, setIsClaimed] = useState(null);
  const [seatNo, setSeatNo] = useState(null);
  const [noEvent, setNoEvent] = useState(null);
  const [eventData, setEventData] = useState(null);
  const event = Cookies.get("event_id");
  const hexCode = Cookies.get("unique_code");

  // Function to fetch single event data
  const fetchSingleEventData = async () => {
    try {
      const response = await backendActor.getEvent(event);
      if (response) {
        let event_name = response?.eventInfo?.name ?? 'No Name';
        setEventData({ name: event_name })
      }
    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Message");
      toast.error(errMessage);
      setEventData(null);
      return false;
    }
  }

  // Handler function to claim a seat
  const claimSeatHandler = async () => {
    try {
      const response = await backendActor.validateUserQrCode(event, hexCode);
      toast.success(response);
      setIsClaimed(true);
      window.location.reload();
      return true;

    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Reject text");
      toast.error(errMessage);
      setIsClaimed(false);
      return false;
    }
  };

  // Function to check if the seat is already claimed
  const isAlreadyClaimed = async () => {

    try {
      const result = await backendActor.getUserSeat(event);
      if (!result || result.length == 0) {
        setIsClaimed(false);
      } else {
        setSeatNo(result[0]?.seatNo ? Number(result[0]?.seatNo) : null)
        setIsClaimed(true);
      }
    } catch (error) {
      let errMessage = getValueByKeyFromString(error.toString(), "Message");
      toast.error(errMessage);
      setIsClaimed(false);
      return false;
    }
  }

  useEffect(() => {
    if (!event || !hexCode) {
      setNoEvent(true)
    } else {
      setNoEvent(false);
      fetchSingleEventData();
      isAlreadyClaimed();
    }
  }, []);

  return (
    <>
      {noEvent === null ? <Loader /> :
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#f1f1f1]">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-4 sm:p-6 md:p-10 lg:p-10 xl:p-12 2xl:p-14 bg-white rounded-xl shadow-lg flex flex-col gap-4 lg:py-1 md:py-4 sm:py-6">
            {noEvent === true ?
              <div className="flex justify-start text-justify h-full cursor-pointer my-2">
                <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">
                  <span className="font-semibold text-blue-900 mx-2">"Something went wrong.</span>You do not have access to enter this event because your event ID and hex code are missing. Please rescan the QR code for the ICP event. If the issue persists, contact our support team for assistance."
                </p>
              </div> : <>
                <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4 mb-4">{eventData?.name ?? 'Event Name'} </h2>
                <div className="flex justify-start text-justify mt-[-20px] h-2/4 cursor-pointer my-2">
                  <p className="text-justify text-md sm:text-lg md:text-lg text-gray-600 lg:my-6 md:my-2 sm:my-1 max-h-32 overflow-y-auto px-4">
                    {!isClaimed ?
                      "Great to see you've logged in! You're now ready to claim your seat number for the ICP Event. Simply click the 'Claim Seat' button to get started. This number is key to accessing event materials and participating fully. If you run into any issues or have questions, our support team is here to assist you. Enjoy the event!"
                      :
                      `Welcome to ${eventData?.name ?? 'Event Name'}! Your login via ICP has been successful, and you've claimed your seat with Number: ${seatNo || null}. This number is key to your engagement and experiences throughout the event. Should you have any questions or require assistance at any point, our support team is here to help. Enjoy your time at the event!`}
                  </p>
                </div>
                <div className="w-full flex justify-center">
                  <button className={`${isClaimed ? `bg-green-700 text-white border-green-700` : `bg-white hover:bg-blue-900`} border-2  text-blue-900 px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl  hover:text-white duration-300 ease-in-out border-blue-900`} onClick={() => { !isClaimed ? claimSeatHandler() : "" }}>
                    {isClaimed ? `Already Claimed` : `Claim Seat`}
                  </button>
                </div>
              </>}
          </div>
        </div>}
      <Toaster />
    </>
  );
};

export default ClaimSeat;
