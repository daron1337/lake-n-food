<template>
  <div class="number-pad">
    <div class="number-pad-row" v-for="row in keypadLayout" :key="row.join('')">
      <button v-for="key in row" :key="key" @click="handleKeyPress(key)">
        {{ key }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      keypadLayout: [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["C", "0", "↵"]
      ],
      currentInput: ""
    };
  },
  methods: {
    handleKeyPress(key) {
      if (key === "C") {
        this.currentInput = "";
      } else if (key === "←") {
        this.currentInput = this.currentInput.slice(0, -1);
      } else if (key === "↵") {
        this.$emit("submit", this.currentInput);
        this.currentInput = ""; // Reset input after submission
      } else {
        this.currentInput += key;
      }
      this.$emit("update", this.currentInput);
    }
  }
};
</script>

<style scoped>
.number-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.number-pad-row {
  display: flex;
}

button {
  padding: 30px;
  margin: 10px;
  font-size: 32px;
  width: 90px;
  height: 90px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 10px;
}

button:hover {
  background-color: #e0e0e0;
}

button:active {
  background-color: #d0d0d0;
}
</style>
