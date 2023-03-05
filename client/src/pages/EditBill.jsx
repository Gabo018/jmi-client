import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'

export const EditBill = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [billing, setBilling] = useState({ name: '', contact: '', date: '' });
  const billingIdFetch = async () => {
    try {
      const billingResponse = await fetch(`/api/viewBill/${id}`)
      if (billingResponse.ok) {
        const billingJson = await billingResponse.json();
        setBilling(billingJson)
      }
    } catch (err) {
      console.log()
    }
  }
  const onChangeBilling = ({ target }) => {
    const { name, value } = target;
    setBilling(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitBilling = async () => {
    try {
      const updateBilling = await fetch(`/api/viewBill/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(billing)
      })
      if (updateBilling.ok) {
        const updateJson = await updateBilling.json();
        // console.log(updateJson)
        alert('Updated Successfully')
        navigate('/viewBill')
      }
    } catch (err) {
      console.log(err)
    }
  }

  function contactLimit(event) {
    if (event.target.value.length >= 11) {
      event.target.removeAttribute('type');
    }
    // setValue(event.target.value);
    setBilling((prev) => ({
      ...prev,
      ['contact']: event.target.value
    }))
  }

  useEffect(() => {
    billingIdFetch()
  }, [])

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 pb-20 h-screen">
      <Helmet>
        <title>Edit Billing</title>
        <meta name="edit billing" content="This is the Edit Billing Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Edit Billing
        </h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="flex gap-10">
          <div className=" leading-8 ">
            <div className='my-5'>
              <p><span className='font-bold'>Product Code:</span> {billing?.productCode}</p>
            </div>
            <label
              htmlFor="name"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Name:
            </label>
            <input
              name='name'
              type="text"
              id="name"
              placeholder="Name"
              value={billing?.name}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="contact"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Contact No:
            </label>
            <input
              name='contact'
              type="number"
              id="contact"
              onInput={contactLimit}
              maxLength={11}
              placeholder="Contact No."
              value={billing?.contact}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="date"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Date:
            </label>
            <input
              name='date'
              type="date"
              id="date"
              value={moment(billing?.date).format('YYYY-MM-DD')}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
          onClick={onSubmitBilling}
        >
          Edit Billing
        </button>
      </div>
    </div>
  )
}
