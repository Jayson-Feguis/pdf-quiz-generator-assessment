// Chunk text by paragraphs to avoid cutting mid-sentence
export function chunkText(text: string, maxChunkSize: number = 3000): string[] {
  const paragraphs = text.split(/\n\s*\n/); // Split by double newlines
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    console.log("currentChunk =>", currentChunk);
    if ((currentChunk + paragraph).length > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        // Force split long paragraph
        // const forcedChunks = paragraph.match(
        //   new RegExp(`.{1,${maxChunkSize}}`, "g")
        // );
        // if (forcedChunks) chunks.push(...forcedChunks);
        // currentChunk = "";
        // const forcedChunks = .match(
        //   new RegExp(`.{1,${maxChunkSize}}`, "g")
        // );
        chunks.push(paragraph);
        currentChunk = paragraph;
      }
    } else {
      currentChunk += "\n\n" + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
