import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LogoImg from '../../assets/logo.png'
import { verifyUser } from "../../Helpers/api";

function VerifyUser() {
    const navigate = useNavigate()
    const { id, token } = useParams();
    const [ errorMsg, setErrorMsg ] = useState(null)

    useEffect(() => {
        const verify = async () => {
            try {
                setErrorMsg(null)
                const res = await verifyUser({ id, token})

                if(res.data.success){
                    navigate('/login')
                } 
            } catch (error) {
                setErrorMsg('Unable To verify Account')
                
            }    
        }

        verify();
    }, [id, token])

    const relaod = () => {
        window.location.reload()
    }

  return (
    <div className="page pt-0 flex items-center justify-center flex-col">
        <div className='flex items-center gap-2 mb-3'>
            <img src={LogoImg} className='w-[35px]' alt='brave sub logo' />
            <span className='text-[30px] phone:text-[20px]'>Bravesub</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white shadow-xl gap-3 rounded-xl">
        {
            errorMsg ? (
                    <div className="flex flex-col gap-3">
                        <p className="font-semibold">{errorMsg}</p>
                        <button className="btn mt-[4rem]" onClick={relaod}>Retry</button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="mb-4">Verifying Account please wait...</p>
                        <div className="loading"></div>
                    </div>
                )
        }

        </div>
    </div>
  )
}

export default VerifyUser