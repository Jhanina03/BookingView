import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from '../components/HotelCard'

const FeauteredDestination = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50'>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {roomsDummyData.slice(0,4).map((room, index) => (<HotelCard key={room._id} room={room} index={index}></HotelCard>))}
        </div>
      
    </div>
  )
}

export default FeauteredDestination
