import {useMemo} from "react";

export const useUserSearch = (users, searchQuery) => {
    const searchedUsers = useMemo(() => {
        if(searchQuery)
        {
            return (users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.telephone.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        }
        else {
            return (users)
        }
    }, [searchQuery, users])
    return searchedUsers
}