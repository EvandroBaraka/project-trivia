async function getTrivia(amount=3, difficulty, category){
    const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}${category==="" ? "" : `&category=${category}` }`
    const response = await fetch(url)
    return await response.json()
}

export default getTrivia