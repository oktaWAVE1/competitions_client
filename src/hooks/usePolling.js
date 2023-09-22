import { useEffect, useState } from "react";

const usePolling = (pollingFunction, interval) => {
    const [ subscription, setSubscription ] = useState(null);
    useEffect(() => {
        const id = setInterval(pollingFunction, interval)
        setSubscription(id)
        return () => {
            if(subscription){
                clearInterval(subscription);
            }
        }
    }, [])
}

export default usePolling;