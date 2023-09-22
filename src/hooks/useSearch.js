import {useMemo} from "react";

export const useSearch = (data, searchQuery) => {
    const searchedData = useMemo(() => {
        if(searchQuery)
        {
            return (data.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        }
        else {
            return (data)
        }
    }, [searchQuery, data])
    return searchedData
}