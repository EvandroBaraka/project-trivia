import { useQuery } from "@tanstack/react-query"

async function getTrivia(amount=10, difficulty, category){
    const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}${category==="" ? "" : `&category=${category}` }`
    const response = await fetch(url)
    return await response.json()
}

export function useTrivia(amount=10, difficulty, category, enabled, gameId){
    return useQuery({
        queryKey: ['trivia', amount, difficulty, category, gameId],
        queryFn: () => getTrivia(amount, difficulty, category),
        enabled: enabled,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    })
}