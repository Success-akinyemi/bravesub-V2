import MTNImg from '../assets/mtn.png'
import AirtelImg from '../assets/airtel.png'
import GLOImg from '../assets/glo.png'
import NineMobileImg from '../assets/9mobile.png'
import SmileImg from '../assets/smile.png'


export const someAirtime = [
    {
        price: 50,
        cashback: 3
    },
    {
        price: 100,
        cashback: 6
    },
    {
        price: 200,
        cashback: 12
    },
    {
        price: 500,
        cashback: 20
    },
    {
        price: 1000,
        cashback: 60
    },
    {
        price: 2000,
        cashback: 120
    },
    {
        price: 5000,
        cashback: 300
    },
]
 
export const airtimeNetworks = [
    {
        code: 1,
        icon: MTNImg,
        network: 'MTN'
    },
    {
        code: 2,
        icon: AirtelImg,
        network: 'Airtel'
    },
    {
        code: 3,
        icon: GLOImg,
        network: 'GLO'
    },
    {
        code: 4,
        icon: NineMobileImg,
        network: '9mobile'
    },
    {
        code: 5,
        icon: SmileImg,
        network: 'Smile'
    },
]

export const airtimeServices = [
    {
        text: 'Schedule Airtime Top-up',
        subtext: 'Never run out of airtime with automatic schedule',
        link: 'schedule-top-up'
    },
    {
        text: 'USSD Enquiry',
        subtext: 'get USSD code, check phone balnace and more',
        link: 'ussd-enquiry'
    },
    {
        text: 'Recharge-to-Cash',
        subtext: 'sell airtime to get cash',
        link: ''
    },
]