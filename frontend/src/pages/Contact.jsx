import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img className='w-full md:max-[480px]' src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>B501, Alaya Heights <br />Malabar County RD, Ahmedabad, Gujarat, India.</p>
          <p className='text-gray-500'> Tel: +91 9724645974 <br/> Email: 21bce101@nirmauni.ac.in</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at BoldBuy</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className="border border-blacck px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            View Openings
          </button>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default Contact