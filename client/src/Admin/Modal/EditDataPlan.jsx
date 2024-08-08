import { useEffect, useState } from "react"
import { updateDataPlans } from "../../Helpers/api"
import { airtimeNetworks } from "../../data/airtime"
import LoadingBtn from "../../Components/Helpers/LoadingBtn"
import toast from "react-hot-toast"

function EditDataPlan({formData, setFormData}) {
    const [ isLoading, setIsLoading ] = useState(false)
    const networks = airtimeNetworks
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleNetworkSelect = (e) => {
        const selectedValue = parseInt(e.target.value, 10)
        const selectedNetwork = networks.find(network => network.code === selectedValue)
        setFormData({ ...formData, networkCode: selectedNetwork.code, networkName: selectedNetwork.network })
    }
    
    const handleUpdateDataPlans = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await updateDataPlans(formData)
            if(res.success){
                toast.success(res.data)
                window.location.reload()
            }
        } catch (error) {
            
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {console.log('DATA',formData)}, [formData])
  return (
    <form onSubmit={handleUpdateDataPlans} className="absolute mt-3 left-0 top-0 w-full h-full overflow-y-auto flex flex-col">
        {formData?._id ? <small>ID: {formData?._id}</small> : <h3>New Data Plan</h3>}

        <div className="w-full bg-white p-3 rounded-xl mt-3 h-full mb-2 overflow-y-auto">
            <div className="inputGroup gap-1">
                <p>Select Network:</p>
                <select onChange={handleNetworkSelect}>
                    <option value="">SELECT NETWORK</option>
                    {
                        networks?.map((item) => (
                            <option value={item?.code}>{item?.network}</option>
                        ))
                    }
                </select>
                <input type="text" className="mt-3" disabled value={formData?.networkName} />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Data Code:</p>
                <input type="text" id="dataCode" onChange={handleChange} defaultValue={formData?.dataCode} placeholder="Enter Data Code" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Plan Name:</p>
                <input type="text" id="planName" onChange={handleChange} defaultValue={formData?.planName} placeholder="Enter Data Plan Name (1,2...)" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Plan Type:</p>
                <input type="text" id="planType" onChange={handleChange} defaultValue={formData?.planType} placeholder="Enter Data Plan Type (GB or MB)" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Cost Price:</p>
                <input type="number" id="costPrice" onChange={handleChange} defaultValue={formData?.costPrice} placeholder="Enter Data Cost Price" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Data Price:</p>
                <input type="number" id="price" onChange={handleChange} defaultValue={formData?.price} placeholder="Enter Data Price" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Data Discount Allowed (Cash Back):</p>
                <input type="number" id="cashBack" onChange={handleChange} defaultValue={formData?.cashBack} placeholder="Enter discount Allowed" />
            </div>

            <div className="inputGroup mt-5 gap-[1px]">
                <p>Data Validity Period:</p>
                <input type="text" id="validity" onChange={handleChange} defaultValue={formData?.validity} placeholder="Enter data validity period" />
            </div>

            <div className="mt-8">
                {
                    isLoading ? (
                        <LoadingBtn />
                    ) : (
                        <button type="submit" className="btn">Submit</button>
                    )
                }
            </div>
        </div>

    </form>
  )
}

export default EditDataPlan
