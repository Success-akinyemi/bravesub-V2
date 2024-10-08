import MTNImg from '../assets/mtn.png'
import AirtelImg from '../assets/airtel.png'
import GLOImg from '../assets/glo.png'
import NineMobileImg from '../assets/9mobile.png'
import SmileImg from '../assets/smile.png'
 
export const dataNetworks = [
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

export const dataOptions = [
    {
        networkCode: 1,
        networkName: 'MTN',
        dataCode: '1',
        planName: '1',
        planType: 'GB',
        price: 256,
        discountAllowed: 2,
        validity: '30 DAYS',
        costPrice: 250
    },
    {
        networkCode: 1,
        networkName: 'MTN',
        dataCode: '2',
        planName: '2',
        planType: 'GB',
        price: 512,
        discountAllowed: 4,
        validity: '30 DAYS',
        costPrice: 500
    },
    {
        networkCode: 2,
        networkName: 'Airtel',
        dataCode: '1',
        planName: '1',
        planType: 'GB',
        price: 250,
        discountAllowed: 2,
        validity: '30 DAYS',
        costPrice: 240
    },
    {
        networkCode: 2,
        networkName: 'Airtel',
        dataCode: '2',
        planName: '2',
        planType: 'GB',
        price: 500,
        discountAllowed: 4,
        validity: '30 DAYS',
        costPrice: 480
    },
    {
        networkCode: 3,
        networkName: 'GLO',
        dataCode: '1',
        planName: '1',
        planType: 'GB',
        price: 250,
        discountAllowed: 2,
        validity: '30 DAYS',
        costPrice: 240
    },
    {
        networkCode: 3,
        networkName: 'GLO',
        dataCode: '2',
        planName: '2',
        planType: 'GB',
        price: 500,
        discountAllowed: 4,
        validity: '30 DAYS',
        costPrice: 480
    },
    {
        networkCode: 4,
        networkName: '9mobile',
        dataCode: '1',
        planName: '1',
        planType: 'GB',
        price: 220,
        discountAllowed: 2,
        validity: '30 DAYS',
        costPrice: 210
    },
    {
        networkCode: 4,
        networkName: '9mobile',
        dataCode: '2',
        planName: '2',
        planType: 'GB',
        price: 440,
        discountAllowed: 4,
        validity: '30 DAYS',
        costPrice: 420
    },
    {
        networkCode: 5,
        networkName: 'Smile',
        dataCode: '1',
        planName: '1',
        planType: 'GB',
        price: 240,
        discountAllowed: 2,
        validity: '30 DAYS',
        costPrice: 230
    },
    {
        networkCode: 5,
        networkName: 'Smile',
        dataCode: '2',
        planName: '2',
        planType: 'GB',
        price: 480,
        discountAllowed: 4,
        validity: '30 DAYS',
        costPrice: 460
    },

]

export const dataServices = [
    {
        text: 'Schedule Data Top-up',
        subtext: 'Never run out of data with automatic schedule',
        link: 'schedule-top-up'
    },
    {
        text: 'USSD Enquiry',
        subtext: 'get USSD code, check data balnace and more',
        link: 'ussd-enquiry'
    },
]