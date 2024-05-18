<template>
  <div class="grid-container">
    <div v-for="item in items" :key="item.number" class="square">
      <div class="number">{{ item.number }}</div>
      <div class="timestamp">{{ item.timestamp }}</div>
    </div>
  </div>
</template>

<script>
function getRandomTimeStamp() {
  const hours = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}`
}
export default {
  name: 'SquareGrid',
  data() {
    const items = Array.from({ length: 100 }, (_, i) => ({
      number: i + 1,
      timestamp: getRandomTimeStamp()
    }))
    items.sort((a, b) => {
      const timeA = a.timestamp.split(':').map(Number)
      const timeB = b.timestamp.split(':').map(Number)
      return timeB[0] - timeA[0] || timeB[1] - timeA[1]
    })
    return {
      items
    }
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  width: 100vw; /* Full viewport width */
  margin: 0; /* Remove default margin */
  padding: 10px; /* Add padding if needed */
  box-sizing: border-box;
}
.square {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 20px;
  font-weight: bold;
  aspect-ratio: 1 / 1; /* Ensure squares maintain 1:1 aspect ratio */
  width: 100%;
  color: black;
  flex-direction: column;
}
.number {
  font-size: 2em; /* Larger font size for the number */
}
.timestamp {
  font-size: 1em; /* Smaller font size for the date */
}
</style>
