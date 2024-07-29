import { useEffect, useState } from "react";
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

export function useFetchDataPlans(query){
    const [ dataPlans, setDataPlans] = useState({ isFetchingDataPlans: true, dataPlans: null, dataPlansStatus: null, dataPlansServerError: null, })
    useEffect(() => {
        const fetchDataPlans = async () => {
            try {
                const { data, status} = !query ? await axios.get(`/data/fetAllDataPlans`, {withCredentials: true}) : await axios.get(`/data/fetAllDataPlans/${query}`, {withCredentials: true})
                //console.log('Data from Hooks>>>', data, 'STATUS', status)

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

export function useAdminFetAllDataPlans(query){
    const [ dataPlans, setDataPlans] = useState({ isFetchingDataPlans: true, dataPlans: null, dataPlansStatus: null, dataPlansServerError: null, })

    useEffect(() => {
        const fetchDataPlans = async () => {
            try {
                const { data, status} = !query ? await axios.get(`/data/adminFetAllDataPlans`, {withCredentials: true}) : await axios.get(`/data/adminFetAllDataPlans/${query}`, {withCredentials: true})
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

export function useFetchAllUsers(query){
    const [ allUsers, setAllUsers ] = useState({ isFetchingAllusers: true, allUsers: null, allUsersStatus: null, allUsersServerError: null, })

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const { data, status} = !query ? await axios.get(`/user/getAllUsers`, {withCredentials: true}) : await axios.get(`/user/getAllUsers/${query}`, {withCredentials: true})
                //console.log('Data from Hooks>>>', data)

                if(status === 200){
                    setAllUsers({ isFetchingAllusers: false, allUsers: data, allUsersStatus: status, allUsersServerError: null})
                } else{
                    setAllUsers({ isFetchingAllusers: false, allUsers: null, allUsersStatus: status, allUsersServerError: null})
                }
            } catch (error) {
                setAllUsers({ isFetchingAllusers: false, allUsers: null, allUsersStatus: null, allUsersServerError: error})
            }
        }
        fetchAllUsers()
    }, [query])

    return allUsers
}

/**Get all user Referres */
export function useFetchReferres(query){
    const [referresData, setReferresData] = useState({ isLoadingReferres: true, apiReferresData: null, referresStatus: null, referresServerError: null})


    useEffect(() => {
        const fetchData =  async () => {
            try {

                const { data, status} = !query ? await axios.get(`/user/getAllUserReferrees/${query}`, {withCredentials: true}) : await axios.get(`/user/getAllUserReferrees/${query}`, {withCredentials: true})
                //console.log('Referral Data from Hooks>>>', data)

                if(status === 200){
                    setReferresData({ isLoadingReferres: false, apiReferresData: data, referresStatus: status, referresServerError: null})
                } else{
                    setReferresData({ isLoadingReferres: false, apiReferresData: null, referresStatus: status, referresServerError: null})
                }
            } catch (error) {
                //console.log('ERROR', error)
                setReferresData({ isLoadingReferres: false, apiReferresData: null, referresStatus: null, referresServerError: error})
            }
        };
        fetchData()
    }, [query])

    return referresData
}