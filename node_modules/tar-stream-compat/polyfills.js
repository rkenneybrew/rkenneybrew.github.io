if (!Math.trunc) {
  Math.trunc = function trunc (value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value)
  }
}
