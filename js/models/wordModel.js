export async function getWords() {
  const res = await fetch("http://localhost:3000/words");
  return await res.json();
}