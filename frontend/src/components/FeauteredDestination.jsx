import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from '../components/HotelCard'

const FeauteredDestination = () => {
  return (
    <div>
        <div>
            {roomsDummyData.slice(0,4).map((room, index) => (<HotelCard key={room._id} room={room} index={index}></HotelCard>))}
        </div>
      
    </div>
  )
}

export default FeauteredDestination
