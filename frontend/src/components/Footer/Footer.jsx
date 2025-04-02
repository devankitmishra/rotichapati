import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <hr />
        <div className="footer-content">
            <div className="footer-content-left">
                <img className='img' src={assets.logo} alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eum iste asperiores ut. Ex, voluptatum distinctio enim beatae natus id hic. Laborum tempore eius eveniet harum consequuntur pariatur velit consequatur.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li> <a href='/'>Home</a> </li>
                    <li>About us</li>
                    <li><a href="/myorders">Delivery</a></li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+1-222-456-7890</li>
                    <li>contact@rotichapati.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className='footer-copyright'>Copyright {new Date().getFullYear()} © rotichapti.com - All Rights Reserved.</p>
    </div>

  )
}

export default Footer