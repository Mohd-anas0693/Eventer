import React from 'react';
import * as yup from "yup";
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from 'react-router-dom';

// AddEventModal component
const AddEventModal = ({ buttonDisabled, crudEventHandler }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const required = t("addEventModal.required");
    const mustBeFuture = t("addEventModal.mustBeFuture");
    const greaterThanStart = t("addEventModal.greaterThanStart");

    // Validation schema using yup
    const validationSchema = yup.object(
        {
            event_name: yup.string().test('is-non-empty', required, (value) => /\S/.test(value)).required(required),
            start_date_time:
                yup.string()
                    .test('is-non-empty', required, (value) => /\S/.test(value))
                    .required(required)
                    .test('is-future-date', mustBeFuture, (value) => {
                        const selectedDate = new Date(value).getTime();
                        const currentDateTime = new Date().getTime();
                        return selectedDate > currentDateTime || isNaN(selectedDate);
                    }),
            end_date_time:
                yup.string()
                    .test('is-non-empty', required, (value) => /\S/.test(value))
                    .required(required)
                    .test('is-future-date', mustBeFuture, (value) => {
                        const selectedDate = new Date(value).getTime();
                        const currentDateTime = new Date().getTime();
                        return selectedDate > currentDateTime || isNaN(selectedDate);
                    })
                    .test('is-greater-than-start', greaterThanStart, function (value) {
                        const { start_date_time } = this.parent;
                        const startDate = new Date(start_date_time).getTime();
                        const endDate = new Date(value).getTime();
                        return endDate > startDate;
                    }),
            event_description: yup.string().test('is-non-empty', required, (value) => /\S/.test(value)).required(required),
        }
    ).required();

    // React Hook Form
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema), mode: "all", defaultValues: { event_name: '', start_date_time: '', end_date_time: '', event_description: '' } });

    // Form submit handler
    const submit = (val) => {
        const result = crudEventHandler(val);
        if (result === true) {
            reset();
        }
    }

    // Handle arrow key events
    const handleKeyArrowDown = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    };

    return (
        <div className="w-full lg:w-2/4 h-full flex items-start justify-center">
            <div className="bg-white px-4 py-7 rounded-xl w-full md:w-4/5 my-4 shadow-lg ">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="flex flex-col mb-4">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">{t("addEventModal.createEvent")} </h2>
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="event_name">{t("addEventModal.eventName")}</label>
                        <input
                            type='text'
                            className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`}
                            placeholder={t("addEventModal.enterEventName")}
                            disabled={buttonDisabled}
                            style={{ border: (errors?.event_name?.message) ? "2px solid red" : "2px solid #ced4da" }}
                            {...register('event_name')} />
                        {errors?.event_name && <span className='text-red-500 flex justify-end text-sm'>{errors?.event_name?.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="start_date_time">{t("addEventModal.startDateTime")} </label>
                        <Controller
                            name="start_date_time"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    value={field.value || ''}
                                    type="datetime-local"
                                    id={`start_date_time`}
                                    disabled={buttonDisabled}
                                    onChange={(e) => { field.onChange(e.target.value); setValue('start_date_time', e.target.value) }}
                                    className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`} onKeyDown={handleKeyArrowDown}
                                    style={{ border: errors?.start_date_time ? '1px solid red' : '1px solid #ced4da' }}
                                />
                            )}
                        />
                        {errors?.start_date_time && <span className={`text-red-500 flex justify-end text-sm`}> {errors?.start_date_time?.message} </span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="end_date_time">{t("addEventModal.endDateTime")} </label>
                        <Controller
                            name="end_date_time"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    value={field.value || ''}
                                    type="datetime-local"
                                    id={`end_date_time`}
                                    disabled={buttonDisabled}
                                    onChange={(e) => { field.onChange(e.target.value); setValue('end_date_time', e.target.value) }}
                                    className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`} onKeyDown={handleKeyArrowDown}
                                    style={{ border: errors?.end_date_time ? '1px solid red' : '1px solid #ced4da' }}
                                />
                            )}
                        />
                        {errors?.end_date_time && <span className={`text-red-500 flex justify-end text-sm`}> {errors?.end_date_time?.message} </span>}
                    </div>
                    <div className="mb-4">
                        <label className="font-semibold text-gray-600" htmlFor="event_description">{t("addEventModal.eventDescription")}</label>
                        <textarea
                            rows={2}
                            className={`w-full p-2 rounded-md mt-1 ${buttonDisabled ? 'bg-gray-400' : ''}`}
                            placeholder={t("addEventModal.enterEventDescription")}
                            disabled={buttonDisabled}
                            style={{ border: (errors?.event_description?.message) ? "2px solid red" : "2px solid #ced4da" }}
                            {...register('event_description')}>
                        </textarea>
                        {errors?.event_description && <span className='text-red-500 flex justify-end text-sm'>{errors?.event_description?.message}</span>}
                    </div>
                    <div className="flex justify-center">
                        {buttonDisabled ?
                            <button disabled={true} className={`bg-blue-700 text-white border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl border-blue-700`}>{t("addEventModal.submitting")}</button> :
                            <button type='submit' className={`bg-white text-blue-900 border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl hover:bg-blue-900 hover:text-white duration-300 ease-in-out border-blue-900`}>{t("addEventModal.submit")}</button>
                        }
                        <button onClick={() => { reset(); navigate(-1) }} className={`bg-white text-red-700 border-2  px-6 font-semibold py-1 rounded-md mr-2 md:w-auto text-xl hover:bg-red-700 hover:text-white duration-300 ease-in-out border-red-700`}>{t('addEventModal.cancel')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;
