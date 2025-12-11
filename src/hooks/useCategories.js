import { useQuery } from "@tanstack/react-query"

async function getCategories(){
    console.log("Buscando categorias...")
    const response = await fetch('https://opentdb.com/api_category.php')

    if (!response.ok) throw new Error('Erro ao buscar as categorias');

    const data = await response.json()
    return data.trivia_categories
}

export function useCategories(){
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    })
}