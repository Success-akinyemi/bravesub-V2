import { useEffect, useState } from "react";
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

export function useFetchDataPlans(query){
    const [ dataPlans, setDataPlans] = useState({ isFetchingDataPlans: true, dataPlans: null, dataPlansStatus: null, dataPlansServerError: null, })

    useEffect(() => {
        const fetchDataPlans = async () => {
            try {
                const { data, status} = !query ? await axios.get(`/data/fetAllDataPlans`, {withCredentials: true}) : await axios.get(`/data/fetAllDataPlans/${query}`, {withCredentials: true})
                //console.log('Data from Hooks>>>', data)

                if(status === 200){
                    setDataPlans({ isFetchingDataPlans: false, dataPlans: data, dataPlansStatus: status, dataPlansServerError: null})
                } else{
                    setDataPlans({ isFetchingDataPlans: false, dataPlans: null, dataPlansStatus: status, dataPlansServerError: null})
                }
            } catch (error) {
                setDataPlans({ isFetchingDataPlans: false, dataPlans: null, dataPlansStatus: null, dataPlansServerError: error})
            }
        }
        fetchDataPlans()
    }, [query])

    return dataPlans
}