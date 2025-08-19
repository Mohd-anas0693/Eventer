import React from 'react';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { convertNanosecondsToInputFillDate } from './nanoToDateTime';

const EditEventModal = ({ buttonDisabled, changeStatus, filledValues, crudEventHandler }) => {

    const validationSchema = yup.object(
        {
            event_name: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required('Required'),
            start_date_time:
                filledValues?.status === 'Past' || filledValues?.status === 'Ongoing' ?
                    yup.string() :
                    yup.string()
                        .test('is-non-empty', 'Required', (value) => /\S/.test(value))
                        .required('Required')
                        .test('is-future-date', 'Date must be in the future', (value) => {
                            const selectedDate = new Date(value).getTime();
                            const currentDateTime = new Date().getTime();
                            return selectedDate > currentDateTime || isNaN(selectedDate);
                        }),
            end_date_time:
                filledValues?.status === 'Past' ?
                    yup.string() :
                    yup.string()
                        .test('is-non-empty', 'Required', (value) => /\S/.test(value))
                        .required('Required')
                        .test('is-future-date', 'Date must be in the future', (value) => {
                            const selectedDate = new Date(value).getTime();
                            const currentDateTime = new Date().getTime();
                            return selectedDate > currentDateTime || isNaN(selectedDate);
                        })
                        .test('is-greater-than-start', 'End date must be greater than start date', function (value) {
                            const { start_date_time } = this.parent;
                            const startDate = new Date(start_date_time).getTime();
                            const endDate = new Date(value).getTime();
                            return endDate > startDate;
                        }),
            event_description: yup.string().test('is-non-empty', 'Required', (value) => /\S/.test(value)).required('Required'),
        }
    ).required();

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema), mode: "all",
        defaultValues:
        {
            event_name: filledValues?.name || "",
            start_date_time: filledValues?.startTime ? convertNanosecondsToInputFillDate(filledValues?.startTime) : "",
            end_date_time: filledValues?.endTime ? convertNanosecondsToInputFillDate(filledValues?.endTime) : "",
            event_description: filledValues?.description || ""
        }
    });

    const submit = (val) => {
        const result = crudEventHandler(val);
        if (result === true) {
            reset();
        }
    }

    const handleKeyArrowDown = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    };

    return (
        <div className="w-full lg:w-2/4 h-full flex items-start justify-start">
            <div className="bg-white px-4 py-7 rounded-xl w-full lg:w-[600px] mb-2 mt-2 my-16 shadow-lg ">
                <div className='flex justify-end'>
                    <div className={`shadow-xl px-2 text-white rounded-full uppercase border-[2px] ${filledValues?.status === 'Upcoming' ? `border-yellow-700 bg-yellow-700` : filledValues?.status === 'Ongoing' ? `border-green-700 bg-green-700` : filledValues?.status === 'Past' ? `border-red-700 bg-red-700` : 'border-black bg-black'}`}>
                        <p className='text-xs font-semibold'>{filledValues?.status ?? "Loading"}</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="flex flex-col mb-4">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">
                            Edit Event
                        </h2>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="event_name">Event Name</label>
                        <input
                            type='text'
                            className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`}
                            placeholder='Enter Event Name'
                            disabled={buttonDisabled}
                            style={{ border: (errors?.event_name?.message) ? "2px solid red" : "2px solid #ced4da" }}
                            {...register('event_name')} />
                        {errors?.event_name && <span className='text-red-500 flex justify-end text-sm'>{errors?.event_name?.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="start_date_time">Start Date & Time </label>
                        <Controller
                            name="start_date_time"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    value={field.value || ''}
                                    type="datetime-local"
                                    id={`start_date_time`}
                                    disabled={buttonDisabled || filledValues?.status === 'Past' || filledValues?.status === 'Ongoing'}
                                    onChange={(e) => { field.onChange(e.target.value); setValue('start_date_time', e.target.value) }}
                                    className={`w-full p-2 rounded-md mt-1 ${(buttonDisabled || filledValues?.status === 'Past' || filledValues?.status === 'Ongoing') ? 'bg-gray-400' : ''}`} onKeyDown={handleKeyArrowDown}
                                    style={{ border: errors?.start_date_time ? '1px solid red' : '1px solid #ced4da' }}
                                />
                            )}
                        />
                        {errors?.start_date_time && <span className={`text-red-500 flex justify-end text-sm`}> {errors?.start_date_time?.message} </span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="end_date_time">End Date & Time </label>
                        <Controller
                            name="end_date_time"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    value={field.value || ''}
                                    type="datetime-local"
                                    id={`end_date_time`}
                                    disabled={buttonDisabled || filledValues?.status === 'Past'}
                                    onChange={(e) => { field.onChange(e.target.value); setValue('end_date_time', e.target.value) }}
                                    className={`w-full p-2 rounded-md mt-1 ${(buttonDisabled || filledValues?.status === 'Past') ? 'bg-gray-400' : ''}`} onKeyDown={handleKeyArrowDown}
                                    style={{ border: errors?.end_date_time ? '1px solid red' : '1px solid #ced4da' }}
                                />
                            )}
                        />
                        {errors?.end_date_time && <span className={`text-red-500 flex justify-end text-sm`}> {errors?.end_date_time?.message} </span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="event_description">Event Description</label>
                        <textarea
                            rows={2}
                            className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`}
                            placeholder='Enter Event Description'
                            disabled={buttonDisabled}
                            style={{ border: (errors?.event_description?.message) ? "2px solid red" : "2px solid #ced4da" }}
                            {...register('event_description')}>
                        </textarea>
                        {errors?.event_description && <span className='text-red-500 flex justify-end text-sm'>{errors?.event_description?.message}</span>}
                    </div>
                    <div className="flex justify-center">
                        {buttonDisabled ?
                            <button disabled={true} className={`bg-blue-700 text-white border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl border-blue-700`}>
                                Submitting...
                            </button> :
                            <button type='submit' className={`bg-white text-blue-900 border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl hover:bg-blue-900 hover:text-white duration-300 ease-in-out border-blue-900`}>
                                Update
                            </button>}
                        <button onClick={() => changeStatus(false)} className={`bg-white text-red-700 border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl hover:bg-red-700 hover:text-white duration-300 ease-in-out border-red-700`}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
