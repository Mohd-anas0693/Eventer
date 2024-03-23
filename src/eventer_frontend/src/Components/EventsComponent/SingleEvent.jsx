import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { getValueByKeyFromString } from "../utils/getValueByKeyFromString";
import { useNavigate } from "react-router-dom";
import { convertDateToNanoSeconds } from "../utils/nanoToDateTime";
import showEvent from "../../../assets/showEvent.png";
import toast, { Toaster } from 'react-hot-toast';
import Loader from "../utils/Loader";
import moment from "moment";
import EditEventModal from "../utils/EditEventModal";
import DeleteEvent from "../utils/DeleteEvent";
import noEvents from "../../../assets/calender.png";
import SingleEventCard from "../utils/SingalEventCard";

const SingleEvent = () => {
    const navigate = useNavigate();
    const { URLSearchParams } = window;
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event_id');
    const { backendActor, isAdmin } = useAuth();
    const [eventData, setEventData] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [editEvent, setEditEvent] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState(false);

    // Function to handle event deletion
    const deleteEventHandler = async () => {
        setDeleteEvent(false);
        setIsLoading(true);
        try {
            await backendActor.deleteEvent(eventId).then((res) => {
                setIsLoading(false);
                if (res === 'successfully deleted event') {
                    navigate('/dashboard')
                    return true;
                }
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error);
                return false;
            });
        } catch (error) {
            let errMessage = getValueByKeyFromString(error.toString(), "Reject text");
            toast.error(errMessage);
            setIsLoading(false);
            return false;
        }
    }

    // Function to handle event editing
    const editEventHandler = async (val) => {
        setIsLoading(true);
        let data =
        {
            name: val?.event_name || "",
            description: val?.event_description || "",
            startTime: convertDateToNanoSeconds(val?.start_date_time)?.toString() || "",
            endTime: convertDateToNanoSeconds(val?.end_date_time)?.toString() || "",
        }
        try {
            await backendActor.editEvent(eventId || "", data).then((res) => {
                toast.success(res)
                setIsLoading(false);
                navigate('/dashboard');
                return true;
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error);
                return false;
            });
        } catch (error) {
            setIsLoading(false);
            let errMessage = getValueByKeyFromString(error.toString(), "invalid data..Error");
            toast.error(errMessage);
            return false;
        }
    };

    // Function to fetch single event data
    const fetchSingleEventData = async () => {
        try {
            const response = await backendActor.getEvent(eventId);
            if (response) {
                let nowTime = moment().valueOf() * 1e6;
                let event_name = response?.eventInfo?.name ?? 'No Name';
                let event_desc = response?.eventInfo?.description ?? 'No Description';
                let event_start = response?.eventInfo?.startTime ? parseInt(response?.eventInfo?.startTime) : null;
                let event_end = response?.eventInfo?.endTime ? parseInt(response?.eventInfo?.endTime) : null;
                let event_status = (event_start && event_end)
                    ? nowTime < event_start
                        ? "Upcoming" : nowTime > event_start && nowTime < event_end
                            ? "Ongoing" : nowTime > event_start && nowTime > event_end
                                ? "Past" : 'No Status' : 'No Status';
                let event_total_seats = response?.eventData?.totalSeats.length ?? 0;
                let event_claimed_seats = response?.eventData?.claimedSeats.length ?? 0;

                setEventData({
                    name: event_name,
                    description: event_desc,
                    startTime: event_start || null,
                    endTime: event_end || null,
                    status: event_status,
                    totalSeats: event_total_seats,
                    claimedSeats: event_claimed_seats,
                });

                setIsLoading(false);
            }
        } catch (error) {
            let errMessage = getValueByKeyFromString(error.toString(), "Message");
            toast.error(errMessage);
            setEventData('no-data');
            setIsLoading(false);
            return false;
        }
    }

    // Effect hook to check user authentication and fetch event data
    useEffect(() => {
        if (isAdmin === true) {
            fetchSingleEventData();
        } else if (isAdmin === false) {
            navigate('/');
        }
    }, []);

    return (
        <>
            <div className="w-full bg-[#f1f1f1] flex md:py-4 py-2 px-4 justify-center items-center" style={{ height: `calc(100vh - 95px)` }}>
                {(isLoading == true || !eventData)
                    ? <Loader /> : (eventData && eventData == 'no-data')
                        ? <div className="flex justify-center items-center w-full h-screen mt-4 overflow-y-auto px-4">
                            <div className="flex flex-col items-center gap-2">
                                <img src={noEvents} alt="No Events" />
                                <p className="text-2xl font-bold">
                                    No Event Found
                                </p>
                            </div>
                        </div>
                        : <>
                            <div className="items-center justify-center w-2/4 lg:flex hidden">
                                <img src={showEvent} alt="Create Event" className="drop-shadow-xl w-3/4 object-cover" />
                            </div>
                            {editEvent
                                ? <EditEventModal buttonDisabled={false} changeStatus={setEditEvent} filledValues={eventData} crudEventHandler={editEventHandler} />
                                : eventData && eventData !== 'no-data' && <SingleEventCard eventData={eventData} setEditEvent={setEditEvent} setDeleteEvent={setDeleteEvent} />
                            }
                        </>
                }
            </div>
            <DeleteEvent show={deleteEvent} onHide={() => setDeleteEvent(false)} deleteHandler={deleteEventHandler} />
            <Toaster />
        </>
    );
};

export default SingleEvent;
