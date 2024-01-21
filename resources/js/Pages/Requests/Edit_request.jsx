import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import NumberInput from '@/Components/NumberInput';
import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';
import { useState } from 'react'

export default function Edit_request({ auth ,inputDetailRequests,id_template,templateName,userList,request_template,userRequest }) {
    const result = {};
    inputDetailRequests.forEach(item => {
        if (item.input_name && typeof item.input_value !== 'object') {
            result[item.input_name] = item.input_value || '';
        }
    });

    const [values, setValues] = useState(result)
    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
      }

    const onSubmit = (e) => {
        e.preventDefault();

        post(route('Create_User_Request')).then(response => {
            if (response.status === 200) {
                window.location.href = route('dashboard');
            }
        });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cập nhập đề xuất:</h2>}
        >
            <Head title="Create Request" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="">Cập nhập đề xuất: </h1>
                           <hr />
                           <div className="p-6">
                            <form onSubmit={onSubmit} method='POST' encType="multipart/form-data">
                                <input type="hidden" value={auth.user.id} />
                                <input type="hidden" value={request_template.user_request_category} />
                                <input type="hidden" value={id_template} />
                                <div className="my-6">
                                    <label htmlFor="">Tiêu đề</label>
                                    <input onChange={handleChange} value={userRequest.request_name} required="" type="text" name="request_name" id="" placeholder="" className="block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                {
                                   inputDetailRequests.map((input, index) =>
                                        input.input_type === 'select' ? (
                                            /**
                                             * Nếu là Select input
                                             */
                                            <div className="my-6" key={index}>
                                                <label htmlFor="">{input.input_description}</label>
                                                <select onChange={handleChange}  value={values[input.input_name]!== null ? values[input.input_name] : ""} required={input.required} name={input.input_name} id="" className="block w-full p-2 border border-gray-300 rounded-md">
                                                    <option>Chọn</option>
                                                    {
                                                        input.default_value && input.default_value.split(',').map((option) => {
                                                            const trimmedOption = option.trim();
                                                            return <option value={trimmedOption}>{option}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        ) :
                                        /*
                                        * *Nếu là Text Area
                                        */
                                         input.input_type === 'textarea' ? (
                                            <div className="my-6" key={index}>
                                            <label htmlFor="">{input.input_description}</label>
                                            <textarea onChange={handleChange} required={input.required} name={input.input_name} id="" cols="30" rows="10" placeholder={input.placeholder} value={values[input.input_name]} className="block w-full p-2 border border-gray-300 rounded-md"> </textarea>
                                        </div>
                                        ) :
                                        /** Select người duyệt */
                                        (input.input_type === 'follower'||input.input_type === 'approver') ? (
                                            <div className="my-6" key={index}>
                                                <label htmlFor={input.input_name}>{input.input_description}</label>
                                                {auth.user.direct_manager && (
                                                    <div className="my-6" key={index}>
                                                        <input
                                                            type="text"
                                                            value={userList[auth.user.direct_manager]}
                                                            className="block w-full p-2 border border-gray-300 rounded-md"
                                                            readOnly
                                                            disabled
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) :
                                        /** Nếu là input number */
                                        (input.input_type === 'number') ? (
                                            <div className="my-6" key={index}>
                                                <label htmlFor="">{input.input_description}</label>
                                                <NumberInput
                                                value={values[input.input_name]!== null ? values[input.input_name] : ""}
                                                name={input.input_name}></NumberInput>
                                            </div>
                                        ) :
                                        (input.input_type === 'file') ? (
                                            <div className="my-6" key={index}>
                                                <label htmlFor="">{input.input_description}</label>
                                                <a className='text-green-500 font-bold' href={input.input_value} download>
                                                    Tải file
                                                </a>
                                                <input type="file" name={input.input_name} id="" className="block w-full p-2 border border-gray-300 rounded-md" />
                                            </div>
                                        ) :
                                        // Nếu là input thông thường
                                        (
                                            <div className="my-6" key={index}>
                                                <label htmlFor={input.input_name}>{input.input_description}</label>
                                                <input
                                                value={values[input.input_name]!== null ? values[input.input_name] : ""}
                                                onChange={handleChange}
                                                required={input.required}
                                                type={input.input_type}
                                                name={input.input_name} id={input.input_name} placeholder={input.placeholder} className="block w-full p-2 border border-gray-300 rounded-md" />
                                            </div>
                                        )
                                    )
                                }
                                <PrimaryButton type="submit">Chỉnh sửa request</PrimaryButton>
                                <DangerButton type="reset">Reset</DangerButton>
                            </form>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
