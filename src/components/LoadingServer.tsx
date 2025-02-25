import React from 'react'
// import styled from 'styled-components'
import './loading.css'
const LoadingServer = () => {
  return (
    <div className='fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50'>
      {/* <div className='loader ease-linear rounded-full border-t-4 border-gray-200 h-12 w-12'></div> */}
      <div aria-label='Orange and tan hamster running in a metal wheel' role='img' className='wheel-and-hamster'>
        <div className='wheel'></div>
        <div className='hamster'>
          <div className='hamster__body'>
            <div className='hamster__head'>
              <div className='hamster__ear'></div>
              <div className='hamster__eye'></div>
              <div className='hamster__nose'></div>
            </div>
            <div className='hamster__limb hamster__limb--fr'></div>
            <div className='hamster__limb hamster__limb--fl'></div>
            <div className='hamster__limb hamster__limb--br'></div>
            <div className='hamster__limb hamster__limb--bl'></div>
            <div className='hamster__tail'></div>
          </div>
        </div>
        <div className='spoke'></div>
      </div>
    </div>
  )
}

export default LoadingServer
